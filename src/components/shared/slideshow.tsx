// src/components/shared/slideshow.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Screenshot = {
  src: string;
  alt: string;
  label: string;
};

export function Slideshow({ items }: { items: readonly Screenshot[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [items.length]);

  const current = items[index];

  return (
    <div className="relative mx-auto w-full max-w-[300px] overflow-hidden rounded-[2rem] border border-white/20 shadow-2xl">
      <div className="aspect-[9/16] relative bg-black/20">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={current.src}
              alt={current.alt}
              fill
              className="object-cover"
              sizes="300px"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Subtle label overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur-sm">
        {current.label}
      </div>
    </div>
  );
}