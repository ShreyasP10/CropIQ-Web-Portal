"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PresenceUser } from "@/hooks/use-presence-users";
import { cn } from "@/lib/utils";

function formatLastSeen(timestamp: number): string {
  if (!timestamp) return "unknown";
  const diff = Date.now() - timestamp;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function UserAvatar({ user }: { user: PresenceUser }) {
  const [showPopover, setShowPopover] = useState(false);
  const initials = getInitials(user.name);
  const imgSrc = user.photoURL || undefined;

  return (
    <div
      className="relative"
      onMouseEnter={() => setShowPopover(true)}
      onMouseLeave={() => setShowPopover(false)}
    >
      {/* Avatar circle */}
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium text-foreground shadow-inner ring-1 ring-white/10">
        {imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={user.name}
            className="h-full w-full rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <span>{initials}</span>
        )}

        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 block h-3.5 w-3.5 rounded-full border-2 border-background",
            user.isOnline ? "bg-green-500" : "bg-gray-500"
          )}
        />
      </div>

      <AnimatePresence>
        {showPopover && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 z-50 mb-3 w-56 -translate-x-1/2 rounded-2xl border border-white/10 bg-card/95 p-4 shadow-xl backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              {imgSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imgSrc}
                  alt={user.name}
                  className="h-12 w-12 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-lg font-semibold">
                  {initials}
                </div>
              )}

              <div>
                <p className="font-semibold text-foreground">{user.name}</p>
                {user.username && (
                  <p className="text-xs text-muted-foreground">
                    @{user.username}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {user.isOnline
                    ? "Online"
                    : `Last seen ${formatLastSeen(user.lastSeen)}`}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ActiveUsersCard({
  users,
  loading,
}: {
  users: PresenceUser[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="glass rounded-2xl p-5">
        <div className="h-6 w-24 animate-pulse rounded bg-white/5" />
        <div className="mt-4 flex gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-10 animate-pulse rounded-full bg-white/5"
            />
          ))}
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="glass rounded-2xl p-5 text-sm text-muted-foreground">
        No active users yet.
      </div>
    );
  }

  const onlineCount = users.filter((u) => u.isOnline).length;

  return (
    <div className="glass rounded-2xl p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Active Users</h3>
        <span className="text-xs text-muted-foreground">
          {onlineCount} online
        </span>
      </div>
      <div className="flex gap-3 overflow-visible py-1">
        {users.map((user) => (
          <UserAvatar key={user.uid} user={user} />
        ))}
      </div>
    </div>
  );
}