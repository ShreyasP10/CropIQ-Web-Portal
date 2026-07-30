// src/lib/firebase/client.ts

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getMessaging, isSupported as isMessagingSupported } from "firebase/messaging";
import { firebaseWebConfig, isFirebaseConfigured } from "./config";

// ---------------------------------------------------------------------------
// Firebase App (singleton)
// ---------------------------------------------------------------------------
const app = isFirebaseConfigured()
  ? getApps().length
    ? getApp()
    : initializeApp(firebaseWebConfig)
  : null;

// ---------------------------------------------------------------------------
// Service instances – null if config missing or not in browser
// ---------------------------------------------------------------------------
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export const rtdb = app ? getDatabase(app) : null;

// Messaging only works in the browser and requires HTTPS
let messagingPromise: Promise<ReturnType<typeof getMessaging> | null> | null = null;

export function getMessagingInstance(): Promise<ReturnType<typeof getMessaging> | null> {
  if (typeof window === "undefined" || !app) return Promise.resolve(null);
  if (!messagingPromise) {
    messagingPromise = isMessagingSupported().then((supported) =>
      supported ? getMessaging(app!) : null
    );
  }
  return messagingPromise;
}

// ---------------------------------------------------------------------------
// Analytics – lazy, one‑time promise
// ---------------------------------------------------------------------------
let analyticsPromise: Promise<ReturnType<typeof getAnalytics> | null> | null = null;

export function getAnalyticsInstance(): Promise<ReturnType<typeof getAnalytics> | null> {
  if (typeof window === "undefined" || !app) {
    return Promise.resolve(null);
  }
  if (!analyticsPromise) {
    analyticsPromise = isSupported().then((supported) =>
      supported ? getAnalytics(app!) : null
    );
  }
  return analyticsPromise;
}

// For convenience in components: a hook that resolves the analytics instance
// You can also just call getAnalyticsInstance() inside useEffect.