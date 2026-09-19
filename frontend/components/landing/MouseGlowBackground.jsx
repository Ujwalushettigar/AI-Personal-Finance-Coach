"use client";

import React, { useState, useEffect, useRef } from "react";

export default function MouseGlowBackground({ children }) {
  const [mousePos, setMousePos] = useState({ x: 500, y: 300 });
  const rafRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        setMousePos({ x: e.clientX, y: e.clientY });
        rafRef.current = null;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#070A14] text-[#F5F7FA] overflow-x-hidden font-sans">
      {/* Subtle Grid Background Pattern matching reference screenshot */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />

      {/* Dynamic Cursor Radial Glow Layer */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(57, 255, 136, 0.07), transparent 75%)`,
        }}
      />

      {/* Soft Ambient Background Orbs */}
      <div className="pointer-events-none fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[140px] z-0" />
      <div className="pointer-events-none fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent-2/5 rounded-full blur-[140px] z-0" />

      {/* Main Content Layer */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
