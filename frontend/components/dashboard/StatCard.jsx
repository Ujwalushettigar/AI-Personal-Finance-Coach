"use client";

import React, { useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import GlassCard from "../common/GlassCard";

/**
 * StatCard (CryptoVault Fintech Theme)
 * - #0F1633 card surface with border-white/10
 * - #8A93B5 uppercase label in Space Grotesk
 * - Pure white value text with bold tracking
 * - #0A84FF active pill selector for timeframes
 * - Semantic green (#22D36A) & red (#FF4D6A) trend badges
 */
export default function StatCard({ label, value, trend }) {
  const [timeframe, setTimeframe] = useState("Month");

  const isPositive = trend !== undefined && trend !== null && trend >= 0;
  const formattedValue =
    typeof value === "number"
      ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
      : value;

  return (
    <div className="bg-[#0F1633] rounded-2xl p-6 shadow-xl border border-white/10 hover:border-white/20 transition-all duration-300 space-y-4 font-['DM_Sans',sans-serif]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider text-[#8A93B5] uppercase font-['Space_Grotesk',sans-serif]">
          {label}
        </span>
        <div className="flex items-center gap-1 bg-[#0B1029] p-1 rounded-xl border border-white/10 text-[11px] font-semibold text-[#8A93B5]">
          {["Week", "Month", "Year"].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-0.5 rounded-lg transition-all ${timeframe === tf
                  ? "bg-[#0A84FF] text-white font-bold shadow-[0_0_12px_rgba(10,132,255,0.4)]"
                  : "hover:text-white"
                }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-['Space_Grotesk',sans-serif]">
          {formattedValue || "$0.00"}
        </div>

        {trend !== undefined && trend !== null && (
          <div
            className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${isPositive
                ? "bg-[#22D36A]/15 text-[#22D36A] border-[#22D36A]/30"
                : "bg-[#FF4D6A]/15 text-[#FF4D6A] border-[#FF4D6A]/30"
              }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-[#22D36A]" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 text-[#FF4D6A]" />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <div className="text-[12px] text-[#8A93B5] font-medium flex items-center justify-between pt-3 border-t border-white/5">
        <span>Compared to last {timeframe.toLowerCase()}</span>
        <span className="font-semibold text-[#39FF14] flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-pulse"></span>
          Live
        </span>
      </div>
    </div>
  );
}

