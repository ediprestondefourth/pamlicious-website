import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, Calendar, Clock } from "lucide-react";
import type { CartItem } from "./CartDrawer";
import {
  formatDeliveryDate,
  getDaysInMonth,
  getFirstDayOfMonth,
  isScheduleDateDisabled,
  isSelectedScheduleDate,
  type ScheduleDate,
} from "../lib/checkout-calendar";

interface CheckoutProps {
  items: CartItem[];
  onBack: () => void;
  onComplete: () => void;
  onNotify?: (message: string, tone?: "success" | "error") => void;
}

const TIME_SLOTS = ["9:00 AM – 12:00 PM", "12:00 PM – 4:00 PM"];

interface PendingPayment {
  name: string;
  email: string;
  total: number;
  items: CartItem[];
}

export default function Checkout({ items, onBack, onComplete, onNotify }: CheckoutProps) {
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<ScheduleDate | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">("delivery");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isPaymentReturn = window.location.pathname.replace(/\/+$/, "") === "/payment/complete";
  const search = new URLSearchParams(window.location.search);
  const paymentReference = search.get("reference") || search.get("trxref");
  const [paymentResult, setPaymentResult] = useState<"checking" | "success" | "failed" | null>(
    () => isPaymentReturn ? "checking" : null
  );
  const [paymentError, setPaymentError] = useState("");
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const isEmpty = items.length === 0;
  const deliveryFee = fulfillment === "delivery" && subtotal < 15000 ? 1500 : 0;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (!isPaymentReturn) return;

    let active = true;
    let completionTimer = 0;

    async function verifyPayment() {
      if (!paymentReference) {
        setPaymentError("Paystack did not return a payment reference.");
        setPaymentResult("failed");
        return;
      }

      let pending: PendingPayment | null = null;
      try {
        const saved = sessionStorage.getItem("pamlicious-pending-payment");
        pending = saved ? JSON.parse(saved) as PendingPayment : null;
      } catch {
        pending = null;
      }
      if (!pending) {
        setPaymentError("This payment session has expired. Please contact the bakery with your Paystack receipt.");
        setPaymentResult("failed");
        return;
      }
      setPendingPayment(pending);

      try {
        const response = await fetch("/.netlify/functions/paystack-verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference: paymentReference }),
        });
        const result = await response.json();
        if (!response.ok || !result.verified || result.amountKobo !== Math.round(pending.total * 100)) {
          throw new Error(result.error || "The payment could not be confirmed.");
        }
        if (!active) return;
        sessionStorage.removeItem("pamlicious-pending-payment");
        setPaymentResult("success");
        completionTimer = window.setTimeout(() => onCompleteRef.current(), 3500);
      } catch (error) {
        if (!active) return;
        setPaymentError(error instanceof Error ? error.message : "The payment could not be confirmed.");
        setPaymentResult("failed");
      }
    }

    void verifyPayment();
    return () => {
      active = false;
      window.clearTimeout(completionTimer);
    };
  }, [isPaymentReturn, paymentReference]);

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const MONTH_NAMES = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  function isDisabled(day: number) {
    return isScheduleDateDisabled(calYear, calMonth, day);
  }

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) {
      onNotify?.("Your box is empty. Add a pastry before checking out.", "error");
      return;
    }
    if (!selectedDate || !selectedSlot) {
      onNotify?.("Choose a delivery date and time slot to continue.", "error");
      return;
    }
    setIsSubmitting(true);
    const deliveryDate = formatDeliveryDate(selectedDate);
    try {
      const response = await fetch("/.netlify/functions/paystack-initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          phone: form.phone,
          address: form.address,
          fulfillment,
          deliveryDate,
          deliverySlot: selectedSlot,
          items: items.map(({ id, name, quantity }) => ({ id, name, quantity })),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not start your payment.");
      if (result.amountKobo !== Math.round(total * 100)) {
        throw new Error("Your cart total changed. Refresh the page and try again.");
      }
      sessionStorage.setItem("pamlicious-pending-payment", JSON.stringify({
        name: form.name,
        email: form.email,
        total,
        items,
      } satisfies PendingPayment));
      window.location.assign(result.authorizationUrl);
    } catch (error) {
      setIsSubmitting(false);
      onNotify?.(error instanceof Error ? error.message : "Could not start your payment.", "error");
    }
  }

  if (paymentResult === "checking") {
    return (
      <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center px-4" role="status">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-[#E8D5CC] border-t-[#9B1C2E] motion-reduce:animate-none" />
          <h2 className="font-['Playfair_Display'] text-2xl font-bold text-[#2C2C2C]">Confirming your payment</h2>
          <p className="font-['Outfit'] text-sm text-[#7A6960] mt-2">Please keep this page open for a moment.</p>
        </div>
      </div>
    );
  }

  if (paymentResult === "failed") {
    return (
      <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#2C2C2C] mb-3">Payment not confirmed</h2>
          <p className="font-['Outfit'] text-[#7A6960] mb-6">{paymentError}</p>
          <button onClick={onBack} className="px-6 py-3 bg-[#9B1C2E] text-white rounded-full font-['Outfit'] font-semibold text-sm">
            Return to shop
          </button>
        </div>
      </div>
    );
  }

  if (paymentResult === "success") {
    return (
      <div className="min-h-screen bg-[#FFF8F2] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-[#f0faf4] flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-[#2C7A4B]" />
          </div>
          <h2 className="font-['Playfair_Display'] text-3xl font-bold text-[#2C2C2C] mb-3">
            Order Placed!
          </h2>
          <p className="font-['Outfit'] text-[#7A6960] mb-2">
            Thank you, <strong>{pendingPayment?.name}</strong>! Your payment has been confirmed.
          </p>
          <p className="font-['Outfit'] text-sm text-[#7A6960]">
            Your Paystack receipt will be sent to <strong>{pendingPayment?.email}</strong>.
          </p>
          <div className="mt-6 p-4 bg-white rounded-2xl border border-[#E8D5CC]">
            <p className="font-['Outfit'] text-sm text-[#7A6960]">Order total</p>
            <p className="font-['Playfair_Display'] text-2xl font-bold text-[#9B1C2E]">
              ₦{(pendingPayment?.total ?? total).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F2] pt-20 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#7A6960] hover:text-[#9B1C2E] font-['Outfit'] text-sm mb-8 transition-colors"
        >
          <ChevronLeft size={16} />
          Back to Cart
        </button>

        <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-[#2C2C2C] mb-10">
          Checkout
        </h1>

        {isEmpty && (
          <div role="alert" className="mb-8 rounded-2xl border border-[#E8B9B9] bg-[#FFF5F5] p-4 font-['Outfit'] text-sm text-[#B33A3A]">
            Your box is empty. Add a pastry before continuing to payment.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            {/* Left column */}
            <div className="space-y-8">
              {/* Contact */}
              <div className="bg-white rounded-2xl p-6 border border-[#E8D5CC]">
                <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#2C2C2C] mb-5">
                  Contact Details
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { id: "name", label: "Full Name", placeholder: "Pamela Okonkwo", type: "text" },
                    { id: "email", label: "Email Address", placeholder: "pamela@email.com", type: "email" },
                    { id: "phone", label: "Phone Number", placeholder: "+234 800 000 0000", type: "tel" },
                  ].map(({ id, label, placeholder, type }) => (
                    <div key={id} className={id === "address" ? "sm:col-span-2" : ""}>
                      <label className="font-['Outfit'] text-xs font-semibold text-[#7A6960] uppercase tracking-wide mb-1 block">
                        {label}
                      </label>
                      <input
                        type={type}
                        required
                        placeholder={placeholder}
                        value={form[id as keyof typeof form]}
                        onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5CC] font-['Outfit'] text-sm text-[#2C2C2C] placeholder-[#C5B5AD] focus:outline-none focus:ring-2 focus:ring-[#9B1C2E]/30 focus:border-[#9B1C2E] transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Fulfillment type */}
              <div className="bg-white rounded-2xl p-6 border border-[#E8D5CC]">
                <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#2C2C2C] mb-5">
                  Fulfillment Method
                </h3>
                <div className="grid sm:grid-cols-2 gap-3 mb-5">
                  {(["delivery", "pickup"] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFulfillment(type)}
                      className={`p-4 rounded-xl border-2 text-left transition-all font-['Outfit'] ${
                        fulfillment === type
                          ? "border-[#9B1C2E] bg-[#FFF0F5]"
                          : "border-[#E8D5CC] hover:border-[#9B1C2E]/40"
                      }`}
                    >
                      <p className="font-semibold text-[#2C2C2C] text-sm capitalize">{type}</p>
                      <p className="text-xs text-[#7A6960] mt-0.5">
                        {type === "delivery" ? "Delivered to your address" : "Pick up at our store"}
                      </p>
                    </button>
                  ))}
                </div>

                {fulfillment === "delivery" && (
                  <div>
                    <label className="font-['Outfit'] text-xs font-semibold text-[#7A6960] uppercase tracking-wide mb-1 block">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ada George Road, Rivers"
                      value={form.address}
                      onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#E8D5CC] font-['Outfit'] text-sm text-[#2C2C2C] placeholder-[#C5B5AD] focus:outline-none focus:ring-2 focus:ring-[#9B1C2E]/30 focus:border-[#9B1C2E] transition-all"
                    />
                  </div>
                )}
              </div>

              {/* Calendar */}
              <div className="bg-white rounded-2xl p-6 border border-[#E8D5CC]">
                <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#2C2C2C] mb-1 flex items-center gap-2">
                  <Calendar size={18} className="text-[#9B1C2E]" />
                  Schedule Date
                </h3>
                <p className="font-['Outfit'] text-xs text-[#7A6960] mb-5">
                  Sundays and past dates are unavailable. Orders after 2 PM ship next day.
                </p>

                <div className="flex items-center justify-between mb-4">
                  <button type="button" onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-[#FFF0F5] transition-colors">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-['Outfit'] font-semibold text-sm text-[#2C2C2C]">
                    {MONTH_NAMES[calMonth]} {calYear}
                  </span>
                  <button type="button" onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-[#FFF0F5] transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Su","Mo","Tu","We","Th","Fr","Sa"].map((d) => (
                    <div key={d} className="text-center font-['Outfit'] text-xs font-semibold text-[#7A6960] py-1">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }, (_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const disabled = isDisabled(day);
                    const selected = isSelectedScheduleDate(selectedDate, calYear, calMonth, day);
                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={disabled}
                        onClick={() => setSelectedDate({ year: calYear, month: calMonth, day })}
                        className={`aspect-square rounded-lg text-xs font-['Outfit'] font-medium transition-all ${
                          disabled
                            ? "text-[#C5B5AD] cursor-not-allowed"
                            : selected
                            ? "bg-[#9B1C2E] text-white"
                            : "hover:bg-[#FFF0F5] text-[#2C2C2C]"
                        }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {/* Time slot */}
                {selectedDate && (
                  <div className="mt-5">
                    <p className="font-['Outfit'] text-xs font-semibold text-[#7A6960] uppercase tracking-wide mb-3 flex items-center gap-1">
                      <Clock size={12} />
                      Select Time Slot
                    </p>
                    <div className="flex gap-3">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`flex-1 py-2.5 rounded-xl border text-xs font-['Outfit'] font-medium transition-all ${
                            selectedSlot === slot
                              ? "border-[#9B1C2E] bg-[#FFF0F5] text-[#9B1C2E]"
                              : "border-[#E8D5CC] text-[#7A6960] hover:border-[#9B1C2E]/40"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right column – order summary */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-6 border border-[#E8D5CC] sticky top-24">
                <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#2C2C2C] mb-5">
                  Order Summary
                </h3>
                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0 bg-[#FFF0F5]"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-['Outfit'] text-xs font-semibold text-[#2C2C2C] line-clamp-1">
                          {item.name}
                        </p>
                        <p className="font-['Outfit'] text-xs text-[#7A6960]">×{item.quantity}</p>
                      </div>
                      <span className="font-['Outfit'] text-sm font-semibold text-[#2C2C2C]">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#E8D5CC] pt-4 space-y-2">
                  <div className="flex justify-between font-['Outfit'] text-sm text-[#7A6960]">
                    <span>Subtotal</span>
                    <span>₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-['Outfit'] text-sm text-[#7A6960]">
                    <span>Delivery</span>
                    <span className={deliveryFee === 0 ? "text-[#2C7A4B] font-semibold" : ""}>
                      {deliveryFee === 0 ? "FREE" : `₦${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-['Playfair_Display'] text-lg font-bold text-[#2C2C2C] pt-2 border-t border-[#E8D5CC]">
                    <span>Total</span>
                    <span className="text-[#9B1C2E]">₦{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || isEmpty}
                  className="mt-6 w-full py-3.5 bg-[#9B1C2E] text-white rounded-full font-['Outfit'] font-semibold text-sm hover:bg-[#7d1624] transition-all duration-300 hover:shadow-lg hover:shadow-[#9B1C2E]/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? "Preparing payment..." : `Pay ₦${total.toLocaleString()}`}
                </button>
                <p className="font-['Outfit'] text-center text-xs text-[#7A6960] mt-3">
                  Powered by Paystack · 100% Secure
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
