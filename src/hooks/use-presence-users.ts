"use client";

import { useEffect, useRef, useState } from "react";
import { get, onValue, ref } from "firebase/database";
import { rtdb } from "@/lib/firebase/client";

export interface PresenceUser {
  uid: string;
  name: string;
  username?: string;
  isOnline: boolean;
  lastSeen: number;
  photoURL?: string; // can be URL or base64
}

// A device counts as "online" if it sent a heartbeat within this window.
// The Android app writes DeviceHeartbeats/{deviceId} = timestamp.
const ONLINE_WINDOW_MS = 5 * 60 * 1000;

type DeviceInfo = { name?: string; manufacturer?: string; sub?: string };

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function usePresenceUsers() {
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [loading, setLoading] = useState(!!rtdb);
  const detailsCache = useRef<Record<string, DeviceInfo>>({});

  useEffect(() => {
    if (!rtdb) return;
    let cancelled = false;

    const ensureDetails = async (ids: string[]) => {
      if (!rtdb) return;
      const missing = ids.filter((id) => !(id in detailsCache.current));
      if (missing.length === 0) return;
      try {
        const [a, b] = await Promise.all([
          get(ref(rtdb, "Device_Details")),
          get(ref(rtdb, "DeviceDetail")),
        ]);
        if (cancelled) return;
        const va = (a.val() || {}) as Record<string, Record<string, unknown>>;
        const vb = (b.val() || {}) as Record<string, Record<string, unknown>>;
        for (const id of missing) {
          const d = va[id] || {};
          const e = vb[id] || {};
          const str = (v: unknown) =>
            typeof v === "string" && v.length > 0 ? v : undefined;
          const deviceName =
            str(d.deviceName) || str(d.model) || str(e.model);
          const manufacturer =
            str(d.manufacturer) || str(e.manufacturer);
          const name =
            deviceName ||
            [manufacturer, str(e.model)].filter(Boolean).join(" ") ||
            "Unknown device";
          detailsCache.current[id] = {
            name,
            manufacturer,
            sub: str(d.androidVersion)
              ? `Android ${d.androidVersion}`
              : undefined,
          };
        }
      } catch {
        // ignore – names fall back to "Unknown device"
      }
    };

    const mergeHeartbeats = (beats: Record<string, unknown>) => {
      const now = Date.now();
      const merged: PresenceUser[] = Object.entries(beats).map(
        ([deviceId, ts]) => {
          const lastSeen = Number(ts) || 0;
          const info = detailsCache.current[deviceId];
          return {
            uid: deviceId,
            name: info?.name || "Unknown device",
            username: info?.manufacturer || info?.sub || undefined,
            isOnline: lastSeen > 0 && now - lastSeen < ONLINE_WINDOW_MS,
            lastSeen,
          };
        }
      );

      merged.sort((a, b) => {
        if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
        return b.lastSeen - a.lastSeen;
      });

      if (!cancelled) {
        setUsers(merged);
        setLoading(false);
      }
    };

    const hbRef = ref(rtdb, "DeviceHeartbeats");
    const unsub = onValue(
      hbRef,
      (snapshot) => {
        const beats = (snapshot.val() || {}) as Record<string, unknown>;
        const ids = Object.keys(beats);
        if (ids.length === 0) {
          if (!cancelled) {
            setUsers([]);
            setLoading(false);
          }
          return;
        }
        void ensureDetails(ids).then(() => mergeHeartbeats(beats));
      },
      () => {
        if (!cancelled) setLoading(false);
      }
    );

    // Users seen today (app writes DailyActiveUsers/{date}/{uid})
    void (async () => {
      if (!rtdb) return;
      const d = new Date();
      const dayKeys = [
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
        `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`,
      ];
      for (const key of dayKeys) {
        try {
          const snap = await get(ref(rtdb, `DailyActiveUsers/${key}`));
          if (cancelled) return;
          if (snap.exists()) {
            setTodayCount(Object.keys(snap.val() || {}).length);
            return;
          }
        } catch {
          // try next format
        }
      }
    })();

    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  return { users, loading, todayCount };
}
