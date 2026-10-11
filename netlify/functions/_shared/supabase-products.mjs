import { CATALOG } from "./catalog.mjs";

const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function hasProductDatabase() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

function headers(prefer) {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": "application/json",
    ...(prefer ? { Prefer: prefer } : {}),
  };
}

export function toProduct(row) {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: row.price,
    image: row.image,
    hoverImage: row.hover_image,
    ...(row.badge ? { badge: row.badge } : {}),
    description: row.description,
    stock: row.stock,
    sku: row.sku,
    status: row.status,
  };
}

export function toDatabaseRow(product) {
  return {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    image: product.image,
    hover_image: product.hoverImage,
    badge: product.badge || null,
    description: product.description,
    stock: product.stock,
    sku: product.sku,
    status: product.status,
  };
}

export async function getProducts() {
  if (!hasProductDatabase()) throw new Error("Product database is not configured.");
  const response = await fetch(`${SUPABASE_URL}/rest/v1/products?select=*&order=id.asc`, {
    headers: headers(),
  });
  if (!response.ok) throw new Error("Could not load the product catalog.");
  return (await response.json()).map(toProduct);
}

export async function saveProducts(products) {
  if (!hasProductDatabase()) throw new Error("Product database is not configured.");
  const response = await fetch(`${SUPABASE_URL}/rest/v1/products?on_conflict=id`, {
    method: "POST",
    headers: headers("resolution=merge-duplicates,return=representation"),
    body: JSON.stringify(products.map(toDatabaseRow)),
  });
  if (!response.ok) throw new Error("Could not save product changes.");
  return (await response.json()).map(toProduct);
}

export async function getPaymentCatalog() {
  if (!hasProductDatabase()) {
    return Object.fromEntries(
      Object.entries(CATALOG).map(([id, product]) => [id, { ...product, status: "Active" }]),
    );
  }
  const products = await getProducts();
  return Object.fromEntries(products.map((product) => [product.id, product]));
}

export function validateProducts(products) {
  const categories = new Set(["Cakes", "Croissants", "Savory", "Box Deals"]);
  const statuses = new Set(["Active", "Draft"]);
  const badges = new Set(["Best Seller", "Gluten-Free", "Limited Stock"]);
  if (!Array.isArray(products) || products.length < 1 || products.length > 100) return false;
  const ids = new Set();
  return products.every((product) => {
    if (!Number.isInteger(product?.id) || product.id < 1 || ids.has(product.id)) return false;
    ids.add(product.id);
    return typeof product.name === "string" && product.name.trim().length > 0 && product.name.length <= 100
      && categories.has(product.category)
      && Number.isInteger(product.price) && product.price > 0 && product.price <= 10000000
      && isHttpUrl(product.image) && isHttpUrl(product.hoverImage)
      && (product.badge == null || badges.has(product.badge))
      && typeof product.description === "string" && product.description.trim().length > 0 && product.description.length <= 1000
      && Number.isInteger(product.stock) && product.stock >= 0 && product.stock <= 100000
      && typeof product.sku === "string" && product.sku.length > 0 && product.sku.length <= 40
      && statuses.has(product.status);
  });
}

function isHttpUrl(value) {
  try {
    return ["http:", "https:"].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}