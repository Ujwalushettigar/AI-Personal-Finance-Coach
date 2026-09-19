'use client';

import React from 'react';

/**
 * Financial Health Score Dashboard Component
 * Designed in strict accordance with the reference dark fintech aesthetic:
 * - Near-black background & elevated #12131b surfaces
 * - Circular electric-blue radial progress ring
 * - 4 Factor Cards (Savings, Budget, Spending, Goals) with progress indicators
 * - Explanatory section ("Why your score looks this way")
 * - Strengths, Warnings, and Actionable Recommendations
 * - Factor weights breakdown
 * - Responsive, accessible, and 100% backend-data driven
 */
export default function HealthScoreDashboard({ 
  healthData, 
  loading = false, 
  error = null, 
  onRetry 
}) {
  // 12. Error State
  if (error) {
    return (
      <div className="p-6 sm:p-8 rounded-3xl bg-[#12131b] border border-rose-500/20 text-center max-w-xl mx-auto shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white mb-1">Unable to load your financial health score</h3>
        <p className="text-xs text-slate-400 mb-6">
          There was an issue retrieving your health evaluation from the backend service.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(37,99,235,0.4)] transition active:scale-95"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  // 13. Empty / Missing Data Handling
  if (!healthData) return null;

  const {
    score = 0,
    grade = 'N/A',
    breakdown = {},
    strengths = [],
    warnings = [],
    recommendations = []
  } = healthData;

  // Factor breakdown points and maximums
  const savingsPoints = breakdown.savings !== undefined ? Number(breakdown.savings) : 0;
  const budgetPoints = breakdown.budget !== undefined ? Number(breakdown.budget) : 0;
  const spendingPoints = breakdown.spending !== undefined ? Number(breakdown.spending) : 0;
  const goalPoints = breakdown.goals !== undefined ? Number(breakdown.goals) : 0;

  // Factor percentage calculations (for bar visualization)
  const savingsPercent = Math.min(100, Math.round((savingsPoints / 30) * 100));
  const budgetPercent = Math.min(100, Math.round((budgetPoints / 30) * 100));
  const spendingPercent = Math.min(100, Math.round((spendingPoints / 20) * 100));
  const goalPercent = Math.min(100, Math.round((goalPoints / 20) * 100));

  // Circular radial gauge math (radius 48, circumference ~301.6)
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * Math.min(100, Math.max(0, score))) / 100;

  // Grade badge styling
  const gradeStyles = {
    'Excellent': 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.3)]',
    'Good': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    'Fair': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    'Needs Attention': 'bg-rose-500/10 text-rose-400 border-rose-500/30'
  };
  const currentGradeBadge = gradeStyles[grade] || gradeStyles['Fair'];

  // Summary message based on grade
  const gradeMessages = {
    'Excellent': "Your financial health is outstanding with high savings and disciplined spending.",
    'Good': "You're building healthy financial habits and maintaining strong budget control.",
    'Fair': "Your finances are stable, but some budget and savings areas need attention.",
    'Needs Attention': "High spending pressure detected. Follow the action plan below to regain control."
  };
  const summaryMessage = gradeMessages[grade] || "Review your financial factors below to optimize your score.";

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. OVERALL SCORE HERO CARD (Inspired by Reference Screenshot) */}
      {/* ------------------------------------------------------------- */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#12131b] border border-white/[0.07] shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/[0.04] rounded-full blur-3xl pointer-events-none" />

        {/* Left: Heading, Summary & Grade */}
        <div className="space-y-3 flex-1 text-center md:text-left z-10">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Financial Health
            </h2>
            <span className={`px-3 py-0.5 text-xs font-semibold rounded-full border ${currentGradeBadge}`}>
              {grade.toUpperCase()}
            </span>
          </div>

          <p className="text-sm text-slate-400 max-w-xl leading-relaxed">
            "{summaryMessage}"
          </p>

          <div className="flex items-center justify-center md:justify-start gap-2 pt-2 text-xs text-slate-400">
            <span className="text-white font-bold text-lg">{score}</span>
            <span className="text-slate-500">/ 100 points composite health index</span>
          </div>
        </div>

        {/* Right: Electric Blue Circular Radial Gauge */}
        <div className="relative flex items-center justify-center flex-shrink-0 w-36 h-36 z-10">
          <svg className="w-36 h-36 transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="currentColor"
              strokeWidth="9"
              className="text-white/[0.06]"
              fill="transparent"
            />
            {/* Animated Electric Blue Ring */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="#3b82f6"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out shadow-[0_0_16px_rgba(59,130,246,0.6)]"
            />
          </svg>
          
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-white tracking-tight">{score}</span>
            <span className="text-[10px] uppercase font-semibold text-blue-400 tracking-wider">Health Index</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. SCORE FACTORS GRID (4 Compact Fintech Cards)               */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Factor 1: Savings Rate */}
        <div className="p-5 rounded-2xl bg-[#12131b] border border-white/[0.07] hover:border-blue-500/30 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-white">Savings Rate</span>
              <span className="text-[11px] text-slate-400 font-medium">30% weight</span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-bold text-white">{savingsPoints}</span>
              <span className="text-xs text-slate-500">/ 30 pts</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-700"
                style={{ width: `${savingsPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 text-right">{savingsPercent}% performance</div>
          </div>
        </div>

        {/* Factor 2: Budget Adherence */}
        <div className="p-5 rounded-2xl bg-[#12131b] border border-white/[0.07] hover:border-blue-500/30 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-white">Budget Adherence</span>
              <span className="text-[11px] text-slate-400 font-medium">30% weight</span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-bold text-white">{budgetPoints}</span>
              <span className="text-xs text-slate-500">/ 30 pts</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-700"
                style={{ width: `${budgetPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 text-right">{budgetPercent}% performance</div>
          </div>
        </div>

        {/* Factor 3: Spending Consistency */}
        <div className="p-5 rounded-2xl bg-[#12131b] border border-white/[0.07] hover:border-blue-500/30 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-white">Spending Consistency</span>
              <span className="text-[11px] text-slate-400 font-medium">20% weight</span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-bold text-white">{spendingPoints}</span>
              <span className="text-xs text-slate-500">/ 20 pts</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-700"
                style={{ width: `${spendingPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 text-right">{spendingPercent}% performance</div>
          </div>
        </div>

        {/* Factor 4: Goal Progress */}
        <div className="p-5 rounded-2xl bg-[#12131b] border border-white/[0.07] hover:border-blue-500/30 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-white">Goal Progress</span>
              <span className="text-[11px] text-slate-400 font-medium">20% weight</span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-bold text-white">{goalPoints}</span>
              <span className="text-xs text-slate-500">/ 20 pts</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-white/[0.06] h-1.5 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-700"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 text-right">{goalPercent}% performance</div>
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3, 4, 5, 6: DETAILED ANALYSIS (3 Column Grid)                 */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* 4. STRENGTHS */}
        <div className="p-5 rounded-2xl bg-[#12131b] border border-white/[0.07] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center text-xs">
                ✓
              </div>
              <h3 className="font-semibold text-sm text-white">Strengths</h3>
            </div>

            {strengths && strengths.length > 0 ? (
              <ul className="space-y-2.5">
                {strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">
                No dominant strengths identified yet. Meeting budget caps will build strengths.
              </p>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-white/[0.05] text-[11px] text-slate-500">
            Based on regular spending & savings consistency
          </div>
        </div>

        {/* 5. WARNINGS */}
        <div className="p-5 rounded-2xl bg-[#12131b] border border-white/[0.07] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
                !
              </div>
              <h3 className="font-semibold text-sm text-white">Warnings</h3>
            </div>

            {warnings && warnings.length > 0 ? (
              <ul className="space-y-2.5">
                {warnings.map((warn, idx) => (
                  <li key={idx} className="text-xs text-amber-200/90 flex items-start gap-2 leading-relaxed">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{warn}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> No critical warnings active. All limits safe.
              </p>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-white/[0.05] text-[11px] text-slate-500">
            Triggered when category exceeds 90% or savings drop
          </div>
        </div>

        {/* 6. ACTIONABLE RECOMMENDATIONS */}
        <div className="p-5 rounded-2xl bg-[#12131b] border border-white/[0.07] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">
                💡
              </div>
              <h3 className="font-semibold text-sm text-white">Recommended Actions</h3>
            </div>

            {recommendations && recommendations.length > 0 ? (
              <ul className="space-y-2.5">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed">
                    <span className="font-mono text-[10px] font-bold text-blue-400 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 mt-0.5 flex-shrink-0">
                      0{idx + 1}
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Your current habits are optimal. Continue your existing routine.
              </p>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-white/[0.05] text-[11px] text-slate-500">
            Actionable next steps to optimize your overall score
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3 & 7. WHY THIS SCORE & FACTOR WEIGHTS FOOTER                 */}
      {/* ------------------------------------------------------------- */}
      <div className="p-5 rounded-2xl bg-[#12131b] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-slate-400">
        <div>
          <span className="font-semibold text-white">Why your score looks this way:</span>{' '}
          Calculated deterministically based on your monthly savings rate (30%), budget limits adherence (30%), category spending volatility (20%), and savings goals completion (20%).
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500 flex-shrink-0">
          <span>Savings 30%</span>
          <span>•</span>
          <span>Budget 30%</span>
          <span>•</span>
          <span>Consistency 20%</span>
          <span>•</span>
          <span>Goals 20%</span>
        </div>
      </div>

    </div>
  );
}
