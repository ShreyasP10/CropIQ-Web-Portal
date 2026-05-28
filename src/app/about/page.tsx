"use client";

import { motion } from "framer-motion";
import { Brain, Leaf, Users } from "lucide-react";
import { SectionShell, GlassCard } from "@/components/shared";
import { useLiveStats } from "@/hooks/use-live-stats";
import { Skeleton } from "@/components/ui/skeleton";

export default function AboutPage() {
  const { stats: live, loading } = useLiveStats();

  const statItems = [
    {
      icon: Leaf,
      label: "Detections run",
      value: live.totalDetections,
      isDynamic: true,
    },
    {
      icon: Users,
      label: "Users",
      value: live.totalDownloads, 
      isDynamic: true,
    },
    {
      icon: Brain,
      label: "Offline capability",
      value: "99%",
      isDynamic: false,
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-green-500/5" />
        <div className="mx-auto max-w-7xl px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              About <span className="gradient-text">CropIQ</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Bridging agriculture and artificial intelligence to empower every farmer.
            </p>
          </motion.div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {statItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                <GlassCard className="text-center">
                  <item.icon className="mx-auto h-8 w-8 text-cyan-500" />
                  {loading && item.isDynamic ? (
                    <Skeleton className="mx-auto mt-3 h-8 w-20" />
                  ) : (
                    <p className="mt-3 text-2xl font-bold">
                      {item.isDynamic
                        ? (item.value as number).toLocaleString()
                        : item.value}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 grid gap-10 md:grid-cols-2">
            <SectionShell title="Our Vision" className="!p-0">
              <p className="text-muted-foreground">
                A world where every grower—from smallholder to large farm—can access affordable, accurate AI tools
                to protect crops and increase yields.
              </p>
            </SectionShell>
            <SectionShell title="Our Mission" className="!p-0">
              <p className="text-muted-foreground">
                Deliver on-device, real‑time crop & fruit intelligence using TensorFlow Lite, backed by a
                Firebase‑powered knowledge base that keeps improving.
              </p>
            </SectionShell>
            <SectionShell title="AI Technology" className="!p-0">
              <p className="text-muted-foreground">
                We run compressed vision models directly on Android, ensuring privacy and offline reliability.
                Updates are served via Firestore and Realtime Database.
              </p>
            </SectionShell>
            <SectionShell title="Future Goals" className="!p-0">
              <p className="text-muted-foreground">
                Expanding to more crops, integrating weather data, launching a marketplace for produce, and building a
                global community of smart farmers.
              </p>
            </SectionShell>
          </div>
        </div>
      </section>
    </>
  );
}