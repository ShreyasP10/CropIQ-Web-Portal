"use client";

import {
  ArrowRight,
  Brain,
  CloudOff,
  History,
  Leaf,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import {
  AnimatedCounter,
  FeatureCard,
  GradientButton,
  Logo,
  SectionShell,
} from "@/components/shared";
import { motion } from "framer-motion";
import { useLiveStats } from "@/hooks/use-live-stats";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { ScreenshotCarousel } from "@/components/shared/screenshot-carousel";

const FaqAccordion = dynamic(() =>
  import("@/components/shared/faq-accordion").then((m) => m.FaqAccordion)
);

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Fruit Detection",
    description:
      "Identify fruits instantly with on-device TensorFlow Lite models.",
  },
  {
    icon: Leaf,
    title: "Crop Disease Detection",
    description:
      "Detect diseases early and get actionable care recommendations.",
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
    description:
      "Get prevention tips and treatment guidance after each scan.",
  },
  {
    icon: CloudOff,
    title: "Offline AI Detection",
    description:
      "Core detection works without internet in the field.",
  },
] as const;

const SCREENSHOTS = [
  { src: "/screenshots/Detection.jpeg", alt: "Detection screen", label: "Fruit Detection" },
  { src: "/screenshots/Detection2.jpeg", alt: "Detection screen 2", label: "Detection V2" },
  { src: "/screenshots/Dashboard.jpeg", alt: "Dashboard", label: "Dashboard" },
  { src: "/screenshots/Community.jpeg", alt: "Community feed", label: "Community Feed" },
  { src: "/screenshots/YourCrop.jpeg", alt: "Your Crop", label: "Your Crop" },
  { src: "/screenshots/Profile.png", alt: "Profile section", label: "Profile" },
  { src: "/screenshots/PrecautionsPopUp.jpeg", alt: "Precautions popup", label: "Precautions" },
  { src: "/screenshots/History.jpeg", alt: "History page", label: "Detection History" },
  { src: "/screenshots/Setting.jpeg", alt: "Settings page", label: "Settings" },
] as const;

export default function Home() {
  const { stats, loading: statsLoading } = useLiveStats();

  const statItems = [
    { label: "Total Downloads", value: stats.totalDownloads },
    { label: "Total Detections", value: stats.totalDetections },
    { label: "Total Users", value: stats.activeUsers },
    { label: "Community Posts", value: stats.communityPosts },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-green-500/5" />
        <div className="pointer-events-none absolute -top-32 left-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-green-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 top-1/4 h-64 w-64 rounded-full bg-amber-400/8 blur-3xl" />

        {/* Decorative leaf SVG */}
        <svg className="pointer-events-none absolute -left-16 top-1/3 h-48 w-48 text-cyan-500/5" viewBox="0 0 200 200" fill="currentColor">
          <path d="M100 10C45 60 10 110 10 150c0 22 18 40 40 40 25 0 50-20 50-60 0 40 25 60 50 60 22 0 40-18 40-40 0-40-35-90-90-140z" />
        </svg>
        <svg className="pointer-events-none absolute -bottom-8 -right-8 h-36 w-36 rotate-45 text-green-500/5" viewBox="0 0 200 200" fill="currentColor">
          <path d="M100 10C45 60 10 110 10 150c0 22 18 40 40 40 25 0 50-20 50-60 0 40 25 60 50 60 22 0 40-18 40-40 0-40-35-90-90-140z" />
        </svg>

        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 md:grid-cols-2 md:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Logo className="mb-6" />
            <p className="inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium tracking-wide text-amber-700 uppercase dark:text-amber-300">
              AI Powered Crop & Fruit Detection
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              <span className="gradient-text">CropIQ</span>
              <br />
              <span className="text-foreground">Premium AI for Modern Agriculture</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">
              Detect crop diseases and fruit types in seconds with on-device TensorFlow Lite AI and a farmer-first
              Android experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <GradientButton href="/download">
                Download APK <ArrowRight className="ml-2 h-4 w-4" />
              </GradientButton>
              <GradientButton href="/features" variant="outline">
                Explore Features
              </GradientButton>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="relative flex items-center justify-center"
          >
            <ScreenshotCarousel items={SCREENSHOTS} />
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <SectionShell
        eyebrow="Features"
        title="Built for the field"
        description="Everything farmers need in one intelligent app."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </SectionShell>

      {/* WHY CROPIQ */}
      <SectionShell
        eyebrow="Why CropIQ"
        title="Smarter farming, faster decisions"
        align="center"
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Brain, label: "Fast AI Detection" },
            { icon: CloudOff, label: "Offline Support" },
            { icon: Users, label: "Farmer Friendly" },
            { icon: Leaf, label: "Smart Crop Monitoring" },
            { icon: ShieldCheck, label: "Easy To Use" },
            { icon: ShieldCheck, label: "Accurate Results" },
          ].map((item, index) => (
            <FeatureCard
              key={item.label}
              icon={item.icon}
              title={item.label}
              description="Designed for reliability in real agricultural environments."
              index={index}
            />
          ))}
        </div>
      </SectionShell>

      {/* LIVE STATS */}
      <section className="relative overflow-hidden py-16 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-green-500/5" />
        <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-cyan-400/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-amber-400/5 blur-3xl" />
        <div className="relative mx-auto w-full max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium tracking-wide text-amber-700 uppercase dark:text-amber-300">
              Live Stats
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Growing with farmers
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statItems.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ type: "spring", stiffness: 120, damping: 16, delay: i * 0.08 }}
              >
                <div className="rounded-2xl border border-border/40 bg-card/80 p-6 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
                  {statsLoading ? (
                    <Skeleton className="mx-auto h-8 w-20" />
                  ) : (
                    <p className="bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 bg-clip-text text-4xl font-bold text-transparent">
                      <AnimatedCounter value={stat.value} />
                    </p>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <SectionShell
        eyebrow="FAQ"
        title="Frequently asked questions"
        className="pb-20"
      >
        <FaqAccordion
          items={[
            {
              question: "How do I install the CropIQ APK?",
              answer:
                "Open the Download page, tap Download APK, then allow installation from unknown sources on your Android device if prompted.",
            },
            {
              question: "Is CropIQ free to use?",
              answer:
                "Yes, the current release is free for farmers and agriculture learners, with future premium features planned for advanced analytics.",
            },
            {
              question: "Does detection work offline?",
              answer:
                "Yes. Core fruit and crop disease detection runs on-device using TensorFlow Lite, so internet is not required for the detection flow.",
            },
            {
              question: "Is internet required at all?",
              answer:
                "Internet is needed for community features, syncing updates, and receiving the latest app data, but core scanning can run offline.",
            },
            {
              question: "How accurate are predictions?",
              answer:
                "Model accuracy depends on image quality, lighting, and crop conditions. CropIQ continuously improves models with data-driven updates.",
            },
          ]}
        />
      </SectionShell>
    </div>
  );
}