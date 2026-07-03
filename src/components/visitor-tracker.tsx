"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackVisitorAction } from "@/app/action/track-visitor";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("cropiq_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("cropiq_visitor_id", id);
  }
  return id;
}

export function VisitorTracker() {
  const pathname = usePathname();
  const lastSent = useRef(0);

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const now = Date.now();
    if (now - lastSent.current < 10_000) return;
    lastSent.current = now;

    const visitorId = getVisitorId();
    if (!visitorId) return;

    trackVisitorAction({
      visitorId,
      page: pathname,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      referrer: document.referrer || "",
    });
  }, [pathname]);

  return null;
}
