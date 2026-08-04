"use server";

import { cookies } from "next/headers";

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("cropiq_admin_session");
  return { success: true };
}
