"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ScreenshotItem = {
  src?: string;
  alt: string;
  label: string;
};

export function ScreenshotCarousel({ items }: { items: readonly ScreenshotItem[] }) {
  const safeItems = items.length ? items : [{ alt: "App screenshot", label: "Preview" }];
  const [index, setIndex] = useState(0);

  // Auto‑rotate every 3 seconds
  useEffect(() => {
    if (safeItems.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % safeItems.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [safeItems.length]);

  const goNext = () => setIndex((prev) => (prev + 1) % safeItems.length);
  const goPrev = () => setIndex((prev) => (prev - 1 + safeItems.length) % safeItems.length);

  const current = safeItems[index];

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-[320px] mx-auto">
      {/* Image container – no forced aspect ratio */}
      <div className="w-full overflow-hidden rounded-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${current.alt}-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <img
              src={current.src || "/placeholder-screenshot.png"}
              alt={current.alt}
              className="w-full h-auto block rounded-lg"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation arrows */}
      <div className="flex items-center justify-between w-full max-w-[200px]">
        <button
          onClick={goPrev}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-background/80 text-foreground backdrop-blur transition hover:bg-foreground/10"
          aria-label="Previous screenshot"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-xs tabular-nums text-muted-foreground">
          {index + 1} / {safeItems.length}
        </p>
        <button
          onClick={goNext}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-background/80 text-foreground backdrop-blur transition hover:bg-foreground/10"
          aria-label="Next screenshot"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}