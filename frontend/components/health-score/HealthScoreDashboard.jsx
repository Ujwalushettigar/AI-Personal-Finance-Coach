'use client';

import React from 'react';
import { Card, Tile, BadgePill, IconTile } from '../budget-goals/ThemeCard';

/**
 * Financial Health Score Highlight Panel (CryptoVault Fintech Theme)
 * - Signature "Highlight Panel" pattern from reference design:
 *   - Glowing circular gradient orb in center with score in gradient text and green health shield
 *   - Faint decorative outlined circles at the corners
 *   - Grid of nested --bg-tile (#0B1029) tiles with points in neon green (#39FF14)
 *   - Actionable tips as structured list rows with icon tiles
 * - 100% data-driven, fully responsive, and accessible
 */
export default function HealthScoreDashboard({
  healthData,
  loading = false,
  error = null,
  onRetry
}) {
  // Error State Handler
  if (error) {
    return (
      <Card className="p-8 text-center max-w-xl mx-auto border-[#FF4D6A]/30">
        <div className="w-12 h-12 rounded-[12px] bg-[#FF4D6A]/[0.12] border border-[#FF4D6A]/30 text-[#FF4D6A] flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-1.5">
          Telemetry Feed Disconnected
        </h3>
        <p className="text-xs sm:text-sm text-[#8A93B5] mb-6">
          Unable to calculate your health score from backend services. Please try again.
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-5 py-2.5 rounded-[12px] bg-[#39FF14] text-[#0A0E27] font-semibold text-xs transition-all hover:shadow-[0_0_20px_rgba(57,255,20,0.35)] active:scale-95"
          >
            Reconnect Telemetry
          </button>
        )}
      </Card>
    );
  }

  if (!healthData) return null;

  const {
    score = 0,
    grade = 'N/A',
    breakdown = {},
    strengths = [],
    warnings = [],
    recommendations = []
  } = healthData;

  const savingsPoints = breakdown.savings !== undefined ? Number(breakdown.savings) : 0;
  const budgetPoints = breakdown.budget !== undefined ? Number(breakdown.budget) : 0;
  const spendingPoints = breakdown.spending !== undefined ? Number(breakdown.spending) : 0;
  const goalPoints = breakdown.goals !== undefined ? Number(breakdown.goals) : 0;

  // Factor performance percentage
  const savingsPercent = Math.min(100, Math.round((savingsPoints / 30) * 100));
  const budgetPercent = Math.min(100, Math.round((budgetPoints / 30) * 100));
  const spendingPercent = Math.min(100, Math.round((spendingPoints / 20) * 100));
  const goalPercent = Math.min(100, Math.round((goalPoints / 20) * 100));

  // Circular radial gauge math (radius 56, circumference ~351.8)
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * Math.min(100, Math.max(0, score))) / 100;

  const gradeStyles = {
    Excellent: 'bg-[#22D36A]/[0.12] text-[#22D36A] border-[#22D36A]/30',
    Good: 'bg-[#1FB5A5]/[0.12] text-[#1FB5A5] border-[#1FB5A5]/30',
    Fair: 'bg-[#F5A524]/[0.12] text-[#F5A524] border-[#F5A524]/30',
    'Needs Attention': 'bg-[#FF4D6A]/[0.12] text-[#FF4D6A] border-[#FF4D6A]/30'
  };
  const currentGradeBadge = gradeStyles[grade] || gradeStyles['Fair'];

  const gradeMessages = {
    Excellent: 'Your capital reserves and budget adherence operate at peak efficiency.',
    Good: 'Healthy financial posture with strong budget compliance and steady accumulation.',
    Fair: 'Financial reserves are stable, but category overages require attention.',
    'Needs Attention': 'Spending velocity is high. Execute recommended actions below.'
  };
  const summaryMessage = gradeMessages[grade] || 'Review your factor allocations below to optimize your score.';

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* ============================================================= */}
      {/* 1. SIGNATURE HIGHLIGHT PANEL (Center Glowing Orb Pattern)     */}
      {/* ============================================================= */}
      <Card hover={false} className="p-8 sm:p-10 relative overflow-hidden">

        {/* Faint decorative outlined circles at corners (from reference design) */}
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full border border-white/[0.04] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-[#0A84FF]/[0.05] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">

          {/* Left: Heading, Badge, Description */}
          <div className="space-y-4 flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2">
              <BadgePill
                icon="🛡️"
                text="Composite Health Telemetry"
              />
              <span className={`px-3 py-0.5 text-xs font-semibold rounded-full border ${currentGradeBadge}`}>
                {grade.toUpperCase()}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-white tracking-tight leading-[1.15]">
              Your Assets Are{' '}
              <span className="bg-gradient-to-r from-[#0A84FF] via-[#22D36A] to-[#39FF14] bg-clip-text text-transparent">
                Optimized 24/7
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#8A93B5] max-w-xl leading-relaxed">
              "{summaryMessage}"
            </p>

            <div className="flex items-center justify-center lg:justify-start gap-3 pt-2 text-xs text-[#8A93B5]">
              <span className="text-white font-bold text-xl">
                {score}
              </span>
              <span>/ 100 points maximum composite health index</span>
            </div>
          </div>

          {/* Right: Glowing Circular Radial Orb Gauge */}
          <div className="relative flex items-center justify-center flex-shrink-0 w-48 h-48 sm:w-52 sm:h-52">

            {/* Glowing Orb Backdrop with soft green-blue glow */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-[#0A84FF]/20 via-[#1FB5A5]/15 to-[#22D36A]/25 blur-xl pointer-events-none" />

            <svg className="w-48 h-48 sm:w-52 sm:h-52 transform -rotate-90">
              <defs>
                <linearGradient id="healthScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0A84FF" />
                  <stop offset="50%" stopColor="#22D36A" />
                  <stop offset="100%" stopColor="#39FF14" />
                </linearGradient>
              </defs>

              {/* Background Track */}
              <circle
                cx="104"
                cy="104"
                r={radius}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="10"
                fill="transparent"
              />

              {/* Animated Gradient Radial Ring */}
              <circle
                cx="104"
                cy="104"
                r={radius}
                stroke="url(#healthScoreGradient)"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Centered Score Badge with Green Shield Icon */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 rounded-full bg-[#39FF14]/[0.15] border border-[#39FF14]/30 flex items-center justify-center text-[#39FF14] mb-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                {score}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#1FB5A5] tracking-wider mt-0.5">
                Health Index
              </span>
            </div>
          </div>

        </div>
      </Card>

      {/* ============================================================= */}
      {/* 2. 4-FACTOR BREAKDOWN GRID (Nested #0B1029 Tile Pattern)      */}
      {/* ============================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Factor 1: Savings Rate */}
        <Tile className="p-6 flex flex-col justify-between hover:border-[#0A84FF]/30 transition-all duration-200">
          <div>
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="font-semibold text-white">Savings Rate</span>
              <span className="text-[11px] text-[#8A93B5]">30% weight</span>
            </div>
            <div className="flex items-baseline justify-between mb-3">
              {/* Neon Green highlight for factor score */}
              <span className="text-3xl font-bold text-[#39FF14]">
                {savingsPoints}
              </span>
              <span className="text-xs text-[#8A93B5]">/ 30 pts</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-[#1FB5A5] to-[#22D36A] rounded-full transition-all duration-700"
                style={{ width: `${savingsPercent}%` }}
              />
            </div>
            <div className="text-xs text-[#8A93B5] text-right">
              {savingsPercent}% efficiency
            </div>
          </div>
        </Tile>

        {/* Factor 2: Budget Adherence */}
        <Tile className="p-6 flex flex-col justify-between hover:border-[#0A84FF]/30 transition-all duration-200">
          <div>
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="font-semibold text-white">Budget Adherence</span>
              <span className="text-[11px] text-[#8A93B5]">30% weight</span>
            </div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-3xl font-bold text-[#39FF14]">
                {budgetPoints}
              </span>
              <span className="text-xs text-[#8A93B5]">/ 30 pts</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-[#1FB5A5] to-[#22D36A] rounded-full transition-all duration-700"
                style={{ width: `${budgetPercent}%` }}
              />
            </div>
            <div className="text-xs text-[#8A93B5] text-right">
              {budgetPercent}% efficiency
            </div>
          </div>
        </Tile>

        {/* Factor 3: Spending Consistency */}
        <Tile className="p-6 flex flex-col justify-between hover:border-[#0A84FF]/30 transition-all duration-200">
          <div>
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="font-semibold text-white">Spending Consistency</span>
              <span className="text-[11px] text-[#8A93B5]">20% weight</span>
            </div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-3xl font-bold text-[#39FF14]">
                {spendingPoints}
              </span>
              <span className="text-xs text-[#8A93B5]">/ 20 pts</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-[#1FB5A5] to-[#22D36A] rounded-full transition-all duration-700"
                style={{ width: `${spendingPercent}%` }}
              />
            </div>
            <div className="text-xs text-[#8A93B5] text-right">
              {spendingPercent}% efficiency
            </div>
          </div>
        </Tile>

        {/* Factor 4: Goal Progress */}
        <Tile className="p-6 flex flex-col justify-between hover:border-[#0A84FF]/30 transition-all duration-200">
          <div>
            <div className="flex items-center justify-between text-xs mb-2.5">
              <span className="font-semibold text-white">Goal Progress</span>
              <span className="text-[11px] text-[#8A93B5]">20% weight</span>
            </div>
            <div className="flex items-baseline justify-between mb-3">
              <span className="text-3xl font-bold text-[#39FF14]">
                {goalPoints}
              </span>
              <span className="text-xs text-[#8A93B5]">/ 20 pts</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-[#1FB5A5] to-[#22D36A] rounded-full transition-all duration-700"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
            <div className="text-xs text-[#8A93B5] text-right">
              {goalPercent}% efficiency
            </div>
          </div>
        </Tile>

      </div>

      {/* ============================================================= */}
      {/* 3. DETAILED ACTIONABLE TELEMETRY (Strengths, Warnings, Tips)   */}
      {/* ============================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* STRENGTHS */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <IconTile className="w-10 h-10 rounded-[10px]">
                <svg className="w-5 h-5 text-[#22D36A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </IconTile>
              <div>
                <h3 className="font-bold text-base text-white">
                  Strengths
                </h3>
                <p className="text-xs text-[#8A93B5]">
                  Positive capital behaviors
                </p>
              </div>
            </div>

            {strengths && strengths.length > 0 ? (
              <ul className="space-y-3">
                {strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-white/90 flex items-start gap-2.5 leading-relaxed">
                    <span className="text-[#22D36A] mt-0.5 font-bold">✓</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#8A93B5] italic">
                Meeting category caps this cycle will activate strengths.
              </p>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-white/[0.06] text-[11px] text-[#8A93B5]">
            Verified against benchmark reserves
          </div>
        </Card>

        {/* WARNINGS */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-[10px] bg-[#F5A524]/[0.12] border border-[#F5A524]/30 text-[#F5A524] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-base text-white">
                  Risk Warnings
                </h3>
                <p className="text-xs text-[#8A93B5]">
                  Threshold pressure alerts
                </p>
              </div>
            </div>

            {warnings && warnings.length > 0 ? (
              <ul className="space-y-3">
                {warnings.map((warn, idx) => (
                  <li key={idx} className="text-xs text-[#F5A524] flex items-start gap-2.5 leading-relaxed">
                    <span className="font-bold mt-0.5">•</span>
                    <span>{warn}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-[#22D36A] flex items-center gap-2">
                <span>🛡️</span>
                <span>Zero threshold warnings active. All allocations safe.</span>
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-white/[0.06] text-[11px] text-[#8A93B5]">
            Triggered at 70%+ budget utilization
          </div>
        </Card>

        {/* ACTIONABLE RECOMMENDATIONS */}
        <Card className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <IconTile className="w-10 h-10 rounded-[10px]">
                <svg className="w-5 h-5 text-[#0A84FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </IconTile>
              <div>
                <h3 className="font-bold text-base text-white">
                  Recommended Actions
                </h3>
                <p className="text-xs text-[#8A93B5]">
                  High-yield score optimization
                </p>
              </div>
            </div>

            {recommendations && recommendations.length > 0 ? (
              <ul className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="text-xs text-white/90 flex items-start gap-2.5 leading-relaxed">
                    <span className="font-mono text-[10px] font-bold text-[#0A84FF] px-1.5 py-0.5 rounded bg-[#0A84FF]/[0.12] border border-[#0A84FF]/30 mt-0.5 flex-shrink-0">
                      0{idx + 1}
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#8A93B5] italic">
                Your current routine is optimal. Maintain existing run rate.
              </p>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-white/[0.06] text-[11px] text-[#8A93B5]">
            Follow steps to maximize composite score
          </div>
        </Card>

      </div>

      {/* ============================================================= */}
      {/* 4. WHY THIS SCORE & DETERMINISTIC WEIGHTS FOOTER              */}
      {/* ============================================================= */}
      <Card hover={false} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-[#8A93B5]">
        <div className="max-w-xl">
          <strong className="text-white font-semibold">Mathematical Transparency:</strong> Calculated deterministically using your monthly savings rate (30%), budget ceiling compliance (30%), spending volatility (20%), and milestone goal progress (20%).
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-[#8A93B5] flex-shrink-0">
          <span>Savings 30%</span>
          <span>•</span>
          <span>Budget 30%</span>
          <span>•</span>
          <span>Consistency 20%</span>
          <span>•</span>
          <span>Goals 20%</span>
        </div>
      </Card>

    </div>
  );
}

