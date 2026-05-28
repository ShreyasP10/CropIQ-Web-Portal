// src/lib/services/apk.service.ts
"use client";

import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { ApkVersion } from "@/types";

export async function getApkVersions(): Promise<ApkVersion[]> {
  if (!db) return [];
  const q = query(collection(db, "apk_versions"), orderBy("releaseDate", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Partial<ApkVersion>;
    return {
      id: doc.id,
      versionName: data.versionName ?? "",
      versionCode: Number(data.versionCode ?? 0),
      apkUrl: data.apkUrl ?? "",
      releaseDate: data.releaseDate ?? "",
      apkSize: data.apkSize ?? "N/A",
      downloads: Number(data.downloads ?? 0),
      minAndroidVersion: data.minAndroidVersion ?? "8.0",
      description: data.description ?? "",
      releaseNotes: Array.isArray(data.releaseNotes) ? data.releaseNotes : [],
      featuresAdded: Array.isArray(data.featuresAdded) ? data.featuresAdded : [],
      bugFixes: Array.isArray(data.bugFixes) ? data.bugFixes : [],
      securityImprovements: Array.isArray(data.securityImprovements) ? data.securityImprovements : [],
      isLatest: Boolean(data.isLatest),
    } satisfies ApkVersion;
  });
}

export async function addApkVersion(data: Omit<ApkVersion, "id">) {
  if (!db) throw new Error("Firebase not configured");
  return addDoc(collection(db, "apk_versions"), data);
}

export async function editApkVersion(id: string, data: Partial<ApkVersion>) {
  if (!db) throw new Error("Firebase not configured");
  return updateDoc(doc(db, "apk_versions", id), data);
}

export async function removeApkVersion(id: string) {
  if (!db) throw new Error("Firebase not configured");
  return deleteDoc(doc(db, "apk_versions", id));
}