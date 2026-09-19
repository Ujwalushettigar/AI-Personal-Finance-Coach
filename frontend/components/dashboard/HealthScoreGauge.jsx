"use client";

import React from "react";
import { ShieldCheck, Info } from "lucide-react";

export default function HealthScoreGauge({ score }) {
  const getGrade = (val) => {
    if (val === null || val === undefined) return null;
    if (val >= 85) return { letter: "A", label: "Excellent Financial Health", color: "bg-accent/20 text-accent border-accent/40" };
    if (val >= 70) return { letter: "B", label: "Good Financial Stability", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" };
    if (val >= 55) return { letter: "C", label: "Moderate Financial Risk", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" };
    return { letter: "D", label: "Attention Needed", color: "bg-rose-500/20 text-rose-300 border-rose-500/40" };
  };

  const gradeInfo = getGrade(score);
  const normalizedScore = score !== null && score !== undefined ? Math.min(100, Math.max(0, score)) : 0;
  
  // Semicircle arc calculations (Radius 70, Circumference ~220)
  const maxDash = 220;
  const dashOffset = score !== null && score !== undefined ? maxDash - (maxDash * normalizedScore) / 100 : maxDash;

  return (
    <div className="bg-slate-950/70 rounded-2xl p-6 shadow-xl border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all duration-300 flex flex-col justify-between space-y-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-accent" />
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Health Score Gauge
          </h2>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1 font-medium">
          <Info className="w-3.5 h-3.5" />
          <span>Real-time analysis</span>
        </div>
      </div>

      {score === null || score === undefined ? (
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
          <div className="relative w-44 h-24 flex items-center justify-center">
            <svg viewBox="0 0 160 90" className="w-full h-full">
              <path
                d="M 10 80 A 70 70 0 0 1 150 80"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="4 4"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-slate-300">
            Health Score not yet available
          </p>
          <p className="text-xs text-slate-400 max-w-xs">
            Add transactions and budget goals to compute your initial score grade.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-2 space-y-3">
          <div className="relative w-48 h-28 flex items-center justify-center">
            <svg viewBox="0 0 160 90" className="w-full h-full overflow-visible">
              {/* Background Arc */}
              <path
                d="M 10 80 A 70 70 0 0 1 150 80"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Progress Arc */}
              <path
                d="M 10 80 A 70 70 0 0 1 150 80"
                fill="none"
                stroke="#D6FF3F"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={maxDash}
                strokeDashoffset={dashOffset}
                className="transition-all duration-1000 ease-out"
                style={{ filter: "drop-shadow(0px 0px 8px rgba(214, 255, 63, 0.5))" }}
              />
            </svg>
            <div className="absolute inset-x-0 bottom-0 text-center flex flex-col items-center">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {score}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase">out of 100</span>
            </div>
          </div>

          {gradeInfo && (
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xl font-black text-white bg-white/5 px-3 py-1 rounded-xl border border-white/10">
                Grade {gradeInfo.letter}
              </span>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${gradeInfo.color}`}>
                {gradeInfo.label}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
