// src/lib/services/admin-auth.service.ts
"use client";

import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { isAllowedAdmin } from "@/lib/utils/admin-whitelist";
import { setAdminSessionCookie } from "@/app/action/login";
import { clearAdminSessionCookie } from "@/app/action/logout";
import {
 useEffect,
 useState
}
from "react";
import type { User } from "firebase/auth";


export async function loginAdmin() {
  if (!auth) throw new Error("Firebase not configured");
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const email = result.user.email ?? "";
  
  if (!isAllowedAdmin(email)) {
    await signOut(auth);
    throw new Error("Unauthorized email. This account is not an admin.");
  }

  const idToken = await result.user.getIdToken();
  await setAdminSessionCookie(idToken);

  // Optionally set a custom claim via a server endpoint (recommended for production)
  // For now, we rely on the whitelist + Firebase Auth state.
  return result.user;
}

export async function logoutAdmin() {
  await clearAdminSessionCookie();
  if (!auth) return;
  return signOut(auth);
}

// Hook to check admin status without cookies
export function useAdminStatus() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser?.email) {
        setIsAdmin(isAllowedAdmin(firebaseUser.email));
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return { user, isAdmin };
}