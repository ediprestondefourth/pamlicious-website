import { createHmac, timingSafeEqual } from "node:crypto";

function equalSignature(left, right) {
  const a = Buffer.from(left || "");
  const b = Buffer.from(right || "");
  return a.length === b.length && a.length > 0 && timingSafeEqual(a, b);
}

export function isValidAdminToken(token, secret) {
  const [payload, signature, extra] = String(token || "").split(".");
  if (!payload || !signature || extra) return false;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  if (!equalSignature(expected, signature)) return false;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString()).expires > Date.now();
  } catch {
    return false;
  }
}