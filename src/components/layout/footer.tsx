"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { FOOTER_LINKS, SITE_CONFIG } from "@/constants/site";
import { Logo } from "@/components/shared/logo";
import { useLatestVersion } from "@/hooks/use-latest-version";

// Simple inline GitHub icon SVG (24x24)
const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function Footer() {
  const liveVersion = useLatestVersion(); // Fetch real-time version from Realtime Database
  const displayVersion = liveVersion ?? SITE_CONFIG.version; // fallback to static version

  return (
    <footer className="relative border-t border-white/10 bg-background/70 backdrop-blur-xl">
      {/* Gradient top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-blue-500/50 via-cyan-500/50 to-green-500/50" />

      <div className="mx-auto w-full max-w-7xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              AI-powered crop disease and fruit detection for smarter, data-driven farming.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-foreground">Quick Links</h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.quick.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-cyan-500 dark:hover:text-cyan-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-foreground">Legal</h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-cyan-500 dark:hover:text-cyan-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Version */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-foreground">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.links.supportEmail}`}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="h-4 w-4" />
                  {SITE_CONFIG.links.supportEmail}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/ShreyasP10"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {/* GitHub avatar */}
                  <img
                    src="https://github.com/ShreyasP10.png"
                    alt="Shreyas Pawar GitHub"
                    className="h-5 w-5 rounded-full"
                    loading="lazy"
                  />
                  <GitHubIcon />
                  ShreyasP10
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground backdrop-blur-md">
                  App version{" "}
                  <span className="font-semibold text-foreground">v{displayVersion}</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
          <p className="text-xs">Built with Next.js · Firebase · TensorFlow Lite</p>
        </div>
      </div>
    </footer>
  );
}