"use client";

import React from "react";

export default function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`bg-[#0D1424]/70 border border-border rounded-xl backdrop-blur-md p-6 shadow-2xl transition-all ${className}`}
    >
      {children}
    </div>
  );
}
