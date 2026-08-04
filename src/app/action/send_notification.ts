"use server";

import { getAdminMessaging } from "@/lib/firebase/admin";
import { verifySignedCookie } from "@/lib/auth/session";
import { cookies } from "next/headers";

type Audience = "all-users" | "active-users" | "beta-testers";

const AUDIENCES: readonly Audience[] = ["all-users", "active-users", "beta-testers"];

function audienceToTopic(audience: Audience): string {
  switch (audience) {
    case "beta-testers": return "beta-testers";
    case "active-users": return "active-users";
    default: return "all-users";
  }
}

export async function sendFcmNotification(data: {
  title: string;
  description: string;
  targetAudience: Audience;
}) {
  // 1. Validate inputs before anything else
  if (
    typeof data?.title !== "string" ||
    typeof data?.description !== "string" ||
    !AUDIENCES.includes(data.targetAudience)
  ) {
    throw new Error("Invalid input");
  }
  const title = data.title.trim();
  const description = data.description.trim();
  if (title.length < 1 || title.length > 100) throw new Error("Invalid title");
  if (description.length < 1 || description.length > 500) throw new Error("Invalid description");

  // 2. Verify admin session
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cropiq_admin_session")?.value;
  const email = sessionCookie ? verifySignedCookie(sessionCookie) : null;
  if (!email) throw new Error("Unauthorized");

  // 3. Double-check against allowed admin list (public env)
  const allowed = (process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!allowed.includes(email.toLowerCase())) {
    throw new Error("Unauthorized – email not in admin list");
  }

  try {
    const messaging = getAdminMessaging();
    const topic = audienceToTopic(data.targetAudience);
    await messaging.send({
      topic,
      notification: { title, body: description },
    });
    return { success: true };
  } catch (error) {
    console.error("FCM send error:", error);
    return { success: false, error: "Failed to send notification" };
  }
}