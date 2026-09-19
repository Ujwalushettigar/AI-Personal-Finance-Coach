"use client";

import React, { useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import GlassCard from "../common/GlassCard";

export default function StatCard({ label, value, trend }) {
  const [timeframe, setTimeframe] = useState("Month");

  const isPositive = trend !== undefined && trend !== null && trend >= 0;
  const formattedValue =
    typeof value === "number"
      ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
      : value;

  return (
    <GlassCard className="hover:border-accent/30 transition-all duration-300 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider text-text-muted uppercase">
          {label}
        </span>
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-border text-[11px] font-semibold text-text-muted">
          {["Week", "Month", "Year"].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-0.5 rounded-lg transition-all ${
                timeframe === tf
                  ? "bg-accent text-[#0A0E1A] font-bold shadow-sm"
                  : "hover:text-text-primary"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <div className="text-3xl font-extrabold text-text-primary tracking-tight">
          {formattedValue || "$0.00"}
        </div>

        {trend !== undefined && trend !== null && (
          <div
            className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
              isPositive
                ? "bg-positive/10 text-positive border-positive/30"
                : "bg-negative/10 text-negative border-negative/30"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-positive" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 text-negative" />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <div className="text-[12px] text-text-muted font-medium flex items-center justify-between pt-2 border-t border-border">
        <span>Compared to last {timeframe.toLowerCase()}</span>
        <span className="font-semibold text-accent">Updated live</span>
      </div>
    </GlassCard>
  );
}
