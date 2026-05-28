"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { isAllowedAdmin } from "@/lib/utils/admin-whitelist";

export function useAdminAuth() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email && isAllowedAdmin(user.email)) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { loading, authorized };
}