"use client";

import React from "react";

export default function GlassCard({ children, className = "" }) {
  return (
    <div
      className={`bg-surface border border-border rounded-xl backdrop-blur-sm p-6 shadow-lg transition-all ${className}`}
    >
      {children}
    </div>
  );
}
