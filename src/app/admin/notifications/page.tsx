"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createNotification } from "@/lib/services/notification.service";
import { sendFcmNotification } from "@/app/action/send_notification";
import { useNotificationHistory } from "@/hooks/use-notification-history";
import type { NotificationPayload } from "@/types";
import { AdminAuthGuard } from "@/components/admin/auth-guard";
import { AdminSubNav } from "@/components/admin/admin-subnav";
import { Bell, History, Send } from "lucide-react";

const initialForm: NotificationPayload = {
  title: "",
  description: "",
  type: "announcement",
  targetAudience: "all-users",
};

const typeLabels: Record<string, string> = {
  "new-version-alert": "New Version",
  announcement: "Announcement",
  maintenance: "Maintenance",
};

const audienceLabels: Record<string, string> = {
  "all-users": "All Users",
  "active-users": "Active Users",
  "beta-testers": "Beta Testers",
};

function formatDate(ts: unknown) {
  if (!ts) return "—";
  const d = (ts as { toDate?: () => Date }).toDate?.() ?? new Date(ts as number);
  return d.toLocaleString();
}

function NotificationsContent() {
  const [form, setForm] = useState<NotificationPayload>(initialForm);
  const [loading, setLoading] = useState(false);
  const { notifications, loading: historyLoading } = useNotificationHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.description) {
      toast.error("Title and description are required.");
      return;
    }

    setLoading(true);
    try {
      await createNotification(form);

      const result = await sendFcmNotification({
        title: form.title,
        description: form.description,
        targetAudience: form.targetAudience,
      });

      if (result.success) {
        toast.success("Notification sent successfully!");
      } else {
        toast.error("Saved but push send failed. Check server logs.");
      }

      setForm(initialForm);
    } catch (error) {
      console.error("Notification error:", error);
      toast.error("Failed to create notification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl space-y-8 px-4 py-16">
      <AdminSubNav />
      <h1 className="text-4xl font-bold">Push Notifications</h1>
      <p className="mt-3 text-muted-foreground">
        Create and send notifications to your Android user base via Firebase Cloud Messaging.
      </p>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-cyan-400" />
            Compose Notification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
            />
            <Textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              rows={4}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Type
                <select
                  className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  value={form.type}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      type: e.target.value as NotificationPayload["type"],
                    }))
                  }
                >
                  <option value="new-version-alert">New Version Alert</option>
                  <option value="announcement">Announcement</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </label>
              <label className="block text-sm font-medium">
                Audience
                <select
                  className="mt-2 w-full rounded-lg border bg-background px-3 py-2 text-sm"
                  value={form.targetAudience}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      targetAudience: e.target
                        .value as NotificationPayload["targetAudience"],
                    }))
                  }
                >
                  <option value="all-users">All Users</option>
                  <option value="active-users">Active Users</option>
                  <option value="beta-testers">Beta Testers</option>
                </select>
              </label>
            </div>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Sending..." : "Send Notification"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-purple-400" />
            Notification History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="mb-3 h-12 w-12 opacity-30" />
              <p className="text-lg font-medium">No notifications sent yet</p>
              <p className="text-sm">Your sent notifications will appear here.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {notifications.map((n) => (
                  <TableRow key={n.id}>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {formatDate(n.createdAt)}
                    </TableCell>
                    <TableCell className="font-medium">{n.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{typeLabels[n.type] || n.type}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{audienceLabels[n.targetAudience] || n.targetAudience}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          n.status === "sent" ? "default" :
                          n.status === "queued" ? "outline" :
                          "secondary"
                        }
                      >
                        {n.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

export default function AdminNotificationsPage() {
  return (
    <AdminAuthGuard>
      <NotificationsContent />
    </AdminAuthGuard>
  );
}