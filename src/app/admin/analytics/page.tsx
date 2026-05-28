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
import { rtdb } from "@/lib/firebase/client";
import { useAdminCounts } from "@/hooks/use-admin-counts";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { AdminAuthGuard } from "@/components/admin/auth-guard";
import { AdminSubNav } from "@/components/admin/admin-subnav";

const COLORS = ["#38bdf8", "#22c55e", "#a78bfa"];

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

  // Version downloads
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

  // Daily stats
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
          Real‑time metrics and version adoption.
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
      </div>

      <div className="glass rounded-2xl p-4">
        <h3 className="mb-4 text-lg font-medium">Activity Distribution</h3>
        {!statsLoading ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                innerRadius={60}
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