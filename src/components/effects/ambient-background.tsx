"use client";

import { useEffect, useRef } from "react";

export function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let animId: number;
    let resizeTimer: ReturnType<typeof setTimeout>;

    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const stars = Array.from({ length: 25 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 1.2 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.5 + 0.2,
      baseAlpha: Math.random() * 0.4 + 0.15,
    }));

    const orbs = [
      { x: w * 0.3, y: h * 0.3, r: 160, sx: 0.12, sy: 0.08, phase: 0 },
      { x: w * 0.7, y: h * 0.6, r: 140, sx: -0.08, sy: -0.1, phase: 2 },
    ];

    const grad1 = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    grad1.addColorStop(0, "rgba(56,189,248,0.04)");
    grad1.addColorStop(0.5, "rgba(56,189,248,0.02)");
    grad1.addColorStop(1, "rgba(56,189,248,0)");

    const grad2 = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    grad2.addColorStop(0, "rgba(34,197,94,0.035)");
    grad2.addColorStop(0.5, "rgba(34,197,94,0.015)");
    grad2.addColorStop(1, "rgba(34,197,94,0)");

    const grads = [grad1, grad2];

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const t = Date.now() * 0.0005;

      for (let i = 0; i < 25; i++) {
        const s = stars[i];
        const alpha = s.baseAlpha + Math.sin(t * s.speed + s.phase) * 0.12;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, alpha)})`;
        ctx.fill();
      }

      for (let i = 0; i < 2; i++) {
        const o = orbs[i];
        const cx = o.x + Math.sin(t + o.phase) * 25;
        const cy = o.y + Math.cos(t * 0.7 + o.phase) * 20;
        const r = o.r * (1 + Math.sin(t * 0.3 + o.phase) * 0.08);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(r, r);
        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, Math.PI * 2);
        ctx.fillStyle = grads[i];
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(animId);
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        ctx.scale(dpr, dpr);
        draw();
      }, 200);
    };

    animId = requestAnimationFrame(draw);
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
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
