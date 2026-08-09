import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  "/admin",
  "/admin/apk-management",
  "/admin/analytics",
  "/admin/support",
  "/admin/notifications",
  "/admin/visitors",
];

function getSecret(): string {
  const envSecret = process.env.ADMIN_SESSION_SECRET;
  if (envSecret && envSecret !== "fallback-secret-change-me") {
    return envSecret;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET must be set in production");
  }
  return "fallback-secret-change-me";
}

async function verifySignedCookie(signed: string): Promise<string | null> {
  const parts = signed.split(":");
  if (parts.length !== 2) return null;
  const [email, signature] = parts;
  if (!email || !signature) return null;

  const secret = getSecret();
  const encoder = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const expected = await crypto.subtle
    .sign("HMAC", key, encoder.encode(email.toLowerCase()))
    .then((sig) =>
      Array.from(new Uint8Array(sig))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
    );

  if (expected.length !== signature.length) return null;

  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }

  return diff === 0 ? email.toLowerCase() : null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const sessionCookie = request.cookies.get("cropiq_admin_session")?.value;

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const email = await verifySignedCookie(sessionCookie);
  if (!email) {
    const res = NextResponse.redirect(new URL("/admin/login", request.url));
    res.cookies.delete("cropiq_admin_session");
    return res;
  }

  const allowed = (process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (allowed.length > 0 && !allowed.includes(email)) {
    const res = NextResponse.redirect(new URL("/admin/login", request.url));
    res.cookies.delete("cropiq_admin_session");
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
