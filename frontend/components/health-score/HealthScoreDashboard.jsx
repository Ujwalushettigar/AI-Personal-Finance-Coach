'use client';

import React from 'react';
import GlassCard from '../common/GlassCard';

export default function HealthScoreDashboard({ 
  healthData, 
  loading = false, 
  error = null, 
  onRetry 
}) {
  if (error) {
    return (
      <GlassCard className="p-6 sm:p-8 text-center max-w-xl mx-auto border-negative/20">
        <div className="w-12 h-12 rounded-2xl bg-negative/10 border border-negative/20 text-negative flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-text-primary mb-1">Unable to load your financial health score</h3>
        <p className="text-xs text-text-muted mb-6">
          There was an issue retrieving your health evaluation from the backend service.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-5 py-2.5 rounded-xl bg-accent text-[#0A0E1A] text-xs font-bold shadow-md transition"
          >
            Try Again
          </button>
        )}
      </GlassCard>
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

  const savingsPercent = Math.min(100, Math.round((savingsPoints / 30) * 100));
  const budgetPercent = Math.min(100, Math.round((budgetPoints / 30) * 100));
  const spendingPercent = Math.min(100, Math.round((spendingPoints / 20) * 100));
  const goalPercent = Math.min(100, Math.round((goalPoints / 20) * 100));

  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * Math.min(100, Math.max(0, score))) / 100;

  const gradeStyles = {
    'Excellent': 'bg-positive/10 text-positive border-positive/30',
    'Good': 'bg-accent/10 text-accent border-accent/30',
    'Fair': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    'Needs Attention': 'bg-negative/10 text-negative border-negative/30'
  };
  const currentGradeBadge = gradeStyles[grade] || gradeStyles['Fair'];

  const gradeMessages = {
    'Excellent': "Your financial health is outstanding with high savings and disciplined spending.",
    'Good': "You're building healthy financial habits and maintaining strong budget control.",
    'Fair': "Your finances are stable, but some budget and savings areas need attention.",
    'Needs Attention': "High spending pressure detected. Follow the action plan below to regain control."
  };
  const summaryMessage = gradeMessages[grade] || "Review your financial factors below to optimize your score.";

  return (
    <div className="space-y-6">
      
      {/* 1. OVERALL SCORE HERO CARD */}
      <GlassCard className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
        {/* Left: Heading, Summary & Grade */}
        <div className="space-y-3 flex-1 text-center md:text-left z-10">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Financial Health
            </h2>
            <span className={`px-3 py-0.5 text-xs font-semibold rounded-full border ${currentGradeBadge}`}>
              {grade.toUpperCase()}
            </span>
          </div>

          <p className="text-sm text-text-muted max-w-xl leading-relaxed">
            "{summaryMessage}"
          </p>

          <div className="flex items-center justify-center md:justify-start gap-2 pt-2 text-xs text-text-muted">
            <span className="text-text-primary font-bold text-lg">{score}</span>
            <span className="text-text-muted">/ 100 points composite health index</span>
          </div>
        </div>

        {/* Right: Radial Gauge */}
        <div className="relative flex items-center justify-center shrink-0 w-36 h-36 z-10">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="currentColor"
              strokeWidth="9"
              className="text-white/10"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r={radius}
              stroke="#39FF88"
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-text-primary tracking-tight">{score}</span>
            <span className="text-[10px] uppercase font-semibold text-accent tracking-wider">Health Index</span>
          </div>
        </div>
      </GlassCard>

      {/* 2. SCORE FACTORS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Factor 1: Savings Rate */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-text-primary">Savings Rate</span>
              <span className="text-[11px] text-text-muted font-medium">30% weight</span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-bold text-text-primary">{savingsPoints}</span>
              <span className="text-xs text-text-muted">/ 30 pts</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-accent rounded-full transition-all duration-700"
                style={{ width: `${savingsPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-text-muted text-right">{savingsPercent}% performance</div>
          </div>
        </GlassCard>

        {/* Factor 2: Budget Adherence */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-text-primary">Budget Adherence</span>
              <span className="text-[11px] text-text-muted font-medium">30% weight</span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-bold text-text-primary">{budgetPoints}</span>
              <span className="text-xs text-text-muted">/ 30 pts</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-accent rounded-full transition-all duration-700"
                style={{ width: `${budgetPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-text-muted text-right">{budgetPercent}% performance</div>
          </div>
        </GlassCard>

        {/* Factor 3: Spending Consistency */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-text-primary">Spending Consistency</span>
              <span className="text-[11px] text-text-muted font-medium">20% weight</span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-bold text-text-primary">{spendingPoints}</span>
              <span className="text-xs text-text-muted">/ 20 pts</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-accent rounded-full transition-all duration-700"
                style={{ width: `${spendingPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-text-muted text-right">{spendingPercent}% performance</div>
          </div>
        </GlassCard>

        {/* Factor 4: Goal Progress */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-text-primary">Goal Progress</span>
              <span className="text-[11px] text-text-muted font-medium">20% weight</span>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-bold text-text-primary">{goalPoints}</span>
              <span className="text-xs text-text-muted">/ 20 pts</span>
            </div>
          </div>
          <div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-accent rounded-full transition-all duration-700"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
            <div className="text-[11px] text-text-muted text-right">{goalPercent}% performance</div>
          </div>
        </GlassCard>

      </div>

      {/* 3. DETAILED ANALYSIS (3 Column Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* STRENGTHS */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-positive/10 border border-positive/20 text-positive flex items-center justify-center text-xs">
                ✓
              </div>
              <h3 className="font-semibold text-sm text-text-primary">Strengths</h3>
            </div>

            {strengths && strengths.length > 0 ? (
              <ul className="space-y-2.5">
                {strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-text-primary flex items-start gap-2 leading-relaxed">
                    <span className="text-positive mt-0.5">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-text-muted italic">
                No dominant strengths identified yet. Meeting budget caps will build strengths.
              </p>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-border text-[11px] text-text-muted">
            Based on regular spending & savings consistency
          </div>
        </GlassCard>

        {/* WARNINGS */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xs">
                !
              </div>
              <h3 className="font-semibold text-sm text-text-primary">Warnings</h3>
            </div>

            {warnings && warnings.length > 0 ? (
              <ul className="space-y-2.5">
                {warnings.map((warn, idx) => (
                  <li key={idx} className="text-xs text-amber-200 flex items-start gap-2 leading-relaxed">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{warn}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-text-muted flex items-center gap-1.5">
                <span className="text-positive">✓</span> No critical warnings active. All limits safe.
              </p>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-border text-[11px] text-text-muted">
            Triggered when category exceeds 90% or savings drop
          </div>
        </GlassCard>

        {/* RECOMMENDED ACTIONS */}
        <GlassCard className="p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-accent/10 border border-accent/20 text-accent flex items-center justify-center text-xs">
                💡
              </div>
              <h3 className="font-semibold text-sm text-text-primary">Recommended Actions</h3>
            </div>

            {recommendations && recommendations.length > 0 ? (
              <ul className="space-y-2.5">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="text-xs text-text-primary flex items-start gap-2.5 leading-relaxed">
                    <span className="font-mono text-[10px] font-bold text-accent px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 mt-0.5 shrink-0">
                      0{idx + 1}
                    </span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-text-muted italic">
                Your current habits are optimal. Continue your existing routine.
              </p>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-border text-[11px] text-text-muted">
            Actionable next steps to optimize your overall score
          </div>
        </GlassCard>

      </div>

      {/* FOOTER */}
      <GlassCard className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-text-muted">
        <div>
          <span className="font-semibold text-text-primary">Why your score looks this way:</span>{' '}
          Calculated deterministically based on your monthly savings rate (30%), budget limits adherence (30%), category spending volatility (20%), and savings goals completion (20%).
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-text-muted shrink-0">
          <span>Savings 30%</span>
          <span>•</span>
          <span>Budget 30%</span>
          <span>•</span>
          <span>Consistency 20%</span>
          <span>•</span>
          <span>Goals 20%</span>
        </div>
      </GlassCard>

    </div>
  );
}

