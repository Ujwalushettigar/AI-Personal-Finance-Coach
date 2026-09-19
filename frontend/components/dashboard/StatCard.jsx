"use client";

import React, { useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({ label, value, trend }) {
  const [timeframe, setTimeframe] = useState("Month");

  const isPositive = trend !== undefined && trend !== null && trend >= 0;
  const formattedValue =
    typeof value === "number"
      ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value)
      : value;

  return (
    <div className="bg-slate-950/70 rounded-2xl p-6 shadow-xl border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-300 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
          {label}
        </span>
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-[11px] font-semibold text-slate-400">
          {["Week", "Month", "Year"].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-0.5 rounded-lg transition-all ${
                timeframe === tf
                  ? "bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold shadow-sm"
                  : "hover:text-white"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <div className="text-3xl font-extrabold text-white tracking-tight">
          {formattedValue || "$0.00"}
        </div>

        {trend !== undefined && trend !== null && (
          <div
            className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border ${
              isPositive
                ? "bg-accent/20 text-accent border-accent/40"
                : "bg-rose-500/20 text-rose-300 border-rose-500/40"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-accent" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>

      <div className="text-[12px] text-slate-400 font-medium flex items-center justify-between pt-2 border-t border-white/5">
        <span>Compared to last {timeframe.toLowerCase()}</span>
        <span className="font-semibold text-accent">Updated live</span>
      </div>
    </div>
  );
}
