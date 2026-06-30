"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { NAV_LINKS } from "@/constants/site";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { GradientButton } from "@/components/shared/gradient-button";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";

import { buttonVariants } from "@/components/ui/button"; // adjust path if needed

const linkVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.05 * i, duration: 0.2 },
  }),
};

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 border-b transition-all duration-300",
        scrolled
          ? "border-white/10 bg-background/85 shadow-lg backdrop-blur-2xl"
          : "border-transparent bg-background/60 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4">
        <Logo />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-1/2 h-[2px] w-4/5 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop right side */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
<Link href="/download" className={buttonVariants({ size: "sm" })}>
  Download APK
</Link>
        </div>

        {/* Mobile right side */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            {/* Directly styled trigger – no nested button */}
            <SheetTrigger className="inline-flex shrink-0 items-center justify-center rounded-lg border border-white/10 bg-transparent p-2 text-foreground hover:bg-muted/50 transition-colors">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </SheetTrigger>

            <SheetContent side="right" className="w-[min(80vw,320px)] border-l-white/10 bg-background/95 backdrop-blur-2xl">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <Logo showText={false} />
                {/* Close button – plain button to avoid nesting */}
                <button
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex shrink-0 items-center justify-center rounded-lg border border-white/10 bg-transparent p-2 text-foreground hover:bg-muted/50 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-6 flex flex-col gap-2">
                {NAV_LINKS.map((link, i) => {
                  const active = pathname === link.href;
                  return (
                    <motion.div
                      key={link.href}
                      custom={i}
                      initial="hidden"
                      animate="visible"
                      variants={linkVariants}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "block rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                          active
                            ? "bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-green-500/10 text-foreground"
                            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={linkVariants}
                  custom={NAV_LINKS.length}
                  className="mt-4"
                >
                  <GradientButton href="/download" className="w-full" onClick={() => setMobileOpen(false)}>
                    Download APK
                  </GradientButton>
                </motion.div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}