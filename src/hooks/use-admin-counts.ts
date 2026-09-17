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
    let cancelled = false;

    const countRef = ref(rtdb, "Count");
    const unsubscribe = onValue(
      countRef,
      (snapshot) => {
        const value = snapshot.val();
        if (value) {
          const baseActive = Number(value.activeUsers ?? 0);
          setCounts({
            totalDownloads: Number(value.totalDownloads ?? 0),
            todayDownloads: Number(value.todayDownloads ?? 0),
            totalDetections: Number(value.totalDetections ?? 0),
            activeUsers: baseActive,
            communityPosts: Number(value.communityPosts ?? 0),
          });
          setLoading(false);

          // Count/activeUsers is admin-write-only so the app can't update
          // it – derive the real user total from MonthlyActiveUsers instead.
          if (!rtdb) return;
          const d = new Date();
          const pad = (n: number) => String(n).padStart(2, "0");
          const monthKeys = [
            `${d.getFullYear()}-${pad(d.getMonth() + 1)}`,
            `${d.getFullYear()}${pad(d.getMonth() + 1)}`,
          ];
          void (async () => {
            for (const key of monthKeys) {
              try {
                if (!rtdb || cancelled) return;
                const snap = await get(
                  child(ref(rtdb), `MonthlyActiveUsers/${key}`)
                );
                if (cancelled) return;
                if (snap.exists()) {
                  const monthly = Object.keys(snap.val() || {}).length;
                  setCounts((prev) => ({
                    ...prev,
                    activeUsers: Math.max(monthly, baseActive),
                  }));
                  return;
                }
              } catch {
                // try next format
              }
            }
          })();
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
      },
      () => setLoading(false)
    );

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return { counts, loading };
}