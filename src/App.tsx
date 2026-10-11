import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProductGrid from "./components/ProductGrid";
import CartDrawer, { type CartItem } from "./components/CartDrawer";
import Checkout from "./components/Checkout";
import AdminDashboard from "./components/AdminDashboard";
import { SocialFeed } from "./components/SitePages";
import SitePages from "./components/SitePages";
import Footer from "./components/Footer";
import FAQSection from "./components/FAQSection";
import ChatWidget from "./components/ChatWidget";
import Toast, { type ToastMessage } from "./components/Toast";
import LoadingScreen from "./components/LoadingScreen";
import type { Product } from "./data/products";

type View = "home" | "shop" | "about" | "story" | "blog" | "contact" | "checkout" | "admin";

const VIEWS: View[] = ["home", "shop", "about", "story", "blog", "contact", "checkout", "admin"];

function getViewFromLocation(): View {
  if (window.location.pathname.replace(/\/+$/, "") === "/admin") return "admin";
  const hash = window.location.hash.replace("#", "") as View;
  return VIEWS.includes(hash) ? hash : "home";
}

export default function App() {
  const [view, setView] = useState<View>(getViewFromLocation);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("pamlicious-theme") === "dark");
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? "dark" : "light";
    localStorage.setItem("pamlicious-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    function syncView() {
      setView(getViewFromLocation());
    }

    window.addEventListener("hashchange", syncView);
    window.addEventListener("popstate", syncView);
    return () => {
      window.removeEventListener("hashchange", syncView);
      window.removeEventListener("popstate", syncView);
    };
  }, []);

  function navigateTo(nextView: string) {
    const next = VIEWS.includes(nextView as View) ? nextView : "home";
    const nextUrl = next === "admin" ? "/admin" : next === "home" ? "/" : `/#${next}`;
    window.history.pushState(null, "", nextUrl);
    setView(next as View);
  }

  function notify(message: string, tone: ToastMessage["tone"] = "success") {
    const id = Date.now();
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4200);
  }

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
    notify(`${product.name} added to your box.`);
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
    if (cartItems.length === 0) {
      notify("Your box is empty. Add a pastry before checking out.", "error");
      return;
    }
    setCartOpen(false);
    setView("checkout");
  }

  function handleOrderComplete() {
    setCartItems([]);
    notify("Order confirmed. We are getting your bake ready!");
    setTimeout(() => navigateTo("home"), 3000);
  }

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const sharedNavbar = (
    <Navbar
      cartCount={cartCount}
      onCartOpen={() => setCartOpen(true)}
      currentView={view}
      onNavigate={navigateTo}
      darkMode={darkMode}
      onToggleTheme={() => setDarkMode((value) => !value)}
    />
  );

  const sharedFooter = <Footer onNavigate={navigateTo} onNotify={notify} />;
  const sharedChat = <ChatWidget />;
  const sharedToast = <Toast messages={toasts} onDismiss={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))} />;

  if (isLoading) return <LoadingScreen />;

  if (view === "admin") {
    return (
      <>
        {sharedNavbar}
        <AdminDashboard onBack={() => navigateTo("home")} />
        <CartDrawer
          isOpen={cartOpen}
          onClose={() => setCartOpen(false)}
          items={cartItems}
          onIncrement={increment}
          onDecrement={decrement}
          onRemove={remove}
          onCheckout={handleCheckout}
        />
        {sharedFooter}
        {sharedChat}
        {sharedToast}
      </>
    );
  }

  if (view === "checkout") {
    return (
      <>
        {sharedNavbar}
        <Checkout
          items={cartItems}
          onBack={() => navigateTo("shop")}
          onComplete={handleOrderComplete}
          onNotify={notify}
        />
        {sharedFooter}
        {sharedChat}
        {sharedToast}
      </>
    );
  }

  return (
    <>
      {sharedNavbar}

      {view === "home" && (
        <>
          <Hero onShopNow={() => navigateTo("shop")} />
          <ProductGrid onAddToCart={addToCart} />
          <SocialFeed />
          <FAQSection />
        </>
      )}

      {view === "shop" && (
        <>
          <div className="pt-16">
            <div className="max-w-7xl mx-auto px-6 pt-12 pb-4">
              <button
                onClick={() => navigateTo("home")}
                className="font-['Outfit'] text-sm text-[#7A6960] hover:text-[#9B1C2E] transition-colors mb-2"
              >
                ← Home
              </button>
            </div>
            <ProductGrid onAddToCart={addToCart} />
          </div>
        </>
      )}

      {["about", "story", "blog", "contact"].includes(view) && (
        <SitePages page={view as "about" | "story" | "blog" | "contact"} onNavigate={navigateTo} onNotify={notify} />
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
      {sharedFooter}
      {sharedChat}
      {sharedToast}
    </>
  );
}
