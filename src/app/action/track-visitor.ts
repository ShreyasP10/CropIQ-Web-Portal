"use server";

import "server-only";

import { headers } from "next/headers";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { getDatabase } from "firebase-admin/database";
import { getAdminApp } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";
import { checkRateLimit } from "@/lib/rate-limit";

const COOLDOWN_MS = 30_000;
// Max tracking calls per IP per minute — stops bots hammering Firestore/RTDB
const IP_RATE_LIMIT = 30;

function parseUserAgent(ua: string) {
  const result = { browser: "Unknown", os: "Unknown", device: "Desktop" };

  const browsers = [
    { name: "Chrome", pattern: /Chrome\/([\d.]+)/ },
    { name: "Firefox", pattern: /Firefox\/([\d.]+)/ },
    { name: "Safari", pattern: /Version\/([\d.]+).*Safari/ },
    { name: "Edge", pattern: /Edg\/([\d.]+)/ },
    { name: "Opera", pattern: /OPR\/([\d.]+)/ },
    { name: "Samsung", pattern: /SamsungBrowser\/([\d.]+)/ },
  ];

  for (const b of browsers) {
    const match = ua.match(b.pattern);
    if (match) {
      result.browser = `${b.name} ${match[1]}`;
      break;
    }
  }

  if (/Windows NT 10/.test(ua)) result.os = "Windows 10";
  else if (/Windows NT 11/.test(ua)) result.os = "Windows 11";
  else if (/Android/.test(ua)) {
    const m = ua.match(/Android ([\d.]+)/);
    result.os = m ? `Android ${m[1]}` : "Android";
  } else if (/iPhone|iPad/.test(ua)) {
    const m = ua.match(/OS ([\d_]+)/);
    result.os = m ? `iOS ${m[1].replace(/_/g, ".")}` : "iOS";
  } else if (/Mac OS X/.test(ua)) {
    const m = ua.match(/Mac OS X ([\d_]+)/);
    result.os = m ? `macOS ${m[1].replace(/_/g, ".")}` : "macOS";
  } else if (/Linux/.test(ua)) result.os = "Linux";
  else if (/CrOS/.test(ua)) result.os = "ChromeOS";

  if (/Android|iPhone|iPad|iPod/.test(ua)) result.device = "Mobile";
  else if (/Tablet|iPad/.test(ua)) result.device = "Tablet";

  return result;
}

async function geoLookup(ip: string) {
  if (!ip || ip === "::1" || ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.")) {
    return { city: "Local", state: "", country: "Development", isp: "" };
  }
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}?fields=city,region,country,isp,query`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return {};
    const data = await res.json();
    return {
      city: data.city || "",
      state: data.region || "",
      country: data.country || "",
      isp: data.isp || "",
    };
  } catch {
    return {};
  }
}

export async function trackVisitorAction(data: {
  visitorId: string;
  page: string;
  screenWidth: number;
  screenHeight: number;
  language: string;
  timezone: string;
  referrer: string;
}) {
  try {
    const headerStore = await headers();
    const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim()
      || headerStore.get("x-real-ip")
      || "unknown";
    const userAgent = headerStore.get("user-agent") || "";
    const parsed = parseUserAgent(userAgent);

    if (!(await checkRateLimit(IP_RATE_LIMIT))) return;

    const db = getAdminFirestore();
    const rtdb = getDatabase(getAdminApp());

    // Seed RTDB count from Firestore if RTDB node doesn't exist yet
    const countSnapshot = await rtdb.ref("Count/totalVisitors").get();
    if (!countSnapshot.exists()) {
      const visitorDocs = await db.collection("analytics").doc("visitors").collection("all").count().get();
      await rtdb.ref("Count/totalVisitors").set(visitorDocs.data().count);
    }

    const visitorRef = db.collection("analytics").doc("visitors").collection("all").doc(data.visitorId);
    const existing = await visitorRef.get();

    if (existing.exists) {
      const lastVisit = existing.data()?.lastVisit || 0;
      if (Date.now() - lastVisit < COOLDOWN_MS) return;
    }

    const geo = await geoLookup(ip);

    const visitorPayload: Record<string, unknown> = {
      visitorId: data.visitorId,
      lastVisit: Date.now(),
      visitCount: FieldValue.increment(1),
      ip,
      city: geo.city || "",
      state: geo.state || "",
      country: geo.country || "",
      isp: geo.isp || "",
      browser: parsed.browser,
      os: parsed.os,
      device: parsed.device,
      screenWidth: data.screenWidth,
      screenHeight: data.screenHeight,
      language: data.language,
      timezone: data.timezone,
      referrer: data.referrer,
    };

    if (!existing.exists) {
      visitorPayload.firstVisit = Date.now();
      visitorPayload.visitCount = 1;
    }

    await rtdb.ref("Count/totalVisitors").transaction((val) => (val ?? 0) + 1);
    await visitorRef.set(visitorPayload, { merge: true });

    await db.collection("analytics").doc("pageViews").collection("all").add({
      visitorId: data.visitorId,
      page: data.page,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Visitor tracking error:", error);
  }
}
