// src/lib/services/storage-provider.ts
import { db } from "@/lib/firebase/client";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import type { ApkVersion } from "@/types";

export interface StorageProvider {
  getApkUrl(): Promise<string>;
}

class FirestoreReleaseProvider implements StorageProvider {
  async getApkUrl(): Promise<string> {
    if (!db) return "";
    const q = query(
      collection(db, "apk_versions"),
      where("isLatest", "==", true),
      orderBy("releaseDate", "desc"),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return "";
    const latest = snapshot.docs[0].data() as ApkVersion;
    return latest.apkUrl ?? "";
  }
}

export const storageProvider: StorageProvider = new FirestoreReleaseProvider();