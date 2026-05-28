"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Package, BarChart3, Headphones, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/apk-management", label: "APK Management", icon: Package },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/support", label: "Support Inbox", icon: Headphones },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
];

export function AdminSubNav() {
  const pathname = usePathname();

  return (
    <nav className="mx-auto mb-8 flex max-w-7xl flex-wrap items-center justify-evenly gap-2 rounded-xl border border-white/10 bg-background/70 px-4 py-3 backdrop-blur-lg">
      {/* Dashboard back‑link */}
      <Link
        href="/admin"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition",
          pathname === "/admin"
            ? "bg-cyan-500/20 text-cyan-400"
            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
        )}
      >
        <ArrowLeft className="h-4 w-4" />
        Dashboard
      </Link>

      {/* Page navigation links */}
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition",
              isActive
                ? "bg-cyan-500/20 text-cyan-400"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}