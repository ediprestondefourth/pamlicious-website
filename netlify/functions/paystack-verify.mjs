import { createHmac, timingSafeEqual } from "node:crypto";

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

function signaturesMatch(left, right) {
  const a = Buffer.from(left || "", "hex");
  const b = Buffer.from(right || "", "hex");
  return a.length === b.length && a.length > 0 && timingSafeEqual(a, b);
}

export async function handler(event) {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed." });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return json(503, { error: "Payments are not configured yet." });

  let reference;
  try {
    reference = JSON.parse(event.body || "{}").reference;
  } catch {
    return json(400, { error: "Invalid request body." });
  }
  if (typeof reference !== "string" || !/^PB-[0-9a-f-]{36}$/i.test(reference)) {
    return json(400, { error: "Invalid payment reference." });
  }

  let response;
  try {
    response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
  } catch {
    return json(502, { error: "Could not verify with Paystack. Please retry." });
  }

  const result = await response.json().catch(() => null);
  const transaction = result?.data;
  if (!response.ok || !result?.status || transaction?.status !== "success" || transaction.currency !== "NGN") {
    return json(402, { error: "Payment was not completed successfully." });
  }

  const expectedSignature = createHmac("sha256", secret)
    .update(`${transaction.reference}:${transaction.amount}`)
    .digest("hex");
  if (!signaturesMatch(expectedSignature, transaction.metadata?.order_signature)) {
    return json(400, { error: "This payment reference is not valid for this store." });
  }

  return json(200, {
    verified: true,
    reference: transaction.reference,
    amountKobo: transaction.amount,
    currency: transaction.currency,
  });
}