interface HeroProps {
  onShopNow: () => void;
}

export default function Hero({ onShopNow }: HeroProps) {
  return (
    <section className="hero-section relative min-h-screen flex items-center overflow-hidden bg-[#FFF8F2]">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=1600&h=1000&fit=crop&auto=format')",
        }}
      />
      <div className="hero-overlay absolute inset-0 bg-gradient-to-r from-[#FFF8F2]/95 via-[#FFF8F2]/70 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 w-full pt-16">
        <div className="max-w-xl">
          <p className="hero-eyebrow font-['Outfit'] text-xs font-semibold tracking-[0.3em] uppercase text-[#C8902A] mb-4">
            Made in Rivers State · Delivered Fresh
          </p>
          <h1 className="font-['Playfair_Display'] text-5xl sm:text-6xl lg:text-7xl font-bold text-[#2C2C2C] leading-tight mb-6">
            Pastries{" "}
            <span className="hero-accent italic text-[#9B1C2E]">made</span>
            <br />
            with love.
          </h1>
          <p className="font-['Outfit'] text-base sm:text-lg text-[#7A6960] leading-relaxed mb-10 max-w-md">
            Premium handcrafted pastries for everyday indulgence, celebrations,
            and corporate gifting. Order before 2 PM for same-day delivery.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={onShopNow}
              className="px-8 py-3.5 bg-[#9B1C2E] text-white font-['Outfit'] font-semibold text-sm tracking-wide rounded-full hover:bg-[#7d1624] transition-all duration-300 hover:shadow-lg hover:shadow-[#9B1C2E]/20 hover:-translate-y-0.5"
            >
              Shop Now
            </button>
            <button
              onClick={onShopNow}
              className="hero-secondary px-8 py-3.5 border border-[#9B1C2E] text-[#9B1C2E] font-['Outfit'] font-semibold text-sm tracking-wide rounded-full hover:bg-[#FFF0F5] transition-all duration-300"
            >
              View Box Deals
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-6 mt-12">
            {[
              { num: "500+", label: "Happy Customers" },
              { num: "50+", label: "Pastry Varieties" },
              { num: "4.9★", label: "Average Rating" },
            ].map(({ num, label }) => (
              <div key={label} className="flex flex-col">
                <span className="hero-stat-value font-['Playfair_Display'] text-2xl font-bold text-[#9B1C2E]">
                  {num}
                </span>
                <span className="font-['Outfit'] text-xs text-[#7A6960]">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <div className="absolute bottom-8 right-6 sm:right-12 hidden sm:flex flex-col gap-3 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-[#E8D5CC]">
          <p className="font-['Outfit'] text-xs text-[#7A6960]">Free delivery on</p>
          <p className="font-['Outfit'] font-bold text-sm text-[#9B1C2E]">Orders above ₦15,000</p>
        </div>
        <div className="bg-[#9B1C2E]/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg">
          <p className="font-['Outfit'] text-xs text-white/70">New arrivals</p>
          <p className="font-['Outfit'] font-bold text-sm text-white">Fresh every morning 🥐</p>
        </div>
      </div>
    </section>
  );
}
