"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

type AppScreenshotCardProps = {
  src?: string;
  alt: string;
  label?: string;
  index?: number;
  className?: string;
  onClick?: () => void;
};

export function AppScreenshotCard({
  src,
  alt,
  label,
  index = 0,
  className,
  onClick,
}: AppScreenshotCardProps) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={onClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border border-white/20 bg-white/5 text-left shadow-lg backdrop-blur-sm",
        "dark:border-white/10",
        className,
      )}
    >
      <div className="relative aspect-[9/19] w-full">
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 280px"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-blue-500/20 via-cyan-500/15 to-green-500/20 p-4">
            <Smartphone className="h-10 w-10 text-cyan-500/60" />
            <span className="text-center text-xs font-medium text-muted-foreground">{alt}</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
      {label ? (
        <p className="absolute bottom-3 left-3 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
          {label}
        </p>
      ) : null}
    </motion.button>
  );
}
