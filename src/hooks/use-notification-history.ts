"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { NotificationPayload } from "@/types";

export type NotificationItem = NotificationPayload & {
  id: string;
  createdAt: unknown;
  status: string;
};

export function useNotificationHistory(max = 50) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;

    const q = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc"),
      limit(max)
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list: NotificationItem[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as unknown as NotificationItem);
        });
        setNotifications(list);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsub();
  }, [max]);

  return { notifications, loading };
}
