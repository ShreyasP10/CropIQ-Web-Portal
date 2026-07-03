"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminAuthGuard } from "@/components/admin/auth-guard";
import { AdminSubNav } from "@/components/admin/admin-subnav";
import { useVisitors, useVisitorPageViews, useVisitorSummary } from "@/hooks/use-visitors";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  Eye,
  Globe,
  Activity,
  Monitor,
  Smartphone,
  Globe2,
  Clock,
  Link2,
  MapPin,
} from "lucide-react";

function formatTime(ts: number) {
  return new Date(ts).toLocaleString();
}

function getDeviceIcon(device: string) {
  if (device === "Mobile") return <Smartphone className="h-4 w-4" />;
  return <Monitor className="h-4 w-4" />;
}

function VisitorDetailDialog({
  visitor,
  open,
  onClose,
}: {
  visitor: NonNullable<ReturnType<typeof useVisitors>["visitors"][number]>;
  open: boolean;
  onClose: () => void;
}) {
  const { pageViews, loading: pvLoading } = useVisitorPageViews(visitor.visitorId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Visitor Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Visitor ID</p>
              <p className="break-all font-mono text-sm">{visitor.visitorId}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">IP Address</p>
              <p className="font-mono text-sm">{visitor.ip}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">First Visit</p>
              <p className="text-sm">{formatTime(visitor.firstVisit)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Visit</p>
              <p className="text-sm">{formatTime(visitor.lastVisit)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Visit Count</p>
              <p className="text-sm font-semibold">{visitor.visitCount}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Referrer</p>
              <p className="truncate text-sm">{visitor.referrer || "Direct"}</p>
            </div>
          </div>

          <div className="rounded-lg border border-white/10 p-4">
            <h4 className="mb-3 text-sm font-semibold text-cyan-400">Device &amp; Browser</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Browser</p>
                <p>{visitor.browser}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">OS</p>
                <p>{visitor.os}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Device</p>
                <p>{visitor.device}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Screen</p>
                <p>{visitor.screenWidth}x{visitor.screenHeight}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Language</p>
                <p>{visitor.language}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Timezone</p>
                <p>{visitor.timezone}</p>
              </div>
            </div>
          </div>

          {(visitor.city || visitor.country) && (
            <div className="rounded-lg border border-white/10 p-4">
              <h4 className="mb-3 text-sm font-semibold text-cyan-400">Location</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {visitor.city && (
                  <div>
                    <p className="text-xs text-muted-foreground">City</p>
                    <p>{visitor.city}</p>
                  </div>
                )}
                {visitor.state && (
                  <div>
                    <p className="text-xs text-muted-foreground">State</p>
                    <p>{visitor.state}</p>
                  </div>
                )}
                {visitor.country && (
                  <div>
                    <p className="text-xs text-muted-foreground">Country</p>
                    <p>{visitor.country}</p>
                  </div>
                )}
                {visitor.isp && (
                  <div>
                    <p className="text-xs text-muted-foreground">ISP</p>
                    <p>{visitor.isp}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="rounded-lg border border-white/10 p-4">
            <h4 className="mb-3 text-sm font-semibold text-cyan-400">Pages Visited</h4>
            {pvLoading ? (
              <Skeleton className="h-20 w-full" />
            ) : pageViews.length > 0 ? (
              <div className="space-y-2">
                {pageViews.slice(0, 20).map((pv) => (
                  <div key={pv.id} className="flex items-center justify-between rounded-md bg-white/5 px-3 py-1.5 text-sm">
                    <span className="text-muted-foreground">{pv.page}</span>
                    <span className="text-xs text-muted-foreground">{formatTime(pv.timestamp)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No page views recorded.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function VisitorsContent() {
  const { visitors, loading } = useVisitors(100);
  const { summary, loading: summaryLoading } = useVisitorSummary();
  const [selectedVisitor, setSelectedVisitor] = useState<typeof visitors[number] | null>(null);

  const statsCards = [
    { title: "Total Visitors", value: summary.totalVisitors, icon: Users, color: "text-blue-500" },
    { title: "Today", value: summary.todayVisitors, icon: Activity, color: "text-green-500" },
    { title: "Unique Visitors", value: summary.uniqueVisitors, icon: Eye, color: "text-cyan-500" },
    { title: "Live Now", value: summary.liveVisitors, icon: Globe, color: "text-purple-500" },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-16">
      <AdminSubNav />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-bold">Visitor History</h1>
        <p className="mt-2 text-muted-foreground">
          Track who visits your CropIQ website with device, location &amp; page analytics.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.title} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
              <Card className="glass h-full border-white/10 transition-all hover:border-cyan-500/20 hover:bg-white/[0.03]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  {summaryLoading ? (
                    <Skeleton className="h-8 w-20" />
                  ) : (
                    <div className="text-2xl font-bold tracking-tight">{card.value.toLocaleString()}</div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-cyan-400" />
            Recent Visitors
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : visitors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Eye className="mb-3 h-12 w-12 opacity-30" />
              <p className="text-lg font-medium">No visitors yet</p>
              <p className="text-sm">Visitor data will appear here once people start browsing your site.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Browser</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Visits</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitors.map((v) => (
                  <TableRow
                    key={v.visitorId}
                    className="cursor-pointer transition-colors hover:bg-white/[0.02]"
                    onClick={() => setSelectedVisitor(v)}
                  >
                    <TableCell className="whitespace-nowrap text-sm">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {formatTime(v.lastVisit)}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{v.ip}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        {getDeviceIcon(v.device)}
                        {v.os}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{v.browser}</TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {v.city || v.country || "Unknown"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {v.visitCount}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link2 className="ml-auto h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {selectedVisitor && (
        <VisitorDetailDialog
          visitor={selectedVisitor}
          open={!!selectedVisitor}
          onClose={() => setSelectedVisitor(null)}
        />
      )}
    </section>
  );
}

export default function AdminVisitorsPage() {
  return (
    <AdminAuthGuard>
      <VisitorsContent />
    </AdminAuthGuard>
  );
}
