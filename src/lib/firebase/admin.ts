import "server-only";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

const serviceAccount = {
  projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};


export function getAdminApp() {   

  if (getApps().length) {
    return getApps()[0];
  }

  return initializeApp({
    credential:
      cert(serviceAccount),

    databaseURL:
      process.env
      .FIREBASE_DATABASE_URL,
  });
}
export function getAdminMessaging() {
  return getMessaging(
    getAdminApp()
  );
}