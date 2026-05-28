"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getFeedbackItems, updateFeedbackStatus } from "@/lib/services/feedback.service";
import type { SupportFeedbackItem } from "@/types";
import { motion } from "framer-motion";
import { AdminAuthGuard } from "@/components/admin/auth-guard";
import { AdminSubNav } from "@/components/admin/admin-subnav";

function SupportContent() {
  const [items, setItems] = useState<SupportFeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    getFeedbackItems()
      .then(setItems)
      .catch(() => toast.error("Failed to load feedback"))
      .finally(() => setLoading(false));
  }, []);

  const markStatus = async (id: string, status: SupportFeedbackItem["status"]) => {
    try {
      await updateFeedbackStatus(id, status);
      toast.success(`Marked as ${status}`);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16">
      <AdminSubNav />
      <h1 className="text-4xl font-bold">User Feedback</h1>
      <p className="mt-3 text-muted-foreground">
        Review and manage suggestions, bugs, and support requests.
      </p>

      {loading ? (
        <div className="mt-8 space-y-4">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      ) : items.length === 0 ? (
        <p className="mt-8 text-muted-foreground">No feedback yet.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Card
                className="glass cursor-pointer transition-colors hover:border-cyan-500/20"
                onClick={() =>
                  setExpandedId(expandedId === item.id ? null : item.id)
                }
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>
                      {item.type} – {item.name}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.status === "Resolved"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : item.status === "Read"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {item.status}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    <strong>Email:</strong> {item.email}
                  </p>
                  {expandedId === item.id && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-2 whitespace-pre-wrap text-muted-foreground"
                    >
                      {item.message}
                    </motion.p>
                  )}
                  <div className="flex gap-2 pt-2">
                    {item.status !== "Read" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          markStatus(item.id, "Read");
                        }}
                      >
                        Mark Read
                      </Button>
                    )}
                    {item.status !== "Resolved" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          markStatus(item.id, "Resolved");
                        }}
                      >
                        Mark Resolved
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function AdminSupportPage() {
  return (
    <AdminAuthGuard>
      <SupportContent />
    </AdminAuthGuard>
  );
}