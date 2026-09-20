import { ShoppingBag, LayoutDashboard, Moon, Sun, Menu } from "lucide-react";

interface NavbarProps {
  cartCount: number;
  onCartOpen: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  darkMode: boolean;
  onToggleTheme: () => void;
}

export default function Navbar({ cartCount, onCartOpen, currentView, onNavigate, darkMode, onToggleTheme }: NavbarProps) {
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

        <nav className="hidden lg:flex items-center gap-6">
          {["home", "shop", "about", "story", "blog", "contact"].map((v) => (
            <button
              key={v}
              onClick={() => onNavigate(v)}
              className={`font-['Outfit'] text-sm font-medium capitalize tracking-wide transition-colors ${
                currentView === v
                  ? "text-[#9B1C2E]"
                  : "text-[#7A6960] hover:text-[#2C2C2C]"
              }`}
            >
                {{ home: "Home", shop: "Shop", about: "About", story: "Our Story", blog: "Journal", contact: "Contact" }[v]}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <details className="relative lg:hidden">
            <summary className="list-none cursor-pointer p-2 rounded-full hover:bg-[#FFF0F5] text-[#7A6960]" title="Open menu">
              <Menu size={19} />
            </summary>
            <div className="absolute right-0 top-11 w-44 rounded-xl border border-[#E8D5CC] bg-[#FFF8F2] p-2 shadow-xl">
              {["home", "shop", "about", "story", "blog", "contact"].map((v) => (
                <button
                  key={v}
                  onClick={() => onNavigate(v)}
                  className="block w-full rounded-lg px-3 py-2 text-left font-['Outfit'] text-sm capitalize text-[#7A6960] hover:bg-[#FFF0F5] hover:text-[#9B1C2E]"
                >
                  {{ home: "Home", shop: "Shop", about: "About", story: "Our Story", blog: "Journal", contact: "Contact" }[v]}
                </button>
              ))}
            </div>
          </details>
          <button
            onClick={onToggleTheme}
            title={darkMode ? "Switch to light theme" : "Switch to dark theme"}
            aria-label={darkMode ? "Switch to light theme" : "Switch to dark theme"}
            className="p-2 rounded-full hover:bg-[#FFF0F5] transition-colors text-[#7A6960] hover:text-[#9B1C2E]"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
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
