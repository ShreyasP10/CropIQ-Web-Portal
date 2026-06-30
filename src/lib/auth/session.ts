import { createHmac, randomBytes } from "crypto";

function getSecret(): string {
  const envSecret = process.env.ADMIN_SESSION_SECRET;
  if (envSecret && envSecret !== "fallback-secret-change-me") {
    return envSecret;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set in production"
    );
  }
  return randomBytes(32).toString("hex");
}

const SECRET = getSecret();

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