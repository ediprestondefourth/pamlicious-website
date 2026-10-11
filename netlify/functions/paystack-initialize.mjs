import { createHmac, randomUUID } from "node:crypto";
import { getPaymentCatalog } from "./_shared/supabase-products.mjs";

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

export async function handler(event) {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed." });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  const siteUrl = (process.env.URL || process.env.SITE_URL || "").replace(/\/$/, "");
  if (!secret || !siteUrl) return json(503, { error: "Payments are not configured yet." });

  let request;
  try {
    request = JSON.parse(event.body || "{}");
  } catch {
    return json(400, { error: "Invalid request body." });
  }

  const email = typeof request.email === "string" ? request.email.trim().toLowerCase() : "";
  const name = typeof request.name === "string" ? request.name.trim() : "";
  const phone = typeof request.phone === "string" ? request.phone.trim() : "";
  const fulfillment = request.fulfillment === "pickup" ? "pickup" : "delivery";
  const deliveryAddress = typeof request.address === "string" ? request.address.trim() : "";
  const deliveryDate = typeof request.deliveryDate === "string" ? request.deliveryDate : "";
  const deliverySlot = typeof request.deliverySlot === "string" ? request.deliverySlot : "";
  const items = request.items;

  if (!/^\S+@\S+\.\S+$/.test(email) || !name || !phone || !deliveryDate || !deliverySlot) {
    return json(400, { error: "Complete your contact and delivery details before paying." });
  }
  if (fulfillment === "delivery" && !deliveryAddress) {
    return json(400, { error: "Enter a delivery address before paying." });
  }
  if (!Array.isArray(items) || items.length === 0 || items.length > 30) {
    return json(400, { error: "Your cart is empty or invalid." });
  }

  const orderItems = [];
  let subtotal = 0;
  let catalog;
  try {
    catalog = await getPaymentCatalog();
  } catch {
    return json(503, { error: "The product catalog is temporarily unavailable." });
  }

  for (const item of items) {
    const product = catalog[Number(item?.id)];
    const quantity = Number(item?.quantity);
    if (!product || product.status !== "Active" || !Number.isInteger(quantity) || quantity < 1 || quantity > 30) {
      return json(400, { error: "Your cart contains an invalid product or quantity." });
    }
    if (Number.isInteger(product.stock) && quantity > product.stock) {
      return json(400, { error: `${product.name} does not have enough stock available.` });
    }
    subtotal += product.price * quantity;
    orderItems.push({ id: Number(item.id), name: product.name, quantity, unit_price: product.price });
  }

  const deliveryFee = fulfillment === "delivery" && subtotal < 15000 ? 1500 : 0;
  const amountKobo = (subtotal + deliveryFee) * 100;
  const reference = `PB-${randomUUID()}`;
  const orderSignature = createHmac("sha256", secret)
    .update(`${reference}:${amountKobo}`)
    .digest("hex");

  let paystackResponse;
  try {
    paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: String(amountKobo),
        currency: "NGN",
        reference,
        callback_url: `${siteUrl}/payment/complete`,
        metadata: {
          order_signature: orderSignature,
          customer_name: name,
          customer_phone: phone,
          fulfillment,
          delivery_address: fulfillment === "delivery" ? deliveryAddress : "",
          delivery_date: deliveryDate,
          delivery_slot: deliverySlot,
          items: orderItems,
          delivery_fee: deliveryFee,
        },
      }),
    });
  } catch {
    return json(502, { error: "Could not reach Paystack. Please try again." });
  }

  const result = await paystackResponse.json().catch(() => null);
  if (!paystackResponse.ok || !result?.status || !result.data?.authorization_url) {
    return json(502, { error: result?.message || "Paystack could not start this payment." });
  }

  return json(200, {
    authorizationUrl: result.data.authorization_url,
    reference,
    amountKobo,
  });
}