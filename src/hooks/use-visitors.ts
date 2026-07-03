"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import type { VisitorData, PageView } from "@/types";

export function useVisitors(max = 50) {
  const [visitors, setVisitors] = useState<VisitorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;

    const q = query(
      collection(db, "analytics", "visitors", "all"),
      orderBy("lastVisit", "desc"),
      limit(max)
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list: VisitorData[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as unknown as VisitorData);
        });
        setVisitors(list);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsub();
  }, [max]);

  return { visitors, loading };
}

export function useVisitorPageViews(visitorId: string | null) {
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!db || !visitorId) {
      setPageViews([]);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, "analytics", "pageViews", "all"),
      orderBy("timestamp", "desc"),
      limit(50)
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const list: PageView[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.visitorId === visitorId) {
            list.push({ id: doc.id, ...data } as unknown as PageView);
          }
        });
        setPageViews(list);
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsub();
  }, [visitorId]);

  return { pageViews, loading };
}

export function useVisitorSummary() {
  const [summary, setSummary] = useState({
    totalVisitors: 0,
    todayVisitors: 0,
    uniqueVisitors: 0,
    liveVisitors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;

    const unsub = onSnapshot(
      collection(db, "analytics", "visitors", "all"),
      (snapshot) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTs = today.getTime();
        const fiveMinAgo = Date.now() - 5 * 60 * 1000;

        let total = 0;
        let todayCount = 0;
        let liveCount = 0;

        snapshot.forEach((doc) => {
          total++;
          const data = doc.data();
          if ((data.lastVisit || 0) >= todayTs) todayCount++;
          if ((data.lastVisit || 0) >= fiveMinAgo) liveCount++;
        });

        setSummary({
          totalVisitors: total,
          todayVisitors: todayCount,
          uniqueVisitors: total,
          liveVisitors: liveCount,
        });
        setLoading(false);
      },
      () => setLoading(false)
    );

    return () => unsub();
  }, []);

  return { summary, loading };
}
