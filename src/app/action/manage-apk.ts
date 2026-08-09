"use server";

import "server-only";

import { cookies } from "next/headers";
import { verifySignedCookie } from "@/lib/auth/session";
import { getAdminFirestore, getAdminApp } from "@/lib/firebase/admin";
import { getDatabase } from "firebase-admin/database";
import { FieldValue } from "firebase-admin/firestore";

const VERSION_NAME_PATTERN = /^v\d+\.\d+\.\d+$/;

type ApkPayload = {
  versionName: string;
  versionCode: number;
  apkUrl: string;
  releaseDate: string;
  apkSize: string;
  minAndroidVersion: string;
  description: string;
  releaseNotes: string[];
  featuresAdded: string[];
  bugFixes: string[];
  securityImprovements: string[];
  isLatest: boolean;
};

async function requireAdmin(): Promise<void> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("cropiq_admin_session")?.value;
  const email = sessionCookie ? verifySignedCookie(sessionCookie) : null;
  if (!email) throw new Error("Unauthorized");

  const allowed = (process.env.NEXT_PUBLIC_ALLOWED_ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (allowed.length > 0 && !allowed.includes(email.toLowerCase())) {
    throw new Error("Unauthorized – email not in admin list");
  }
}

function validatePayload(payload: ApkPayload): void {
  if (!payload || typeof payload !== "object") throw new Error("Invalid payload");
  if (typeof payload.versionName !== "string" || !VERSION_NAME_PATTERN.test(payload.versionName)) {
    throw new Error("Version name must look like v1.2.3");
  }
  if (typeof payload.apkUrl !== "string" || !/^https:\/\/.+/i.test(payload.apkUrl)) {
    throw new Error("APK URL must be a valid https URL");
  }
  if (typeof payload.versionCode !== "number" || payload.versionCode < 1) {
    throw new Error("Invalid version code");
  }
}

async function setLatestVersion(versionName: string) {
  const rtdb = getDatabase(getAdminApp());
  await rtdb.ref("Count/latestVersion").set(versionName);
}

/**
 * Promote a version as the latest: clears isLatest on every other doc,
 * marks this one, and syncs Count/latestVersion in the Realtime Database.
 */
async function promoteLatest(db: ReturnType<typeof getAdminFirestore>, docId: string | null, versionName: string) {
  const snap = await db.collection("apk_versions").get();
  const batch = db.batch();
  for (const doc of snap.docs) {
    if (doc.data().isLatest === true && doc.id !== docId) {
      batch.update(doc.ref, { isLatest: false });
    }
  }
  await batch.commit();
  await setLatestVersion(versionName);
}

/** Pick the newest remaining version by releaseDate (fallback: versionName). */
async function promoteNewestRemaining(db: ReturnType<typeof getAdminFirestore>) {
  const snap = await db.collection("apk_versions").orderBy("releaseDate", "desc").limit(1).get();
  if (snap.empty) {
    const rtdb = getDatabase(getAdminApp());
    await rtdb.ref("Count/latestVersion").set("");
    return;
  }
  const next = snap.docs[0].data();
  await promoteLatest(db, snap.docs[0].id, String(next.versionName ?? ""));
}

export async function addApkVersionAction(payload: ApkPayload) {
  await requireAdmin();
  validatePayload(payload);

  const db = getAdminFirestore();
  const docRef = db.collection("apk_versions").doc();

  const data = {
    versionName: payload.versionName,
    versionCode: payload.versionCode,
    apkUrl: payload.apkUrl,
    releaseDate: payload.releaseDate ?? "",
    apkSize: payload.apkSize ?? "",
    downloads: 0,
    minAndroidVersion: payload.minAndroidVersion ?? "8.0",
    description: payload.description ?? "",
    releaseNotes: Array.isArray(payload.releaseNotes) ? payload.releaseNotes : [],
    featuresAdded: Array.isArray(payload.featuresAdded) ? payload.featuresAdded : [],
    bugFixes: Array.isArray(payload.bugFixes) ? payload.bugFixes : [],
    securityImprovements: Array.isArray(payload.securityImprovements) ? payload.securityImprovements : [],
    isLatest: true,
    createdAt: FieldValue.serverTimestamp(),
  };

  // A newly uploaded APK automatically becomes the latest
  const snap = await db.collection("apk_versions").get();
  const batch = db.batch();
  for (const doc of snap.docs) {
    if (doc.data().isLatest === true) {
      batch.update(doc.ref, { isLatest: false });
    }
  }
  batch.set(docRef, data);
  await batch.commit();

  await setLatestVersion(payload.versionName);
  return { success: true };
}

export async function updateApkVersionAction(id: string, payload: ApkPayload) {
  await requireAdmin();
  validatePayload(payload);
  if (!id) throw new Error("Missing version id");

  const db = getAdminFirestore();
  const ref = db.collection("apk_versions").doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new Error("Version not found");

  const wasLatest = doc.data()?.isLatest === true;
  const isLatest = payload.isLatest === true;

  await ref.update({
    versionName: payload.versionName,
    versionCode: payload.versionCode,
    apkUrl: payload.apkUrl,
    releaseDate: payload.releaseDate ?? "",
    apkSize: payload.apkSize ?? "",
    minAndroidVersion: payload.minAndroidVersion ?? "8.0",
    description: payload.description ?? "",
    releaseNotes: Array.isArray(payload.releaseNotes) ? payload.releaseNotes : [],
    featuresAdded: Array.isArray(payload.featuresAdded) ? payload.featuresAdded : [],
    bugFixes: Array.isArray(payload.bugFixes) ? payload.bugFixes : [],
    securityImprovements: Array.isArray(payload.securityImprovements) ? payload.securityImprovements : [],
    isLatest,
  });

  if (isLatest) {
    await promoteLatest(db, id, payload.versionName);
  } else if (wasLatest) {
    // Unchecking "latest" – promote the newest remaining version
    await promoteNewestRemaining(db);
  }

  return { success: true };
}

export async function deleteApkVersionAction(id: string) {
  await requireAdmin();
  if (!id) throw new Error("Missing version id");

  const db = getAdminFirestore();
  const ref = db.collection("apk_versions").doc(id);
  const doc = await ref.get();
  if (!doc.exists) throw new Error("Version not found");

  const wasLatest = doc.data()?.isLatest === true;

  await ref.delete();

  if (wasLatest) {
    await promoteNewestRemaining(db);
  }

  return { success: true };
}
