"use client";

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

export default function FeaturesPage() {
  return (
    <SectionShell
      eyebrow="Features"
      title="Powerful AI Suite"
      description="Everything you need for modern, intelligent farming."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <GlassCard hover className="h-full">
              <div className="mb-4 inline-flex rounded-lg bg-muted p-3">
                <feature.icon className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-base font-semibold">{feature.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </SectionShell>
  );
}