import { isValidAdminToken } from "./_shared/admin-session.mjs";
import { getProducts, hasProductDatabase, saveProducts, validateProducts } from "./_shared/supabase-products.mjs";

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

export async function handler(event) {
  if (!hasProductDatabase()) return json(503, { error: "Product database is not configured." });

  if (event.httpMethod === "GET") {
    try {
      return json(200, { products: await getProducts() });
    } catch (error) {
      return json(502, { error: error instanceof Error ? error.message : "Could not load products." });
    }
  }
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed." });

  const secret = process.env.ADMIN_SESSION_SECRET;
  const token = event.headers?.authorization?.replace(/^Bearer\s+/i, "");
  if (!secret || !isValidAdminToken(token, secret)) return json(401, { error: "Admin sign-in is required." });

  let products;
  try {
    products = JSON.parse(event.body || "{}").products;
  } catch {
    return json(400, { error: "Invalid request body." });
  }
  if (!validateProducts(products)) return json(400, { error: "One or more product fields are invalid." });

  try {
    return json(200, { products: await saveProducts(products) });
  } catch (error) {
    return json(502, { error: error instanceof Error ? error.message : "Could not save products." });
  }
}