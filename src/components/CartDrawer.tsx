import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import type { Product } from "../data/products";

export interface CartItem extends Product {
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
}

const FREE_DELIVERY_THRESHOLD = 15000;

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onIncrement,
  onDecrement,
  onRemove,
  onCheckout,
}: CartDrawerProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const progress = Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_DELIVERY_THRESHOLD - subtotal, 0);
  const hasDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md z-50 bg-[#FFF8F2] shadow-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8D5CC]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-[#9B1C2E]" />
            <h2 className="font-['Playfair_Display'] text-xl font-bold text-[#2C2C2C]">
              Your Box
            </h2>
            {items.length > 0 && (
              <span className="bg-[#9B1C2E] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center font-['Outfit']">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#FFF0F5] transition-colors text-[#7A6960]"
          >
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
            <div className="w-16 h-16 rounded-full bg-[#FFF0F5] flex items-center justify-center">
              <ShoppingBag size={28} className="text-[#9B1C2E]" />
            </div>
            <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#2C2C2C]">
              Your box is empty
            </h3>
            <p className="font-['Outfit'] text-sm text-[#7A6960]">
              Add some delicious pastries to get started!
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 bg-[#9B1C2E] text-white rounded-full font-['Outfit'] font-semibold text-sm hover:bg-[#7d1624] transition-colors"
            >
              Browse Pastries
            </button>
          </div>
        ) : (
          <>
            {/* Free delivery tracker */}
            <div className={`mx-6 mt-4 p-4 rounded-xl border ${hasDelivery ? "border-[#2C7A4B] bg-[#f0faf4]" : "border-[#E8D5CC] bg-white"}`}>
              {hasDelivery ? (
                <p className="font-['Outfit'] text-sm font-medium text-[#2C7A4B]">
                  🎉 You've unlocked Free Delivery!
                </p>
              ) : (
                <>
                  <p className="font-['Outfit'] text-xs text-[#7A6960] mb-2">
                    Add{" "}
                    <span className="font-bold text-[#9B1C2E]">
                      ₦{remaining.toLocaleString()}
                    </span>{" "}
                    more for Free Delivery!
                  </p>
                  <div className="h-1.5 bg-[#E8D5CC] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#9B1C2E] rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 bg-white rounded-xl p-3 border border-[#E8D5CC]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 bg-[#FFF0F5]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-['Outfit'] text-sm font-semibold text-[#2C2C2C] leading-snug line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="font-['Outfit'] text-xs text-[#7A6960] mt-0.5">
                      ₦{item.price.toLocaleString()} each
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            item.quantity === 1 ? onRemove(item.id) : onDecrement(item.id)
                          }
                          className="w-6 h-6 rounded-full border border-[#E8D5CC] flex items-center justify-center hover:border-[#9B1C2E] hover:text-[#9B1C2E] transition-colors"
                        >
                          {item.quantity === 1 ? (
                            <Trash2 size={10} />
                          ) : (
                            <Minus size={10} />
                          )}
                        </button>
                        <span className="font-['Outfit'] text-sm font-bold text-[#2C2C2C] w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onIncrement(item.id)}
                          className="w-6 h-6 rounded-full border border-[#E8D5CC] flex items-center justify-center hover:border-[#9B1C2E] hover:text-[#9B1C2E] transition-colors"
                        >
                          <Plus size={10} />
                        </button>
                      </div>
                      <span className="font-['Outfit'] text-sm font-bold text-[#9B1C2E]">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-[#E8D5CC] bg-white">
              <div className="flex justify-between items-center mb-4">
                <span className="font-['Outfit'] text-sm text-[#7A6960]">Subtotal</span>
                <span className="font-['Playfair_Display'] text-xl font-bold text-[#2C2C2C]">
                  ₦{subtotal.toLocaleString()}
                </span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#9B1C2E] text-white rounded-full font-['Outfit'] font-semibold text-sm hover:bg-[#7d1624] transition-all duration-300 hover:shadow-lg hover:shadow-[#9B1C2E]/20"
              >
                Proceed to Checkout
                <ArrowRight size={16} />
              </button>
              <p className="font-['Outfit'] text-center text-xs text-[#7A6960] mt-3">
                Secure checkout · Paystack / Bank Transfer
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
