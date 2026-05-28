"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/glass-card";
import { cn } from "@/lib/utils";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
  className?: string;
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  index = 0,
  className,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
    >
      <GlassCard hover className={cn("h-full", className)}>
        <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-green-500/20 p-3">
          <Icon className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </GlassCard>
    </motion.div>
  );
}
