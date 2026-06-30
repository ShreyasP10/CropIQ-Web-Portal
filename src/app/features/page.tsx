"use client";

import { cn } from "@/lib/utils";
import {
  Sparkles,
  Leaf,
  Languages,
  MessageSquare,
  History,
  ShieldCheck,
  CloudOff,
} from "lucide-react";
import { motion } from "framer-motion";
import { SectionShell, GlassCard } from "@/components/shared";
import type { LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: Sparkles,
    title: "AI Fruit Detection",
    description: "Identify fruits instantly with on-device TensorFlow Lite models.",
  },
  {
    icon: Leaf,
    title: "Crop Disease Detection",
    description: "Early disease spotting with actionable care recommendations.",
  },
  {
    icon: Languages,
    title: "Hindi & English Support",
    description: "Bilingual interface for wider farmer accessibility.",
  },
  {
    icon: MessageSquare,
    title: "Community Feed",
    description: "Share insights, learn from peers, and grow together.",
  },
  {
    icon: History,
    title: "Detection History",
    description: "Track past scans and monitor crop health over time.",
  },
  {
    icon: ShieldCheck,
    title: "Smart Precautions & Care",
    description: "Prevention tips and treatment guidance after each scan.",
  },
  {
    icon: CloudOff,
    title: "Offline AI Detection",
    description: "Core detection works without internet in the field.",
  },
];

const featureIcons: Record<string, string> = {
  "AI Fruit Detection": "from-blue-500/20 via-cyan-500/20 to-green-500/20",
  "Crop Disease Detection": "from-amber-500/20 via-orange-500/20 to-red-500/20",
  "Hindi & English Support": "from-purple-500/20 via-pink-500/20 to-rose-500/20",
  "Community Feed": "from-teal-500/20 via-emerald-500/20 to-green-500/20",
  "Detection History": "from-sky-500/20 via-blue-500/20 to-indigo-500/20",
  "Smart Precautions & Care": "from-amber-500/20 via-yellow-500/20 to-orange-500/20",
  "Offline AI Detection": "from-violet-500/20 via-purple-500/20 to-fuchsia-500/20",
};

export default function FeaturesPage() {
  return (
    <SectionShell
      eyebrow="Features"
      title="Powerful AI Suite"
      description="Everything you need for modern, intelligent farming."
    >
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 18, delay: i * 0.06 }}
          >
            <GlassCard variant="elevated" hover className="h-full">
              <div className={cn("mb-4 inline-flex rounded-xl bg-gradient-to-br p-3", featureIcons[feature.title])}>
                <feature.icon className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}