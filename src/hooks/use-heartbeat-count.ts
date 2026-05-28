"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { rtdb } from "@/lib/firebase/client";

export function useHeartbeatCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!rtdb) {
      setLoading(false);
      return;
    }
    const heartbeatsRef = ref(rtdb, "DeviceHeartbeats");
    const unsubscribe = onValue(heartbeatsRef, (snapshot) => {
      const value = snapshot.val() as Record<string, number> | null;
      if (!value) {
        setCount(0);
        setLoading(false);
        return;
      }

      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
      const activeDevices = Object.values(value).filter(
        (timestamp) => timestamp > oneDayAgo
      ).length;

      setCount(activeDevices);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { count, loading };
}