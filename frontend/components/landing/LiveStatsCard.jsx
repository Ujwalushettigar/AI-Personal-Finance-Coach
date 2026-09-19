"use client";

import React from "react";
import GlassCard from "../common/GlassCard";

export default function LiveStatsCard({
  icon,
  iconBg = "bg-accent/10 text-accent",
  label,
  value,
  trend,
  className = "",
}) {
  return (
    <GlassCard className={`p-3 sm:p-3.5 flex items-center gap-3 ${className}`}>
      {icon && (
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${iconBg}`}>
          {icon}
        </div>
      )}
      <div>
        {label && (
          <div className="text-[11px] font-medium text-text-muted leading-tight">
            {label}
          </div>
        )}
        <div className="text-sm font-bold text-text-primary flex items-center gap-2 mt-0.5">
          <span>{value}</span>
          {trend && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
              {trend}
            </span>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

