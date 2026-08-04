"use server";

import "server-only";

import { cookies } from "next/headers";
import { getDatabase } from "firebase-admin/database";
import { getAdminApp } from "@/lib/firebase/admin";
import { checkRateLimit } from "@/lib/rate-limit";

const COOLDOWN_MS = 15_000;
// Max download-tracking calls per IP per minute
const IP_RATE_LIMIT = 10;

// Only allow version names like "v1.2.3" — prevents RTDB path injection
const VERSION_NAME_PATTERN = /^v\d+\.\d+\.\d+$/;

export async function trackDownloadAction(
  versionName: string
) {
  try {

    if (typeof versionName !== "string" || !VERSION_NAME_PATTERN.test(versionName)) {
      return;
    }

    if (!(await checkRateLimit(IP_RATE_LIMIT))) return;

    const cookieStore =
      await cookies();

    const lastDownloadKey =
      `cropiq-dl-${versionName}`;

    const lastDownload =
      cookieStore.get(
        lastDownloadKey
      )?.value;

    // Prevent spam clicks
    if (lastDownload) {

      const lastTime =
        parseInt(
          lastDownload,
          10
        );

      if (
        Date.now() - lastTime
        < COOLDOWN_MS
      ) {
        return;
      }
    }

    const rtdb =
      getDatabase(
        getAdminApp()
      );

    const today =
      new Date()
        .toISOString()
        .slice(0, 10);

    const dateRef =
      rtdb.ref(
        "Count/lastDownloadDate"
      );

    const snapshot =
      await dateRef.get();

    const savedDate =
      snapshot.val();

    // Reset today's count
    if (
      savedDate !== today
    ) {

      await rtdb
        .ref(
          "Count/todayDownloads"
        )
        .set(0);

      await dateRef
        .set(today);
    }

    // Increment counts
    await Promise.all([

      rtdb
        .ref(
          "Count/totalDownloads"
        )
        .transaction(
          (val) =>
            (val ?? 0) + 1
        ),

      rtdb
        .ref(
          "Count/todayDownloads"
        )
        .transaction(
          (val) =>
            (val ?? 0) + 1
        ),

      rtdb
        .ref(
          `VersionDownloads/${versionName}`
        )
        .transaction(
          (val) =>
            (val ?? 0) + 1
        ),
    ]);

    // Cooldown cookie
    cookieStore.set(
      lastDownloadKey,
      String(Date.now()),
      {
        httpOnly: true,
        secure:
          process.env
            .NODE_ENV
            === "production",

        sameSite:
          "strict",

        path: "/",

        maxAge:
          Math.ceil(
            COOLDOWN_MS / 1000
          ),
      }
    );

  } catch (error) {

    console.error(
      "Download tracking error:",
      error
    );
  }
}