"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  speed: number;
}

interface Orb {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  gradient: string;
  opacity: number;
  phase: number;
}

const ORB_CONFIGS: Omit<Orb, "x" | "y">[] = [
  { radius: 180, speedX: 0.15, speedY: 0.1, gradient: "rgba(56,189,248,", opacity: 0.04, phase: 0 },
  { radius: 220, speedX: -0.1, speedY: 0.12, gradient: "rgba(6,182,212,", opacity: 0.035, phase: 1.5 },
  { radius: 200, speedX: 0.08, speedY: -0.1, gradient: "rgba(34,197,94,", opacity: 0.03, phase: 3 },
  { radius: 160, speedX: -0.12, speedY: -0.08, gradient: "rgba(251,191,36,", opacity: 0.03, phase: 4.5 },
  { radius: 150, speedX: 0.1, speedY: 0.15, gradient: "rgba(168,85,247,", opacity: 0.025, phase: 6 },
];

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let stars: Star[] = [];
    let orbs: Orb[] = [];
    let animationId: number;
    const gradientCache: Map<string, CanvasGradient> = new Map();

    const initStars = (w: number, h: number) => {
      const count = Math.min(Math.floor((w * h) / 12000), 80);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.5 + 0.2,
        baseAlpha: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.03 + 0.01,
      }));
    };

    const initOrbs = (w: number, h: number) => {
      const positions = [
        { x: w * 0.15, y: h * 0.2 },
        { x: w * 0.85, y: h * 0.3 },
        { x: w * 0.5, y: h * 0.7 },
        { x: w * 0.3, y: h * 0.8 },
        { x: w * 0.7, y: h * 0.15 },
      ];
      orbs = ORB_CONFIGS.map((cfg, i) => ({
        ...cfg,
        x: positions[i].x,
        y: positions[i].y,
      }));
    };

    const setup = (w: number, h: number) => {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
      initStars(w, h);
      initOrbs(w, h);
      gradientCache.clear();
    };

    const getGradient = (cx: number, cy: number, r: number, color: string, opacity: number) => {
      const key = `${Math.round(cx)},${Math.round(cy)},${Math.round(r)},${color},${opacity}`;
      let gradient = gradientCache.get(key);
      if (!gradient) {
        gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        gradient.addColorStop(0, `${color} ${opacity})`);
        gradient.addColorStop(0.5, `${color} ${opacity * 0.5})`);
        gradient.addColorStop(1, `${color} 0)`);
        gradientCache.set(key, gradient);
      }
      return gradient;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      const time = Date.now() * 0.0005;

      // Draw stars
      for (const star of stars) {
        star.alpha = star.baseAlpha + Math.sin(Date.now() * star.speed) * 0.15;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, star.alpha)})`;
        ctx.fill();
      }

      // Draw orbs with cached gradients
      for (const orb of orbs) {
        const driftX = Math.sin(time + orb.phase) * 30;
        const driftY = Math.cos(time * 0.7 + orb.phase) * 25;
        orb.x += orb.speedX;
        orb.y += orb.speedY;

        const pulse = 1 + Math.sin(time * 0.3 + orb.phase) * 0.1;
        const cx = orb.x + driftX;
        const cy = orb.y + driftY;
        const r = orb.radius * pulse;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = getGradient(cx, cy, r, orb.gradient, orb.opacity);
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    const resize = () => {
      gradientCache.clear();
      setup(window.innerWidth, window.innerHeight);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  );
}
