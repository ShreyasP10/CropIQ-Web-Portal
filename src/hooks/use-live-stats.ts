// src/hooks/use-live-stats.ts
"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { rtdb } from "@/lib/firebase/client";

type LiveStats = {
  totalDownloads: number;
  totalDetections: number;
  activeUsers: number;
  communityPosts: number;
};

export function useLiveStats() {
  const [stats, setStats] = useState<LiveStats>({
    totalDownloads: 0,
    totalDetections: 0,
    activeUsers: 0,
    communityPosts: 0,
  });
  const [loading, setLoading] = useState(!!rtdb);

  useEffect(() => {
    if (!rtdb) return;
    const countRef = ref(rtdb, "Count");
    const unsubscribe = onValue(countRef, (snapshot) => {
      const value = snapshot.val();
      if (value) {
        setStats({
          totalDownloads: Number(value.totalDownloads ?? 0),
          totalDetections: Number(value.totalDetections ?? 0),
          activeUsers: Number(value.activeUsers ?? 0),
          communityPosts: Number(value.communityPosts ?? 0),
        });
      } else {
        // Keep zeros – no fallback
        setStats({ totalDownloads: 0, totalDetections: 0, activeUsers: 0, communityPosts: 0 });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { stats, loading };
}