import { useState } from "react";
import {
  TrendingUp, Package, AlertTriangle, Star,
  Edit2, ToggleLeft, ToggleRight, ChevronLeft,
  BarChart2, ShoppingCart, LogOut, Save, X,
} from "lucide-react";
import type { Product } from "../data/products";

type OrderStatus = "Pending" | "Baking" | "Out for Delivery" | "Delivered";

interface Order {
  id: string;
  customer: string;
  value: number;
  fulfillment: "Delivery" | "Pickup";
  date: string;
  slot: string;
  payment: "Paid" | "Unpaid";
  status: OrderStatus;
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Baking: "bg-blue-100 text-blue-800",
  "Out for Delivery": "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
};

const MOCK_ORDERS: Order[] = [
  { id: "PB-2041", customer: "Chisom Eze", value: 32000, fulfillment: "Delivery", date: "14 Sep 2026", slot: "12:00 PM – 4:00 PM", payment: "Paid", status: "Baking" },
  { id: "PB-2040", customer: "Tunde Adeyemi", value: 18500, fulfillment: "Pickup", date: "14 Sep 2026", slot: "9:00 AM – 12:00 PM", payment: "Paid", status: "Out for Delivery" },
  { id: "PB-2039", customer: "Ngozi Williams", value: 7500, fulfillment: "Delivery", date: "13 Sep 2026", slot: "12:00 PM – 4:00 PM", payment: "Paid", status: "Delivered" },
  { id: "PB-2038", customer: "Emeka Obi", value: 14500, fulfillment: "Delivery", date: "13 Sep 2026", slot: "9:00 AM – 12:00 PM", payment: "Unpaid", status: "Pending" },
  { id: "PB-2037", customer: "Fatima Hassan", value: 9800, fulfillment: "Pickup", date: "12 Sep 2026", slot: "12:00 PM – 4:00 PM", payment: "Paid", status: "Delivered" },
];

const MONTHLY_DATA = [42, 58, 71, 65, 88, 94, 78, 102, 115, 98, 132, 145];
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

type Tab = "overview" | "inventory" | "orders";

interface AdminDashboardProps {
  onBack: () => void;
  onLogout: () => void;
  products: Product[];
  onProductsChange: (products: Product[]) => void;
}

const PRODUCT_CATEGORIES: Product["category"][] = ["Cakes", "Croissants", "Savory", "Box Deals"];

export default function AdminDashboard({ onBack, onLogout, products, onProductsChange }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const maxVal = Math.max(...MONTHLY_DATA);
  const lowStock = products.filter((p) => p.stock < 5);
  const totalSalesToday = orders
    .filter((o) => o.date === "14 Sep 2026" && o.payment === "Paid")
    .reduce((s, o) => s + o.value, 0);
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;

  function toggleStatus(id: number) {
    onProductsChange(
      products.map((p) => p.id === id ? { ...p, status: p.status === "Active" ? "Draft" : "Active" } : p)
    );
  }

  function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingProduct) return;
    onProductsChange(products.map((product) => product.id === editingProduct.id ? editingProduct : product));
    setEditingProduct(null);
  }

  function updateOrderStatus(orderId: string, status: OrderStatus) {
    setOrders((prev) =>
      prev.map((o) => o.id === orderId ? { ...o, status } : o)
    );
  }

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <BarChart2 size={16} /> },
    { id: "inventory", label: "Inventory", icon: <Package size={16} /> },
    { id: "orders", label: "Orders", icon: <ShoppingCart size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F5EDE8] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-[#7A6960] hover:text-[#9B1C2E] font-['Outfit'] text-sm mb-2 transition-colors"
            >
              <ChevronLeft size={14} /> Back to Store
            </button>
            <h1 className="font-['Playfair_Display'] text-3xl font-bold text-[#2C2C2C]">
              Admin Dashboard
            </h1>
            <p className="font-['Outfit'] text-sm text-[#7A6960] mt-1">
              pamlicious bite · September 14, 2026
            </p>
          </div>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-full border border-[#E8D5CC] bg-white px-4 py-2 font-['Outfit'] text-sm font-medium text-[#7A6960] hover:text-[#9B1C2E]"
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-[#E8D5CC] w-fit mb-8">
          {TABS.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-['Outfit'] text-sm font-medium transition-all ${
                activeTab === id
                  ? "bg-[#9B1C2E] text-white shadow"
                  : "text-[#7A6960] hover:text-[#2C2C2C]"
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* KPI cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Total Sales Today",
                  value: `₦${totalSalesToday.toLocaleString()}`,
                  icon: <TrendingUp size={20} />,
                  color: "text-[#9B1C2E]",
                  bg: "bg-[#FFF0F5]",
                },
                {
                  label: "Pending Orders",
                  value: pendingOrders.toString(),
                  icon: <ShoppingCart size={20} />,
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  label: "Low Stock Alerts",
                  value: lowStock.length.toString(),
                  icon: <AlertTriangle size={20} />,
                  color: "text-[#C8902A]",
                  bg: "bg-amber-50",
                },
                {
                  label: "Top Pastry This Week",
                  value: "Celebration Box",
                  icon: <Star size={20} />,
                  color: "text-[#2C7A4B]",
                  bg: "bg-green-50",
                },
              ].map(({ label, value, icon, color, bg }) => (
                <div key={label} className="bg-white rounded-2xl p-5 border border-[#E8D5CC]">
                  <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center mb-3`}>
                    {icon}
                  </div>
                  <p className="font-['Outfit'] text-xs text-[#7A6960] font-medium mb-1">{label}</p>
                  <p className={`font-['Playfair_Display'] text-2xl font-bold ${color}`}>{value}</p>
                </div>
              ))}
            </div>

            {/* Monthly sales chart */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8D5CC]">
              <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#2C2C2C] mb-6">
                Monthly Sales (Units)
              </h3>
              <div className="flex items-end gap-2 h-40">
                {MONTHLY_DATA.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        i === 8 ? "bg-[#9B1C2E]" : "bg-[#E8D5CC] hover:bg-[#C8902A]"
                      }`}
                      style={{ height: `${(val / maxVal) * 100}%` }}
                      title={`${val} units`}
                    />
                    <span className="font-['Outfit'] text-[9px] text-[#7A6960]">{MONTHS[i]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category donut */}
            <div className="bg-white rounded-2xl p-6 border border-[#E8D5CC]">
              <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#2C2C2C] mb-5">
                Sales by Category
              </h3>
              <div className="flex flex-wrap gap-4">
                {[
                  { cat: "Cakes", pct: 42, color: "#9B1C2E" },
                  { cat: "Box Deals", pct: 28, color: "#C8902A" },
                  { cat: "Croissants", pct: 18, color: "#7A6960" },
                  { cat: "Savory", pct: 12, color: "#2C7A4B" },
                ].map(({ cat, pct, color }) => (
                  <div key={cat} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
                    <span className="font-['Outfit'] text-sm text-[#2C2C2C]">{cat}</span>
                    <span className="font-['Outfit'] text-sm font-bold text-[#2C2C2C]">{pct}%</span>
                  </div>
                ))}
              </div>
              <div className="flex h-5 rounded-full overflow-hidden mt-4 gap-0.5">
                {[
                  { pct: 42, color: "#9B1C2E" },
                  { pct: 28, color: "#C8902A" },
                  { pct: 18, color: "#7A6960" },
                  { pct: 12, color: "#2C7A4B" },
                ].map(({ pct, color }, i) => (
                  <div key={i} style={{ width: `${pct}%`, background: color }} className="h-full rounded-sm" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* INVENTORY */}
        {activeTab === "inventory" && (
          <div className="bg-white rounded-2xl border border-[#E8D5CC] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8D5CC] bg-[#F5EDE8]">
                    {["Product", "SKU", "Category", "Price (₦)", "Stock", "Status"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 font-['Outfit'] text-xs font-semibold text-[#7A6960] uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8D5CC]">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FFF8F2] transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-9 h-9 rounded-lg object-cover bg-[#FFF0F5] flex-shrink-0"
                          />
                          <span className="font-['Outfit'] font-medium text-[#2C2C2C] text-sm line-clamp-1">
                            {p.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-['Outfit'] text-xs text-[#7A6960] font-mono">
                        {p.sku}
                      </td>
                      <td className="px-4 py-3 font-['Outfit'] text-xs text-[#7A6960]">
                        {p.category}
                      </td>
                      <td className="px-4 py-3 font-['Outfit'] text-sm font-semibold text-[#2C2C2C]">
                        {p.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-['Outfit'] text-sm font-semibold ${
                            p.stock < 5 ? "text-[#C8902A]" : "text-[#2C2C2C]"
                          }`}
                        >
                          {p.stock}
                          {p.stock < 5 && (
                            <AlertTriangle size={12} className="inline ml-1 text-[#C8902A]" />
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleStatus(p.id)}
                            className={`flex items-center gap-1.5 font-['Outfit'] text-xs font-medium px-3 py-1 rounded-full transition-all ${
                              p.status === "Active"
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {p.status === "Active" ? (
                              <ToggleRight size={14} />
                            ) : (
                              <ToggleLeft size={14} />
                            )}
                            {p.status}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingProduct({ ...p })}
                            aria-label={`Edit ${p.name}`}
                            title={`Edit ${p.name}`}
                            className="p-1 text-[#7A6960] hover:text-[#9B1C2E] transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {editingProduct && (
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4 py-6"
            onMouseDown={(event) => { if (event.target === event.currentTarget) setEditingProduct(null); }}
          >
            <form
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-product-title"
              onSubmit={saveProduct}
              className="max-h-full w-full max-w-lg overflow-y-auto rounded-xl border border-[#E8D5CC] bg-[#FFF8F2] p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 id="edit-product-title" className="font-['Playfair_Display'] text-xl font-bold text-[#2C2C2C]">Edit product</h2>
                  <p className="mt-1 font-['Outfit'] text-xs text-[#7A6960]">SKU: {editingProduct.sku}</p>
                </div>
                <button type="button" aria-label="Close editor" onClick={() => setEditingProduct(null)} className="rounded-full p-2 text-[#7A6960] hover:bg-[#FFF0F5]">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <label className="block font-['Outfit'] text-xs font-semibold text-[#7A6960]">
                  Product name
                  <input required value={editingProduct.name} onChange={(event) => setEditingProduct({ ...editingProduct, name: event.target.value })} className="mt-1 w-full rounded-lg border border-[#E8D5CC] bg-white px-3 py-2.5 text-sm text-[#2C2C2C]" />
                </label>
                <label className="block font-['Outfit'] text-xs font-semibold text-[#7A6960]">
                  Category
                  <select value={editingProduct.category} onChange={(event) => setEditingProduct({ ...editingProduct, category: event.target.value as Product["category"] })} className="mt-1 w-full rounded-lg border border-[#E8D5CC] bg-white px-3 py-2.5 text-sm text-[#2C2C2C]">
                    {PRODUCT_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
                  </select>
                </label>
                <label className="block font-['Outfit'] text-xs font-semibold text-[#7A6960]">
                  Description
                  <textarea required rows={3} value={editingProduct.description} onChange={(event) => setEditingProduct({ ...editingProduct, description: event.target.value })} className="mt-1 w-full resize-y rounded-lg border border-[#E8D5CC] bg-white px-3 py-2.5 text-sm text-[#2C2C2C]" />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block font-['Outfit'] text-xs font-semibold text-[#7A6960]">
                    Price (Naira)
                    <input required min={1} step={1} type="number" value={editingProduct.price} onChange={(event) => setEditingProduct({ ...editingProduct, price: Number(event.target.value) })} className="mt-1 w-full rounded-lg border border-[#E8D5CC] bg-white px-3 py-2.5 text-sm text-[#2C2C2C]" />
                  </label>
                  <label className="block font-['Outfit'] text-xs font-semibold text-[#7A6960]">
                    Stock count
                    <input required min={0} step={1} type="number" value={editingProduct.stock} onChange={(event) => setEditingProduct({ ...editingProduct, stock: Number(event.target.value) })} className="mt-1 w-full rounded-lg border border-[#E8D5CC] bg-white px-3 py-2.5 text-sm text-[#2C2C2C]" />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block font-['Outfit'] text-xs font-semibold text-[#7A6960]">
                    Image URL
                    <input required type="url" value={editingProduct.image} onChange={(event) => setEditingProduct({ ...editingProduct, image: event.target.value })} className="mt-1 w-full rounded-lg border border-[#E8D5CC] bg-white px-3 py-2.5 text-sm text-[#2C2C2C]" />
                  </label>
                  <label className="block font-['Outfit'] text-xs font-semibold text-[#7A6960]">
                    Hover image URL
                    <input required type="url" value={editingProduct.hoverImage} onChange={(event) => setEditingProduct({ ...editingProduct, hoverImage: event.target.value })} className="mt-1 w-full rounded-lg border border-[#E8D5CC] bg-white px-3 py-2.5 text-sm text-[#2C2C2C]" />
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingProduct(null)} className="rounded-full border border-[#E8D5CC] bg-white px-5 py-2.5 font-['Outfit'] text-sm font-medium text-[#7A6960]">Cancel</button>
                <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-[#9B1C2E] px-5 py-2.5 font-['Outfit'] text-sm font-semibold text-white hover:bg-[#7d1624]">
                  <Save size={15} /> Save product
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-[#E8D5CC] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E8D5CC] bg-[#F5EDE8]">
                    {["Order ID", "Customer", "Value", "Type", "Date / Slot", "Payment", "Status"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 font-['Outfit'] text-xs font-semibold text-[#7A6960] uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8D5CC]">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#FFF8F2] transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-[#7A6960]">{order.id}</td>
                      <td className="px-4 py-3 font-['Outfit'] font-medium text-[#2C2C2C]">{order.customer}</td>
                      <td className="px-4 py-3 font-['Outfit'] font-semibold text-[#9B1C2E]">
                        ₦{order.value.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-['Outfit'] text-xs text-[#7A6960]">
                        {order.fulfillment}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-['Outfit'] text-xs text-[#2C2C2C]">{order.date}</p>
                        <p className="font-['Outfit'] text-[10px] text-[#7A6960]">{order.slot}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-['Outfit'] text-xs font-medium px-2.5 py-1 rounded-full ${
                            order.payment === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.payment}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className={`text-xs font-['Outfit'] font-semibold px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#9B1C2E]/30 ${STATUS_STYLES[order.status]}`}
                        >
                          {(["Pending", "Baking", "Out for Delivery", "Delivered"] as OrderStatus[]).map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
