"use client";

import { useEffect, useRef, useState } from "react";
import { get, onValue, ref } from "firebase/database";
import { rtdb } from "@/lib/firebase/client";

export interface PresenceUser {
  uid: string;
  name: string;
  username?: string;
  device?: string;
  isOnline: boolean;
  lastSeen: number;
  photoURL?: string; // can be URL or base64
}

// A device counts as "online" if it sent a heartbeat within this window.
// The Android app writes DeviceHeartbeats/{deviceId} = timestamp.
const ONLINE_WINDOW_MS = 5 * 60 * 1000;

type DeviceInfo = {
  name?: string;
  manufacturer?: string;
  sub?: string;
  uidLink?: string;
};

type UserInfo = {
  name?: string;
  username?: string;
  photoURL?: string;
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

// Possible fields the app may use to link a device entry to a user uid.
const UID_FIELDS = ["uid", "userId", "user_id", "ownerId", "owner", "userUid"];

export function usePresenceUsers() {
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const [todayCount, setTodayCount] = useState(0);
  const [loading, setLoading] = useState(!!rtdb);
  const detailsCache = useRef<Record<string, DeviceInfo>>({});
  const userCache = useRef<Record<string, UserInfo | null>>({});

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
          const deviceName =
            str(d.deviceName) || str(d.model) || str(e.model);
          const manufacturer =
            str(d.manufacturer) || str(e.manufacturer);
          const uidLink =
            UID_FIELDS.map((f) => str(d[f]) || str(e[f])).find(Boolean);
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
            uidLink,
          };
        }
      } catch {
        // ignore – names fall back to "Unknown device"
      }
    };

    const resolveUser = async (uid: string): Promise<UserInfo | null> => {
      if (!rtdb) return null;
      if (uid in userCache.current) return userCache.current[uid];
      try {
        const snap = await get(ref(rtdb, `Users/${uid}`));
        if (cancelled) return null;
        if (!snap.exists()) {
          userCache.current[uid] = null;
          return null;
        }
        const v = (snap.val() || {}) as Record<string, unknown>;
        const info: UserInfo = {
          name: str(v.name) || str(v.displayName) || str(v.username),
          username: str(v.username),
          photoURL: str(v.photo) || str(v.photoURL) || str(v.avatar),
        };
        userCache.current[uid] = info;
        return info;
      } catch {
        return null;
      }
    };

    const mergeHeartbeats = async (beats: Record<string, unknown>) => {
      const ids = Object.keys(beats);
      await ensureDetails(ids);
      if (cancelled) return;

      const now = Date.now();
      const merged: Array<PresenceUser | null> = await Promise.all(
        ids.map(async (deviceId) => {
          const ts = beats[deviceId];
          const lastSeen = Number(ts) || 0;
          const info = detailsCache.current[deviceId];

          // The heartbeat key may itself be the user uid; otherwise the
          // device entry may carry a uid link field.
          const candidates = [info?.uidLink, deviceId].filter(
            (c): c is string => !!c
          );
          let user: UserInfo | null = null;
          let uid = deviceId;
          for (const c of candidates) {
            const found = await resolveUser(c);
            if (cancelled) return null;
            if (found) {
              user = found;
              uid = c;
              break;
            }
          }

          const phoneName = info?.name || "Unknown device";
          return {
            uid,
            name: user?.name || phoneName,
            username: user?.username,
            // Only show the phone line when we found a real user;
            // otherwise the name already is the phone info.
            device: user ? phoneName : undefined,
            isOnline: lastSeen > 0 && now - lastSeen < ONLINE_WINDOW_MS,
            lastSeen,
            photoURL: user?.photoURL,
          };
        })
      );

      if (cancelled) return;
      const list = merged.filter((u): u is PresenceUser => u !== null);
      list.sort((a, b) => {
        if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
        return b.lastSeen - a.lastSeen;
      });

      setUsers(list);
      setLoading(false);
    };

    const hbRef = ref(rtdb, "DeviceHeartbeats");
    const unsub = onValue(
      hbRef,
      (snapshot) => {
        const beats = (snapshot.val() || {}) as Record<string, unknown>;
        if (Object.keys(beats).length === 0) {
          if (!cancelled) {
            setUsers([]);
            setLoading(false);
          }
          return;
        }
        void mergeHeartbeats(beats);
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
