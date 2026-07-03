"use client";

import Link from "next/link";

import { usePresenceUsers } from "@/hooks/use-presence-users";
import { ActiveUsersCard } from "@/components/admin/active-users-card";
import {
  DownloadCloud,
  Leaf,
  Users,
  MessageSquare,
  TrendingUp,
  Package,
  BarChart3,
  Headphones,
  Bell,
  Eye,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useAdminCounts } from "@/hooks/use-admin-counts";

import { Skeleton } from "@/components/ui/skeleton";
import { AdminAuthGuard } from "@/components/admin/auth-guard";
import { motion } from "framer-motion";

const iconMap = {
  Downloads: DownloadCloud,
  Detections: Leaf,
  "Active Users": Users,
  "Community Posts": MessageSquare,
  "Today Downloads": TrendingUp,
};

const navLinks = [
  {
    href: "/admin/apk-management",
    label: "APK Management",
    icon: Package,
    color: "text-cyan-500",
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
    color: "text-blue-500",
  },
  {
    href: "/admin/visitors",
    label: "Visitors",
    icon: Eye,
    color: "text-amber-500",
  },
  {
    href: "/admin/support",
    label: "Support Inbox",
    icon: Headphones,
    color: "text-green-500",
  },
  {
    href: "/admin/notifications",
    label: "Notifications",
    icon: Bell,
    color: "text-purple-500",
  },
];

function DashboardContent() {
  const { counts, loading } = useAdminCounts();
  const { users: presenceUsers, loading: presenceLoading } = usePresenceUsers();

  const cards = [
    {
      title: "Downloads",
      value: counts.totalDownloads,
      loading,
    },
    {
      title: "Detections",
      value: counts.totalDetections,
      loading,
    },
    {
      title: "Total Users",
      value: counts.activeUsers,
      loading,
    },
    {
      title: "Community Posts",
      value: counts.communityPosts,
      loading,
    },
    {
      title: "Today Downloads",
      value: counts.todayDownloads,
      loading,
    },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">
          Real-time overview of the CropIQ ecosystem.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon =
            iconMap[card.title as keyof typeof iconMap] ?? Leaf;

          return (
            <motion.div
              key={card.title}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="glass relative h-full overflow-hidden border-white/10 transition-all hover:border-cyan-500/20 hover:bg-white/[0.03]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {card.loading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div className="text-2xl font-bold tracking-tight">
                      {card.value.toLocaleString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Active Users Section */}
      <div className="mt-10">
        <ActiveUsersCard users={presenceUsers} loading={presenceLoading} />
      </div>

      {/* Quick Actions */}
      <div className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <motion.div
                key={link.href}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link href={link.href} className="block h-full">
                  <Card className="glass h-full border-white/10 transition-all duration-300 hover:border-cyan-500/20 hover:bg-white/[0.03]">
                    <CardContent className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                      <div className="rounded-2xl bg-white/5 p-3">
                        <Icon className={`h-8 w-8 ${link.color}`} />
                      </div>
                      <span className="text-sm font-medium">
                        {link.label}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function AdminPage() {
  return (
    <AdminAuthGuard>
      <DashboardContent />
    </AdminAuthGuard>
  );
}