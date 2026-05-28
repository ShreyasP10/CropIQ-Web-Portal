"use server";

import { cookies } from "next/headers";
import { getAuth } from "firebase-admin/auth";
import { getAdminApp } from "@/lib/firebase/admin";   // ← Import the helper
import { signEmail } from "@/lib/auth/session";

export async function setAdminSessionCookie(idToken: string) {
  if (!idToken) throw new Error("Missing ID token");

  // 1. Get (or initialize) the admin app
  const app = getAdminApp();

  // 2. Get an Auth instance tied to that app
  const auth = getAuth(app);

  // 3. Verify the token
  const decoded = await auth.verifyIdToken(idToken);
  const email = decoded.email?.toLowerCase();
  // 4. Check admin email whitelist (private env variable)
const allowed = (process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

  if (!email || !allowed.includes(email)) {
    throw new Error("Unauthorized");
  }

  // 5. Sign the email and set the cookie
  const signed = signEmail(email);
  const cookieStore = await cookies();

  cookieStore.set("cropiq_admin_session", signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 5,
  });

  return { success: true };
}