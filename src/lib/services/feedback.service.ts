// src/lib/services/feedback.service.ts
"use client";

import { collection, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { SupportFeedbackItem } from "@/types";

export async function getFeedbackItems(): Promise<SupportFeedbackItem[]> {
  if (!db) return [];
  const q = query(collection(db, "user-feedback"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<SupportFeedbackItem, "id">),
  }));
}

export async function updateFeedbackStatus(
  id: string,
  status: SupportFeedbackItem["status"]
) {
  if (!db) throw new Error("Firebase not configured");
  const validStatuses: SupportFeedbackItem["status"][] = ["Unread", "Read", "Resolved"];
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid status: ${status}`);
  }
  return updateDoc(doc(db, "user-feedback", id), { status });
}