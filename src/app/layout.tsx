import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";

import { SITE_CONFIG } from "@/constants/site";
import { AppProviders } from "@/providers/app-providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingLinkedInButton } from "@/components/shared/floating_linkedin_button";
import { AmbientBackground } from "@/components/effects/ambient-background";
import { VisitorTracker } from "@/components/visitor-tracker";
import { VisitorCounter } from "@/components/visitor-counter";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,

  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: SITE_CONFIG.title,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
  },

  icons: {
    icon: "/cropiq-logo.png",
    shortcut: "/cropiq-logo.png",
    apple: "/cropiq-logo.png",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${figtree.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans">
        <AmbientBackground />

        <div className="relative z-10 flex flex-1 flex-col">
          <AppProviders>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <VisitorTracker />
          </AppProviders>
        </div>

        <VisitorCounter />
        <FloatingLinkedInButton />

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}