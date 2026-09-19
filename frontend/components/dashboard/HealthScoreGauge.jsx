"use client";

import React from "react";
import { ShieldCheck, Info } from "lucide-react";
import GlassCard from "../common/GlassCard";

/**
 * HealthScoreGauge (CryptoVault Fintech Theme)
 * - #0F1633 card surface with border-white/10
 * - #39FF14 vibrant neon arc with drop shadow glow
 * - Grade badges styled with semantic CryptoVault color system
 * - Clean SVG gauge arc with smooth transition
 */
export default function HealthScoreGauge({ score }) {
  const getGrade = (val) => {
    if (val === null || val === undefined) return null;
    if (val >= 85) return { letter: "A", label: "Excellent Financial Health", color: "bg-[#22D36A]/15 text-[#22D36A] border-[#22D36A]/30" };
    if (val >= 70) return { letter: "B", label: "Good Financial Stability", color: "bg-[#0A84FF]/15 text-[#0A84FF] border-[#0A84FF]/30" };
    if (val >= 55) return { letter: "C", label: "Moderate Financial Risk", color: "bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30" };
    return { letter: "D", label: "Attention Needed", color: "bg-[#FF4D6A]/15 text-[#FF4D6A] border-[#FF4D6A]/30" };
  };

  const gradeInfo = getGrade(score);
  const normalizedScore = score !== null && score !== undefined ? Math.min(100, Math.max(0, score)) : 0;

  // Semicircle arc calculations (Radius 70, Circumference ~220)
  const maxDash = 220;
  const dashOffset = score !== null && score !== undefined ? maxDash - (maxDash * normalizedScore) / 100 : maxDash;

  return (
    <div className="bg-[#0F1633] rounded-2xl p-6 shadow-xl border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-full space-y-4 text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#39FF14]" />
          <h2 className="text-xs font-bold text-[#8A93B5] uppercase tracking-wider">
            Health Score Gauge
          </h2>
        </div>
        <div className="text-xs text-[#8A93B5] flex items-center gap-1 font-medium">
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
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray="4 4"
              />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#8A93B5]">
            Health Score not yet available
          </p>
          <p className="text-xs text-[#8A93B5]/70 max-w-xs">
            Add transactions and budget goals to compute your initial score grade.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-2 space-y-4">
          <div className="relative w-48 h-28 flex items-center justify-center">
            <svg viewBox="0 0 160 90" className="w-full h-full overflow-visible">
              {/* Background Arc */}
              <path
                d="M 10 80 A 70 70 0 0 1 150 80"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="14"
                strokeLinecap="round"
              />
              {/* Progress Arc */}
              <path
                d="M 10 80 A 70 70 0 0 1 150 80"
                fill="none"
                stroke="#39FF14"
                strokeWidth="14"
                strokeLinecap="round"
                strokeDasharray={maxDash}
                strokeDashoffset={dashOffset}
                className="transition-all duration-1000 ease-out"
                style={{ filter: "drop-shadow(0px 0px 10px rgba(57, 255, 20, 0.5))" }}
              />
            </svg>
            <div className="absolute inset-x-0 bottom-0 text-center flex flex-col items-center">
              <span className="text-4xl font-extrabold text-white tracking-tight">
                {score}
              </span>
              <span className="text-[11px] font-semibold text-[#8A93B5] uppercase">out of 100</span>
            </div>
          </div>

          {gradeInfo && (
            <div className="flex items-center gap-2.5 pt-1">
              <span className="text-sm font-bold text-white bg-[#0B1029] px-3 py-1 rounded-xl border border-white/10">
                Grade {gradeInfo.letter}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${gradeInfo.color}`}>
                {gradeInfo.label}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

