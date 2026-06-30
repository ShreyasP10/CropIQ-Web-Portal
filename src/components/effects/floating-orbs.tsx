"use client";

import { useEffect, useRef } from "react";

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

export function FloatingOrbs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let orbs: Orb[] = [];
    let animationId: number;

    const init = (w: number, h: number) => {
      orbs = [
        {
          x: w * 0.15,
          y: h * 0.2,
          radius: 180,
          speedX: 0.15,
          speedY: 0.1,
          gradient: "rgba(56, 189, 248,",
          opacity: 0.04,
          phase: 0,
        },
        {
          x: w * 0.85,
          y: h * 0.3,
          radius: 220,
          speedX: -0.1,
          speedY: 0.12,
          gradient: "rgba(6, 182, 212,",
          opacity: 0.035,
          phase: 1.5,
        },
        {
          x: w * 0.5,
          y: h * 0.7,
          radius: 200,
          speedX: 0.08,
          speedY: -0.1,
          gradient: "rgba(34, 197, 94,",
          opacity: 0.03,
          phase: 3,
        },
        {
          x: w * 0.3,
          y: h * 0.8,
          radius: 160,
          speedX: -0.12,
          speedY: -0.08,
          gradient: "rgba(251, 191, 36,",
          opacity: 0.03,
          phase: 4.5,
        },
        {
          x: w * 0.7,
          y: h * 0.15,
          radius: 150,
          speedX: 0.1,
          speedY: 0.15,
          gradient: "rgba(168, 85, 247,",
          opacity: 0.025,
          phase: 6,
        },
      ];
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (orbs.length === 0) init(canvas.width, canvas.height);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now() * 0.0005;

      for (const orb of orbs) {
        const driftX = Math.sin(time + orb.phase) * 30;
        const driftY = Math.cos(time * 0.7 + orb.phase) * 25;

        orb.x += orb.speedX;
        orb.y += orb.speedY;

        const pulse = 1 + Math.sin(time * 0.3 + orb.phase) * 0.1;

        const cx = orb.x + driftX;
        const cy = orb.y + driftY;
        const r = orb.radius * pulse;

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        gradient.addColorStop(0, `${orb.gradient} ${orb.opacity})`);
        gradient.addColorStop(0.5, `${orb.gradient} ${orb.opacity * 0.5})`);
        gradient.addColorStop(1, `${orb.gradient} 0)`);

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
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
