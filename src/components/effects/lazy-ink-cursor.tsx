"use client";

import dynamic from "next/dynamic";

const InkCursorImpl = dynamic(
  () => import("@/components/effects/ink-cursor").then((m) => m.InkCursor),
  { ssr: false }
);

export function LazyInkCursor() {
  return <InkCursorImpl />;
}
