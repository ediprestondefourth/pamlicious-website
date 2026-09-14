import { ShoppingBag, LayoutDashboard } from "lucide-react";

interface NavbarProps {
  cartCount: number;
  onCartOpen: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
}

export default function Navbar({ cartCount, onCartOpen, currentView, onNavigate }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFF8F2]/95 backdrop-blur-sm border-b border-[#E8D5CC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <button
          onClick={() => onNavigate("home")}
          className="flex flex-col leading-none"
        >
          <span className="font-['Playfair_Display'] font-bold text-xl text-[#9B1C2E] tracking-tight">
            pamlicious
          </span>
          <span className="font-['Outfit'] text-[10px] font-medium tracking-[0.2em] text-[#C8902A] uppercase">
            bite
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {["home", "shop"].map((v) => (
            <button
              key={v}
              onClick={() => onNavigate(v)}
              className={`font-['Outfit'] text-sm font-medium capitalize tracking-wide transition-colors ${
                currentView === v
                  ? "text-[#9B1C2E]"
                  : "text-[#7A6960] hover:text-[#2C2C2C]"
              }`}
            >
              {v === "shop" ? "Our Pastries" : "Home"}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("admin")}
            title="Admin Dashboard"
            className="p-2 rounded-full hover:bg-[#FFF0F5] transition-colors text-[#7A6960] hover:text-[#9B1C2E]"
          >
            <LayoutDashboard size={18} />
          </button>
          <button
            onClick={onCartOpen}
            className="relative p-2 rounded-full hover:bg-[#FFF0F5] transition-colors text-[#2C2C2C]"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#9B1C2E] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
