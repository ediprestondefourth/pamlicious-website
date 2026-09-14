import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, Calendar, Clock } from "lucide-react";
import type { CartItem } from "./CartDrawer";

interface CheckoutProps {
  items: CartItem[];
  onBack: () => void;
  onComplete: () => void;
}

const TIME_SLOTS = ["9:00 AM – 12:00 PM", "12:00 PM – 4:00 PM"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function Checkout({ items, onBack, onComplete }: CheckoutProps) {
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">("delivery");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [submitted, setSubmitted] = useState(false);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = subtotal >= 15000 ? 0 : 1500;
  const total = subtotal + deliveryFee;

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const MONTH_NAMES = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  function isDisabled(day: number) {
    const d = new Date(calYear, calMonth, day);
    const now = new Date();
    if (d.getDay() === 0) return true; // Sunday
    if (d < new Date(now.getFullYear(), now.getMonth(), now.getDate())) return true; // past
    if (
      d.toDateString() === now.toDateString() &&
      now.getHours() >= 14
    )
      return true; // today after 2 PM
    return false;
  }

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(onComplete, 2500);
  }

  if (submitted) {
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
            Thank you, <strong>{form.name}</strong>! Your order has been received.
          </p>
          <p className="font-['Outfit'] text-sm text-[#7A6960]">
            You'll receive a confirmation at <strong>{form.email}</strong>.
          </p>
          <div className="mt-6 p-4 bg-white rounded-2xl border border-[#E8D5CC]">
            <p className="font-['Outfit'] text-sm text-[#7A6960]">Order total</p>
            <p className="font-['Playfair_Display'] text-2xl font-bold text-[#9B1C2E]">
              ₦{total.toLocaleString()}
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
                      placeholder="5 Admiralty Way, Lekki Phase 1, Lagos"
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
                    const selected = selectedDate === day && calMonth === today.getMonth();
                    return (
                      <button
                        key={day}
                        type="button"
                        disabled={disabled}
                        onClick={() => setSelectedDate(day)}
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
                  className="mt-6 w-full py-3.5 bg-[#9B1C2E] text-white rounded-full font-['Outfit'] font-semibold text-sm hover:bg-[#7d1624] transition-all duration-300 hover:shadow-lg hover:shadow-[#9B1C2E]/20"
                >
                  Pay ₦{total.toLocaleString()}
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
