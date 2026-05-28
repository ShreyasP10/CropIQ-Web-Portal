"use client";

import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { loading, authorized } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authorized) {
      router.replace("/admin/login");
    }
  }, [loading, authorized, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Checking access…
      </div>
    );
  }

  if (!authorized) {
    return null; // redirect happens
  }

  return <>{children}</>;
}