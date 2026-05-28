"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createNotification } from "@/lib/services/notification.service";
import { sendFcmNotification } from "@/app/action/send_notification";
import type { NotificationPayload } from "@/types";
import { AdminAuthGuard } from "@/components/admin/auth-guard";
import { AdminSubNav } from "@/components/admin/admin-subnav";

const initialForm: NotificationPayload = {
  title: "",
  description: "",
  type: "announcement",
  targetAudience: "all-users",
};

function NotificationsContent() {
  const [form, setForm] = useState<NotificationPayload>(initialForm);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title || !form.description) {
      toast.error("Title and description are required.");
      return;
    }

    setLoading(true);
    try {
      // 1. Save to Firestore
      await createNotification(form);

      // 2. Send FCM push notification via server action
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
    <section className="mx-auto w-full max-w-5xl px-4 py-16">
      <AdminSubNav />
      <h1 className="text-4xl font-bold">Push Notifications</h1>
      <p className="mt-3 text-muted-foreground">
        Create and send notifications to your Android user base via Firebase Cloud Messaging.
      </p>

      <Card className="mt-8 glass">
        <CardHeader>
          <CardTitle>Compose Notification</CardTitle>
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