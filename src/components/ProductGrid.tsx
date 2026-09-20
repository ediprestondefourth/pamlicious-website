import { useState } from "react";
import { ShoppingBag, Star } from "lucide-react";
import { products, type Category, type Product } from "../data/products";

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
  onNotify?: (message: string, tone?: "success" | "error") => void;
}

const CATEGORIES: Category[] = ["All", "Cakes", "Croissants", "Savory", "Box Deals"];

const BADGE_STYLES: Record<string, string> = {
  "Best Seller": "bg-[#9B1C2E] text-white",
  "Gluten-Free": "bg-[#2C7A4B] text-white",
  "Limited Stock": "bg-[#C8902A] text-white",
};

export default function ProductGrid({ onAddToCart, onNotify }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set());

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  function handleAdd(product: Product) {
    onAddToCart(product);
    onNotify?.("Product added to cart!", "success");
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1200);
  }

  return (
    <section id="shop" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <p className="font-['Outfit'] text-xs font-semibold tracking-[0.3em] uppercase text-[#C8902A] mb-3">
          Fresh Daily
        </p>
        <h2 className="font-['Playfair_Display'] text-4xl sm:text-5xl font-bold text-[#2C2C2C] mb-4">
          Our Pastries
        </h2>
        <p className="font-['Outfit'] text-[#7A6960] max-w-md mx-auto">
          Every item is baked fresh each morning using premium, locally-sourced ingredients.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full font-['Outfit'] text-sm font-medium transition-all duration-200 ${
              activeCategory === cat
                ? "bg-[#9B1C2E] text-white shadow-md shadow-[#9B1C2E]/20"
                : "bg-white border border-[#E8D5CC] text-[#7A6960] hover:border-[#9B1C2E] hover:text-[#9B1C2E]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#7A6960] font-['Outfit']">
          No pastries in this category yet — check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-2xl overflow-hidden border border-[#E8D5CC] hover:shadow-xl hover:shadow-[#9B1C2E]/10 transition-all duration-300 hover:-translate-y-1"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden bg-[#FFF0F5]">
                <img
                  src={hoveredId === product.id ? product.hoverImage : product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                />

                {/* Badge */}
                {product.badge && (
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold font-['Outfit'] tracking-wide ${
                      BADGE_STYLES[product.badge]
                    }`}
                  >
                    {product.badge}
                  </span>
                )}

                {/* Stock warning */}
                {product.stock <= 5 && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 bg-black/60 text-white rounded-full text-[10px] font-['Outfit']">
                    {product.stock} left
                  </span>
                )}

                {/* Add to box overlay */}
                <div className="absolute inset-0 bg-[#2C2C2C]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                  <button
                    onClick={() => handleAdd(product)}
                    disabled={addedIds.has(product.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-['Outfit'] text-sm font-semibold transition-all duration-200 ${
                      addedIds.has(product.id)
                        ? "bg-[#2C7A4B] text-white scale-95"
                        : "bg-white text-[#9B1C2E] hover:bg-[#9B1C2E] hover:text-white"
                    }`}
                  >
                    <ShoppingBag size={14} />
                    {addedIds.has(product.id) ? "Added!" : "Add to Box +"}
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-['Playfair_Display'] font-semibold text-[#2C2C2C] text-base leading-snug">
                    {product.name}
                  </h3>
                </div>
                <p className="font-['Outfit'] text-xs text-[#7A6960] mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-['Outfit'] font-bold text-[#9B1C2E] text-lg">
                    ₦{product.price.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-1 text-[#C8902A]">
                    <Star size={12} fill="currentColor" />
                    <span className="font-['Outfit'] text-xs text-[#7A6960]">4.9</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
