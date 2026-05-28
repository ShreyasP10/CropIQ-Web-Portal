// src/lib/firebase/config.ts

const firebaseWebConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ?? "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ?? "",
} as const;

/**
 * Returns true if the minimum required config for Firebase is present.
 * Use this to conditionally render firebase-dependant UI or avoid errors.
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseWebConfig.apiKey && firebaseWebConfig.projectId && firebaseWebConfig.appId);
}

// In development, warn if config is missing to prevent silent failures
if (process.env.NODE_ENV === "development" && !isFirebaseConfigured()) {
  console.warn(
    "⚠️ Firebase web config is incomplete. Make sure all NEXT_PUBLIC_FIREBASE_* variables are set in .env.local"
  );
}

export { firebaseWebConfig };