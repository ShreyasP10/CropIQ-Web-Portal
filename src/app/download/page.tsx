"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Bug,
  CalendarDays,
  DownloadCloud,
  ShieldCheck,
  Sparkles,
  Smartphone,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getApkVersions } from "@/lib/services/apk.service";
import type { ApkVersion } from "@/types";
import { motion } from "framer-motion";
import { trackDownloadAction } from "@/app/action/track-download";



export default function DownloadPage() {
  const [versions, setVersions] = useState<ApkVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getApkVersions()
      .then(setVersions)
      .catch(() => setError("Failed to load versions."))
      .finally(() => setLoading(false));
  }, []);

  const handleDownload =
    async (version: ApkVersion) => {

      await trackDownloadAction(
        version.versionName
      );

      window.open(
        version.apkUrl,
        "_blank",
        "noopener,noreferrer"
      );
    };

  const latest = versions.find((v) => v.isLatest) ?? versions[0];
  const previous = versions.filter((v) => v.id !== latest?.id);

  if (error) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold">Download Center</h1>
        <p className="mt-3 text-muted-foreground">
          Secure APK releases delivered through verified GitHub Releases.
        </p>
      </motion.div>

      {loading ? (
        <div className="mt-10 space-y-4">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-36 rounded-2xl" />
            <Skeleton className="h-36 rounded-2xl" />
          </div>
        </div>
      ) : (
        <>
          {latest ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="mt-10 glass border border-cyan-500/20 overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-center gap-2 text-xl">
                    Latest: {latest.versionName}
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-700 dark:text-emerald-300">
                      Verified
                    </span>
                    <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-xs text-cyan-700 dark:text-cyan-300">
                      Secure
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 text-sm md:grid-cols-2">
                  <div className="space-y-3">
                    <p>{latest.description}</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {latest.releaseDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Smartphone className="h-4 w-4" />
                        Android {latest.minAndroidVersion}+
                      </span>
                      <span>{latest.apkSize}</span>
                      <span>v{latest.versionCode}</span>
                      <span>
                        {latest.downloads.toLocaleString()} downloads
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="flex items-center gap-2 font-medium">
                        <Sparkles className="h-4 w-4 text-cyan-500" />
                        Features Added
                      </p>
                      <ul className="mt-1 space-y-1 text-muted-foreground">
                        {latest.featuresAdded.length
                          ? latest.featuresAdded.map((f) => (
                              <li key={f}>• {f}</li>
                            ))
                          : "Initial release"}
                      </ul>
                    </div>
                    <div>
                      <p className="flex items-center gap-2 font-medium">
                        <Bug className="h-4 w-4 text-orange-500" />
                        Bug Fixes
                      </p>
                      <ul className="mt-1 space-y-1 text-muted-foreground">
                        {latest.bugFixes.length
                          ? latest.bugFixes.map((f) => (
                              <li key={f}>• {f}</li>
                            ))
                          : "Stability improvements"}
                      </ul>
                    </div>
                    <div>
                      <p className="flex items-center gap-2 font-medium">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        Security
                      </p>
                      <ul className="mt-1 space-y-1 text-muted-foreground">
                        {latest.securityImprovements.length
                          ? latest.securityImprovements.map((f) => (
                              <li key={f}>• {f}</li>
                            ))
                          : "Hardened build"}
                      </ul>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(latest)}
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "mt-2 w-full sm:w-auto"
                    )}
                  >
                    <DownloadCloud className="mr-2 h-4 w-4" />
                    Download APK
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <p className="mt-10 text-center text-muted-foreground">
              No versions available yet.
            </p>
          )}

          {previous.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold">Previous Versions</h2>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {previous.map((version, i) => (
                  <motion.div
                    key={version.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <Card className="glass border border-white/10">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {version.versionName}
                          <span className="text-xs text-muted-foreground">
                            {version.releaseDate}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          {version.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Version code: {version.versionCode} · Size:{" "}
                          {version.apkSize}
                        </p>
                        <button
                          onClick={() => handleDownload(version)}
                          className={cn(buttonVariants({ variant: "outline" }))}
                        >
                          <BadgeCheck className="mr-2 h-4 w-4" />
                          Download
                        </button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}