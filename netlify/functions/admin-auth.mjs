import { createHmac, timingSafeEqual } from "node:crypto";

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

function equalSecret(left, right) {
  const a = Buffer.from(left || "");
  const b = Buffer.from(right || "");
  return a.length === b.length && a.length > 0 && timingSafeEqual(a, b);
}

function sign(payload, secret) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function validToken(token, secret) {
  const [payload, signature, extra] = String(token || "").split(".");
  if (!payload || !signature || extra) return false;
  if (!equalSecret(sign(payload, secret), signature)) return false;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString()).expires > Date.now();
  } catch {
    return false;
  }
}

export async function handler(event) {
  const password = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!password || password.length < 8 || !secret || secret.length < 32) {
    return json(503, { error: "Admin access is not configured yet." });
  }

  if (event.httpMethod === "GET") {
    const token = event.headers?.authorization?.replace(/^Bearer\s+/i, "");
    return validToken(token, secret)
      ? json(200, { authenticated: true })
      : json(401, { authenticated: false });
  }
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed." });

  let candidate;
  try {
    candidate = JSON.parse(event.body || "{}").password;
  } catch {
    return json(400, { error: "Invalid request body." });
  }
  if (typeof candidate !== "string" || !equalSecret(candidate, password)) {
    return json(401, { error: "Incorrect password." });
  }

  const payload = Buffer.from(JSON.stringify({ expires: Date.now() + 8 * 60 * 60 * 1000 })).toString("base64url");
  return json(200, { token: `${payload}.${sign(payload, secret)}` });
}