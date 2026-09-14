import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import CartDrawer, { type CartItem } from "./components/CartDrawer";
import Checkout from "./components/Checkout";
import AdminDashboard from "./components/AdminDashboard";
import type { Product } from "./data/products";

type View = "home" | "shop" | "checkout" | "admin";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  function addToCart(product: Product) {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function increment(id: number) {
    setCartItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  }

  function decrement(id: number) {
    setCartItems((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i
      )
    );
  }

  function remove(id: number) {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  }

  function handleCheckout() {
    setCartOpen(false);
    setView("checkout");
  }

  function handleOrderComplete() {
    setCartItems([]);
    setTimeout(() => setView("home"), 3000);
  }

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  if (view === "admin") {
    return (
      <>
        <Navbar
          cartCount={cartCount}
          onCartOpen={() => setCartOpen(true)}
          currentView="admin"
          onNavigate={(v) => setView(v as View)}
        />
        <AdminDashboard onBack={() => setView("home")} />
        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cartItems}
          onIncrement={increment}
          onDecrement={decrement}
          onRemove={remove}
          onCheckout={handleCheckout}
        />
      </>
    );
  }

  if (view === "checkout") {
    return (
      <>
        <Navbar
          cartCount={cartCount}
          onCartOpen={() => setCartOpen(true)}
          currentView="checkout"
          onNavigate={(v) => setView(v as View)}
        />
        <Checkout
          items={cartItems}
          onBack={() => setView("shop")}
          onComplete={handleOrderComplete}
        />
      </>
    );
  }

  return (
    <>
      <Navbar
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        currentView={view}
        onNavigate={(v) => setView(v as View)}
      />

      {view === "home" && (
        <>
          <Hero onShopNow={() => setView("shop")} />
          <ProductGrid onAddToCart={addToCart} />
          <footer className="border-t border-[#E8D5CC] py-10 px-6 text-center bg-[#FFF8F2]">
            <p className="font-['Playfair_Display'] text-2xl font-bold text-[#9B1C2E] mb-1">
              pamlicious bite
            </p>
            <p className="font-['Outfit'] text-sm text-[#7A6960]">
              Crafted with love pamliciuos · © 2026
            </p>
          </footer>
        </>
      )}

      {view === "shop" && (
        <>
          <div className="pt-16">
            <div className="max-w-7xl mx-auto px-6 pt-12 pb-4">
              <button
                onClick={() => setView("home")}
                className="font-['Outfit'] text-sm text-[#7A6960] hover:text-[#9B1C2E] transition-colors mb-2"
              >
                ← Home
              </button>
            </div>
            <ProductGrid onAddToCart={addToCart} />
          </div>
          <footer className="border-t border-[#E8D5CC] py-10 px-6 text-center bg-[#FFF8F2]">
            <p className="font-['Playfair_Display'] text-2xl font-bold text-[#9B1C2E] mb-1">
              pamlicious bite
            </p>
            <p className="font-['Outfit'] text-sm text-[#7A6960]">
              Crafted with love by pamlicious bite · © 2026
            </p>
          </footer>
        </>
      )}

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onIncrement={increment}
        onDecrement={decrement}
        onRemove={remove}
        onCheckout={handleCheckout}
      />
    </>
  );
}
