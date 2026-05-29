"use client";

import { useEffect, useState } from "react";
import { onValue, ref } from "firebase/database";
import { rtdb } from "@/lib/firebase/client";

export function useLatestVersion() {
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    if (!rtdb) return;

    const versionRef = ref(rtdb, "Count/latestVersion");
    const unsubscribe = onValue(versionRef, (snapshot) => {
      const val = snapshot.val();
      setVersion(val ? String(val) : null);
    });

    return () => unsubscribe();
  }, []);

  return version;
}