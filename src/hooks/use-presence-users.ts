"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { rtdb } from "@/lib/firebase/client";

export interface PresenceUser {
  uid: string;
  name: string;
  username?: string;
  isOnline: boolean;
  lastSeen: number;
  photoURL?: string; // can be URL or base64
}

export function usePresenceUsers() {
  const [users, setUsers] = useState<PresenceUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rtdb) {
      setLoading(false);
      return;
    }

    // Listen to both presence and Users nodes
    const presenceRef = ref(rtdb, "presence");
    const usersRef = ref(rtdb, "Users");

    let presenceData: Record<string, any> = {};
    let usersData: Record<string, any> = {};
    let presenceLoaded = false;
    let usersLoaded = false;

    const mergeAndSet = () => {
      if (!presenceLoaded || !usersLoaded) return;

      const merged: PresenceUser[] = Object.entries(presenceData).map(
        ([uid, value]: [string, any]) => ({
          uid,
          name: value.name || "Unknown",
          username: usersData[uid]?.username || undefined,
          isOnline: Boolean(value.isOnline),
          lastSeen: value.lastSeen || 0,
          // Prefer the photo from the Users node (can be URL or base64)
          photoURL: usersData[uid]?.photo || value.photoURL || undefined,
        })
      );

      // Sort: online first, then by last seen descending
      merged.sort((a, b) => {
        if (a.isOnline !== b.isOnline) return a.isOnline ? -1 : 1;
        return b.lastSeen - a.lastSeen;
      });

      setUsers(merged);
      setLoading(false);
    };

    const unsubPresence = onValue(presenceRef, (snapshot) => {
      presenceData = snapshot.val() || {};
      presenceLoaded = true;
      mergeAndSet();
    });

    const unsubUsers = onValue(usersRef, (snapshot) => {
      usersData = snapshot.val() || {};
      usersLoaded = true;
      mergeAndSet();
    });

    return () => {
      unsubPresence();
      unsubUsers();
    };
  }, []);

  return { users, loading };
}