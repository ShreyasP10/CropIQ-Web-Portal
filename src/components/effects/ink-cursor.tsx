"use client";

import { useEffect, useRef } from "react";

export function InkCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const lastMove = useRef<number>(0);
  const pingInterval = useRef<ReturnType<typeof setInterval>>(undefined);
  const mouse = useRef<{ x: number; y: number }>({ x: -200, y: -200 });

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      lastMove.current = Date.now();

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 2}px, ${e.clientY - 2}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
        ringRef.current.style.opacity = "1";
        ringRef.current.style.transform += " scale(1)";
      }
    };

    const handleClick = (e: MouseEvent) => {
      const burst = document.createElement("div");
      burst.className = "pointer-events-none fixed rounded-full z-[9999]";
      burst.style.cssText = `
        left: ${e.clientX - 20}px; top: ${e.clientY - 20}px;
        width: 40px; height: 40px;
        border: 1px solid rgba(6, 182, 212, 0.6);
        box-shadow: 0 0 12px rgba(6, 182, 212, 0.3);
        animation: cursor-ping 0.6s ease-out forwards;
        pointer-events: none;
      `;
      document.body.appendChild(burst);
      setTimeout(() => burst.remove(), 700);

      for (let i = 0; i < 4; i++) {
        const p = document.createElement("div");
        const angle = (i / 4) * Math.PI * 2;
        p.style.cssText = `
          left: ${e.clientX - 1.5}px; top: ${e.clientY - 1.5}px;
          width: 3px; height: 3px;
          position: fixed;
          border-radius: 9999px;
          background: rgba(6, 182, 212, 0.7);
          z-index: 9999;
          pointer-events: none;
          animation: cursor-particle-${i} 0.5s ease-out forwards;
          --tx: ${Math.cos(angle) * 30}; --ty: ${Math.sin(angle) * 30};
        `;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 550);
      }
    };

    const spawnPing = () => {
      const now = Date.now();
      if (now - lastMove.current > 3000) return;
      const { x, y } = mouse.current;
      if (x < 0 || y < 0) return;

      const ping = document.createElement("div");
      ping.style.cssText = `
        left: ${x - 24}px; top: ${y - 24}px;
        width: 48px; height: 48px;
        position: fixed;
        border-radius: 9999px;
        border: 1px solid rgba(34, 197, 94, 0.25);
        z-index: 9998;
        pointer-events: none;
        animation: cursor-ping 1.8s ease-out forwards;
      `;
      document.body.appendChild(ping);
      setTimeout(() => ping.remove(), 2000);
    };

    document.body.style.cursor = "none";
    document.documentElement.style.cursor = "none";

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("click", handleClick);

    pingInterval.current = setInterval(spawnPing, 1600);

    return () => {
      document.body.style.cursor = "";
      document.documentElement.style.cursor = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      clearInterval(pingInterval.current);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed z-[9999] h-1 w-1 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]"
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed z-[9999] h-8 w-8 rounded-full border border-cyan-400/30 shadow-[0_0_10px_rgba(6,182,212,0.15)] transition-[opacity,transform] duration-500 ease-out"
        style={{ opacity: 0 }}
        aria-hidden="true"
      />

      <style>{`
        @keyframes cursor-ping {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(3); }
        }
        @keyframes cursor-particle-0 { 0% { opacity: 1; transform: translate(0, 0); } 100% { opacity: 0; transform: translate(30px, 0); } }
        @keyframes cursor-particle-1 { 0% { opacity: 1; transform: translate(0, 0); } 100% { opacity: 0; transform: translate(0, 30px); } }
        @keyframes cursor-particle-2 { 0% { opacity: 1; transform: translate(0, 0); } 100% { opacity: 0; transform: translate(-30px, 0); } }
        @keyframes cursor-particle-3 { 0% { opacity: 1; transform: translate(0, 0); } 100% { opacity: 0; transform: translate(0, -30px); } }
      `}</style>
    </>
  );
}
