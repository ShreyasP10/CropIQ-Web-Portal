"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  addApkVersion,
  editApkVersion,
  getApkVersions,
  removeApkVersion,
} from "@/lib/services/apk.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ApkVersion } from "@/types";
import { motion } from "framer-motion";
import { AdminAuthGuard } from "@/components/admin/auth-guard";
import { AdminSubNav } from "@/components/admin/admin-subnav";

const emptyForm: Omit<ApkVersion, "id"> = {
  versionName: "",
  versionCode: 1,
  apkUrl: "",
  releaseDate: "",
  apkSize: "",
  downloads: 0,
  minAndroidVersion: "8.0",
  description: "",
  releaseNotes: [],
  featuresAdded: [],
  bugFixes: [],
  securityImprovements: [],
  isLatest: false,
};

function ApkManagementContent() {
  const [items, setItems] = useState<ApkVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    getApkVersions()
      .then((versions) => setItems(versions))
      .catch(() => toast.error("Failed to load APK versions"))
      .finally(() => setFetching(false));
  }, []);

  const parseList = (value: string) =>
    value
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.versionName || !form.apkUrl) {
      toast.error("Version name and APK URL are required.");
      return;
    }
    setLoading(true);
    try {
      const payload = { ...form };
      if (editingId) {
        await editApkVersion(editingId, payload);
        toast.success("APK version updated");
      } else {
        await addApkVersion(payload);
        toast.success("APK version added");
      }
      setForm(emptyForm);
      setEditingId(null);
      const refreshed = await getApkVersions();
      setItems(refreshed);
    } catch {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (item: ApkVersion) => {
    setEditingId(item.id);
    setForm({ ...item });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this version?")) return;
    setLoading(true);
    try {
      await removeApkVersion(id);
      toast.success("APK version deleted");
      if (editingId === id) cancelEdit();
      const refreshed = await getApkVersions();
      setItems(refreshed);
    } catch {
      toast.error("Deletion failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-16">
      <AdminSubNav />
      <h1 className="text-4xl font-bold">APK Management</h1>
      <p className="mt-3 text-muted-foreground">
        Manage APK releases stored in Firestore.
      </p>

      <Card className="mt-8 glass">
        <CardHeader>
          <CardTitle>{editingId ? "Edit APK" : "Add New APK"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="Version Name (v1.0.0)"
              value={form.versionName}
              onChange={(e) =>
                setForm((p) => ({ ...p, versionName: e.target.value }))
              }
            />
            <Input
              placeholder="Version Code"
              type="number"
              value={form.versionCode}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  versionCode: Number(e.target.value) || 1,
                }))
              }
            />
            <Input
              placeholder="APK URL (GitHub Release)"
              value={form.apkUrl}
              onChange={(e) =>
                setForm((p) => ({ ...p, apkUrl: e.target.value }))
              }
            />
            <Input
              placeholder="Release Date (YYYY-MM-DD)"
              value={form.releaseDate}
              onChange={(e) =>
                setForm((p) => ({ ...p, releaseDate: e.target.value }))
              }
            />
            <Input
              placeholder="APK Size (e.g., 45MB)"
              value={form.apkSize}
              onChange={(e) =>
                setForm((p) => ({ ...p, apkSize: e.target.value }))
              }
            />
            <Input
              placeholder="Min Android Version"
              value={form.minAndroidVersion}
              onChange={(e) =>
                setForm((p) => ({ ...p, minAndroidVersion: e.target.value }))
              }
            />
            <div className="md:col-span-2">
              <Textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                placeholder="Features Added (one per line)"
                value={form.featuresAdded.join("\n")}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    featuresAdded: parseList(e.target.value),
                  }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                placeholder="Bug Fixes (one per line)"
                value={form.bugFixes.join("\n")}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    bugFixes: parseList(e.target.value),
                  }))
                }
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                placeholder="Security Improvements (one per line)"
                value={form.securityImprovements.join("\n")}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    securityImprovements: parseList(e.target.value),
                  }))
                }
              />
            </div>
            <label className="flex items-center gap-2 text-sm md:col-span-2">
              <input
                type="checkbox"
                checked={form.isLatest}
                onChange={(e) =>
                  setForm((p) => ({ ...p, isLatest: e.target.checked }))
                }
              />
              Mark as latest version
            </label>
            <div className="flex gap-3 md:col-span-2">
              <Button type="submit" disabled={loading}>
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update APK"
                  : "Add APK"}
              </Button>
              {editingId && (
                <Button variant="outline" onClick={cancelEdit} type="button">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold">Existing Versions</h2>
        {fetching ? (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        ) : items.length === 0 ? (
          <p className="mt-4 text-muted-foreground">No APK versions found.</p>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {item.versionName}
                      {item.isLatest && (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
                          Latest
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>{item.description}</p>
                    <p className="text-muted-foreground">
                      Code: {item.versionCode} | Size: {item.apkSize} | Downloads:{" "}
                      {item.downloads}
                    </p>
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default function ApkManagementPage() {
  return (
    <AdminAuthGuard>
      <ApkManagementContent />
    </AdminAuthGuard>
  );
}