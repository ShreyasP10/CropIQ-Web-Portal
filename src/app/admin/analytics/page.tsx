"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { onValue, ref } from "firebase/database";
import { collection, onSnapshot } from "firebase/firestore";
import { rtdb, db } from "@/lib/firebase/client";
import { useAdminCounts } from "@/hooks/use-admin-counts";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { AdminAuthGuard } from "@/components/admin/auth-guard";
import { AdminSubNav } from "@/components/admin/admin-subnav";

const COLORS = ["#38bdf8", "#22c55e", "#a78bfa", "#f59e0b", "#ec4899"];

interface DailyStat {
  downloads: number;
  detections: number;
}
interface DailyStatsMap {
  [date: string]: DailyStat;
}

function AnalyticsContent() {
  const { counts, loading: statsLoading } = useAdminCounts();
  const [versionDownloads, setVersionDownloads] = useState<
    { version: string; downloads: number }[]
  >([]);
  const [versionLoading, setVersionLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState<
    { date: string; downloads: number; detections: number }[]
  >([]);
  const [dailyLoading, setDailyLoading] = useState(true);
  const [visitorDeviceStats, setVisitorDeviceStats] = useState<
    { name: string; value: number }[]
  >([]);
  const [visitorBrowserStats, setVisitorBrowserStats] = useState<
    { name: string; value: number }[]
  >([]);
  const [visitorDailyStats, setVisitorDailyStats] = useState<
    { date: string; visitors: number }[]
  >([]);
  const [visitorLoading, setVisitorLoading] = useState(true);

  // Version downloads from RTDB
  useEffect(() => {
    if (!rtdb) {
      setVersionLoading(false);
      return;
    }
    const versionRef = ref(rtdb, "VersionDownloads");
    const unsubscribe = onValue(
      versionRef,
      (snapshot) => {
        const value = snapshot.val() as Record<string, number> | null;
        if (!value) {
          setVersionDownloads([]);
        } else {
          const mapped = Object.entries(value).map(([version, downloads]) => ({
            version,
            downloads: Number(downloads ?? 0),
          }));
          setVersionDownloads(mapped);
        }
        setVersionLoading(false);
      },
      () => setVersionLoading(false)
    );
    return () => unsubscribe();
  }, []);

  // Daily stats from RTDB
  useEffect(() => {
    if (!rtdb) {
      setDailyLoading(false);
      return;
    }
    const dailyRef = ref(rtdb, "DailyStats");
    const unsubscribe = onValue(
      dailyRef,
      (snapshot) => {
        const value = snapshot.val() as DailyStatsMap | null;
        if (!value) {
          setDailyStats([]);
        } else {
          const entries = Object.entries(value)
            .map(([date, stats]) => ({
              date,
              downloads: Number(stats.downloads ?? 0),
              detections: Number(stats.detections ?? 0),
            }))
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(-7);
          setDailyStats(entries);
        }
        setDailyLoading(false);
      },
      () => setDailyLoading(false)
    );
    return () => unsubscribe();
  }, []);

  // Visitor analytics from Firestore
  useEffect(() => {
    if (!db) {
      setVisitorLoading(false);
      return;
    }

    const unsub = onSnapshot(
      collection(db, "analytics", "visitors", "all"),
      (snapshot) => {
        const deviceCount: Record<string, number> = {};
        const browserCount: Record<string, number> = {};
        const dailyCount: Record<string, number> = {};
        const today = new Date();

        snapshot.forEach((doc) => {
          const data = doc.data();

          const device = (data.device as string) || "Unknown";
          deviceCount[device] = (deviceCount[device] || 0) + 1;

          const browser = (data.browser as string) || "Unknown";
          const browserBase = browser.split(" ")[0] || browser;
          browserCount[browserBase] = (browserCount[browserBase] || 0) + 1;

          const visitTime = data.lastVisit as number;
          if (visitTime) {
            const d = new Date(visitTime);
            const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
            if (dateKey === today.toISOString().slice(0, 10) || Object.keys(dailyCount).length < 7) {
              dailyCount[dateKey] = (dailyCount[dateKey] || 0) + 1;
            }
          }
        });

        setVisitorDeviceStats(
          Object.entries(deviceCount).map(([name, value]) => ({ name, value }))
        );
        setVisitorBrowserStats(
          Object.entries(browserCount).map(([name, value]) => ({ name, value }))
        );
        setVisitorDailyStats(
          Object.entries(dailyCount)
            .sort(([a], [b]) => a.localeCompare(b))
            .slice(-7)
            .map(([date, visitors]) => ({ date, visitors }))
        );
        setVisitorLoading(false);
      },
      () => setVisitorLoading(false)
    );

    return () => unsub();
  }, []);

  const pieData = useMemo(
    () => [
      { name: "Detections", value: counts.totalDetections || 1 },
      { name: "Downloads", value: counts.totalDownloads || 1 },
      { name: "Community", value: counts.communityPosts || 1 },
    ],
    [counts]
  );

  return (
    <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-16">
      <AdminSubNav />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold">Analytics Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Real‑time metrics for downloads, detections, and website visitors.
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-4 text-lg font-medium">Weekly Overview</h3>
          {dailyLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : dailyStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="downloads"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Downloads"
                />
                <Line
                  type="monotone"
                  dataKey="detections"
                  stroke="#22c55e"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Detections"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
              No daily data yet.
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-4">
          <h3 className="mb-4 text-lg font-medium">Website Visitors (Last 7 Days)</h3>
          {visitorLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : visitorDailyStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visitorDailyStats}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Visitors"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
              No visitor data yet.
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="glass rounded-2xl p-4">
          <h3 className="mb-4 text-lg font-medium">Device Distribution</h3>
          {visitorLoading ? (
            <Skeleton className="h-[250px] w-full" />
          ) : visitorDeviceStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={visitorDeviceStats}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={5}
                  label
                >
                  {visitorDeviceStats.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
              No data
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-4">
          <h3 className="mb-4 text-lg font-medium">Browser Distribution</h3>
          {visitorLoading ? (
            <Skeleton className="h-[250px] w-full" />
          ) : visitorBrowserStats.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={visitorBrowserStats}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={5}
                  label
                >
                  {visitorBrowserStats.map((_, i) => (
                    <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
              No data
            </div>
          )}
        </div>

        <div className="glass rounded-2xl p-4">
          <h3 className="mb-4 text-lg font-medium">Activity Distribution</h3>
          {!statsLoading ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  innerRadius={45}
                  paddingAngle={5}
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Skeleton className="h-[250px] w-full" />
          )}
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <h3 className="mb-4 text-lg font-medium">Downloads by Version</h3>
        {!versionLoading ? (
          versionDownloads.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={versionDownloads}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="version" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="downloads" fill="#60a5fa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
              No version download data yet.
            </p>
          )
        ) : (
          <Skeleton className="h-[300px] w-full" />
        )}
      </div>
    </section>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <AdminAuthGuard>
      <AnalyticsContent />
    </AdminAuthGuard>
  );
}