export type Category = "All" | "Cakes" | "Croissants" | "Savory" | "Box Deals";

export interface Product {
  id: number;
  name: string;
  category: Exclude<Category, "All">;
  price: number;
  image: string;
  hoverImage: string;
  badge?: "Best Seller" | "Gluten-Free" | "Limited Stock";
  description: string;
  stock: number;
  sku: string;
  status: "Active" | "Draft";
}

export const products: Product[] = [
  {
    id: 1,
    name: "Strawberry Dream Cake",
    category: "Cakes",
    price: 18500,
    image: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&h=600&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1615796701805-2094ac54bbf9?w=600&h=600&fit=crop&auto=format",
    badge: "Best Seller",
    description: "Layers of moist vanilla sponge, fresh strawberry compote, and whipped cream.",
    stock: 12,
    sku: "CAK-001",
    status: "Active",
  },
  {
    id: 2,
    name: "Classic Butter Croissant",
    category: "Croissants",
    price: 2800,
    image: "https://images.unsplash.com/photo-1534432182912-63863115e106?w=600&h=600&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=600&h=600&fit=crop&auto=format",
    badge: "Best Seller",
    description: "Flaky, golden-brown pastry with rich European butter, baked to perfection.",
    stock: 30,
    sku: "CRO-001",
    status: "Active",
  },
  {
    id: 3,
    name: "Chocolate Velvet Cupcakes",
    category: "Cakes",
    price: 7500,
    image: "https://images.unsplash.com/photo-1595144780677-6d0b5abbd089?w=600&h=600&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1547398847-19d7560a6257?w=600&h=600&fit=crop&auto=format",
    description: "Rich dark chocolate cupcakes with silky ganache frosting. Box of 6.",
    stock: 4,
    sku: "CAK-002",
    status: "Active",
    badge: "Limited Stock",
  },
  {
    id: 4,
    name: "Almond & Herb Cheese Roll",
    category: "Savory",
    price: 4200,
    image: "https://images.unsplash.com/photo-1639832899627-5d77c5ce1eb8?w=600&h=600&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1711141326113-e6b607fd78ef?w=600&h=600&fit=crop&auto=format",
    description: "Savory hand-rolled pastry filled with aged cheese, toasted almonds, and fresh herbs.",
    stock: 20,
    sku: "SAV-001",
    status: "Active",
  },
  {
    id: 5,
    name: "Celebration Box — Assorted",
    category: "Box Deals",
    price: 32000,
    image: "https://images.unsplash.com/photo-1711141326113-e6b607fd78ef?w=600&h=600&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1583338917451-face2751d8d5?w=600&h=600&fit=crop&auto=format",
    badge: "Best Seller",
    description: "Curated box of 12 assorted pastries — perfect for events and gifting.",
    stock: 8,
    sku: "BOX-001",
    status: "Active",
  },
  {
    id: 6,
    name: "Gluten-Free Lemon Tart",
    category: "Cakes",
    price: 9800,
    image: "https://images.unsplash.com/photo-1615796701805-2094ac54bbf9?w=600&h=600&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&h=600&fit=crop&auto=format",
    badge: "Gluten-Free",
    description: "Tangy lemon curd in a gluten-free almond pastry shell with candied zest.",
    stock: 15,
    sku: "CAK-003",
    status: "Active",
  },
  {
    id: 7,
    name: "Ham & Spinach Quiche",
    category: "Savory",
    price: 5500,
    image: "https://images.unsplash.com/photo-1534432182912-63863115e106?w=600&h=600&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1639832899627-5d77c5ce1eb8?w=600&h=600&fit=crop&auto=format",
    description: "Classic French quiche with smoked ham, wilted spinach, and gruyère.",
    stock: 10,
    sku: "SAV-002",
    status: "Active",
  },
  {
    id: 8,
    name: "Mini Pastry Gift Box",
    category: "Box Deals",
    price: 14500,
    image: "https://images.unsplash.com/photo-1547398847-19d7560a6257?w=600&h=600&fit=crop&auto=format",
    hoverImage: "https://images.unsplash.com/photo-1595144780677-6d0b5abbd089?w=600&h=600&fit=crop&auto=format",
    description: "6 hand-selected mini pastries beautifully boxed — ideal corporate gift.",
    stock: 3,
    sku: "BOX-002",
    status: "Active",
    badge: "Limited Stock",
  },
];
