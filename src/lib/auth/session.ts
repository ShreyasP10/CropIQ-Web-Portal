import { createHmac } from "crypto";

const SECRET = process.env.ADMIN_SESSION_SECRET || "fallback-secret-change-me";

export function signEmail(email: string): string {
  const hmac = createHmac("sha256", SECRET);
  hmac.update(email.toLowerCase());
  return `${email.toLowerCase()}:${hmac.digest("hex")}`;   // colon, not dot
}

export function verifySignedCookie(signed: string): string | null {
  const parts = signed.split(":");          // split on colon
  if (parts.length !== 2) return null;
  const [email, signature] = parts;
  if (!email || !signature) return null;
  const expected = signEmail(email);
  return expected === signed ? email : null;
}