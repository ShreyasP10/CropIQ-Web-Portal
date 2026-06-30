"use client";

import { useEffect, useRef } from "react";

interface GlassShape {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
  sides: number;
}

const COLORS = [
  "rgba(56, 189, 248,",  // blue
  "rgba(6, 182, 212,",   // cyan
  "rgba(34, 197, 94,",   // green
  "rgba(251, 191, 36,",  // amber
  "rgba(168, 85, 247,",  // purple
];

function drawPolygon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  sides: number,
  rotation: number,
) {
  ctx.beginPath();
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides + rotation;
    const px = x + radius * Math.cos(angle);
    const py = y + radius * Math.sin(angle);
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
}

export function StainedGlass() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let shapes: GlassShape[] = [];
    let animationId: number;

    const init = (w: number, h: number) => {
      shapes = Array.from({ length: 8 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 40 + 25,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: Math.random() * 0.08 + 0.03,
        sides: Math.random() > 0.5 ? 6 : 4,
      }));
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (shapes.length === 0) init(canvas.width, canvas.height);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const s of shapes) {
        s.x += s.speedX;
        s.y += s.speedY;
        s.rotation += s.rotationSpeed;

        if (s.x < -100) s.x = canvas.width + 100;
        if (s.x > canvas.width + 100) s.x = -100;
        if (s.y < -100) s.y = canvas.height + 100;
        if (s.y > canvas.height + 100) s.y = -100;

        ctx.save();

        // Glass glow
        ctx.shadowColor = s.color.replace(")", ", 0.15)");
        ctx.shadowBlur = 30;

        drawPolygon(ctx, s.x, s.y, s.size, s.sides, s.rotation);

        // Fill with blur for glass effect
        ctx.fillStyle = `${s.color} ${s.opacity})`;
        ctx.fill();

        // Subtle border
        ctx.strokeStyle = `${s.color} ${s.opacity * 2})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner glow
        ctx.shadowBlur = 0;
        drawPolygon(ctx, s.x, s.y, s.size * 0.4, s.sides, s.rotation);
        ctx.fillStyle = `${s.color} ${s.opacity * 0.5})`;
        ctx.fill();

        ctx.restore();
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
