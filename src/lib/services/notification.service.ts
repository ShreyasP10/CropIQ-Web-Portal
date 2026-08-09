"use client";

import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { NotificationPayload } from "@/types";
import { sanitizeInput } from "@/lib/utils/sanitize";

export async function createNotification(payload: NotificationPayload) {
  if (!db) throw new Error("Firebase is not configured.");
  return addDoc(collection(db, "notifications"), {
    ...payload,
    title: sanitizeInput(payload.title),
    description: sanitizeInput(payload.description),
    createdAt: serverTimestamp(),
    status: "queued",
  });
}

export async function updateNotificationStatus(
  id: string,
  status: "queued" | "sent" | "failed"
) {
  if (!db) throw new Error("Firebase is not configured.");
  return updateDoc(doc(db, "notifications", id), { status });
}
