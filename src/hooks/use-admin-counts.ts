// src/hooks/use-admin-counts.ts
"use client";

import { useEffect, useState } from "react";
import { onValue, ref, get, child } from "firebase/database";
import { rtdb } from "@/lib/firebase/client";

type RealtimeCount = {
  totalDownloads: number;
  todayDownloads: number;
  totalDetections: number;
  activeUsers: number;
  communityPosts: number;
};

const FALLBACK: RealtimeCount = {
  totalDownloads: 0,
  todayDownloads: 0,
  totalDetections: 0,
  activeUsers: 0,
  communityPosts: 0,
};

export function useAdminCounts() {
  const [counts, setCounts] = useState<RealtimeCount>(FALLBACK);
  const [loading, setLoading] = useState(!!rtdb);

  useEffect(() => {
    if (!rtdb) return;

    const countRef = ref(rtdb, "Count");
    const unsubscribe = onValue(countRef, (snapshot) => {
      const value = snapshot.val();
      if (value) {
        setCounts({
          totalDownloads: Number(value.totalDownloads ?? 0),
          todayDownloads: Number(value.todayDownloads ?? 0),
          totalDetections: Number(value.totalDetections ?? 0),
          activeUsers: Number(value.activeUsers ?? 0),
          communityPosts: Number(value.communityPosts ?? 0),
        });
        setLoading(false);
      } else {
        // Fallback – fetch total detections from root
        if (!rtdb) return; // guard again for TypeScript

        get(child(ref(rtdb), "/"))
          .then((root) => {
            const data = root.val();
            let detections = 0;
            if (data) {
              Object.values(data).forEach((r: unknown) => {
                if (r && typeof r === "object" && "cropName" in r) detections++;
              });
            }
            setCounts((prev) => ({
              ...prev,
              totalDetections: detections,
            }));
            setLoading(false);
          })
          .catch(() => setLoading(false));
      }
    });

    return () => unsubscribe();
  }, []);

  return { counts, loading };
}