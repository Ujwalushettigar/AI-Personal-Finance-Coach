'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, BadgePill } from '../budget-goals/ThemeCard';
import { getHealthScore } from '../../services/api/budget';
import HealthScoreSkeleton from './HealthScoreSkeleton';

/**
 * HealthScoreTab Component
 * Displays deterministic financial health score, letter grade, and 4-factor breakdown.
 * Shows specific empty state when insufficientData is true.
 */
export default function HealthScoreTab() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScore = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getHealthScore();
      setHealthData(data);
    } catch (err) {
      console.warn('Health Score error:', err.message);
      setError(err.message);
      setHealthData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScore();
  }, [fetchScore]);

  if (loading) {
    return <HealthScoreSkeleton />;
  }

  // Handle missing data or explicit insufficientData flag
  if (error || !healthData || healthData.insufficientData) {
    return (
      <Card hover={false} className="p-8 text-center max-w-xl mx-auto border-white/[0.08] my-6">
        <div className="w-14 h-14 rounded-[14px] bg-[#0A84FF]/[0.12] border border-[#0A84FF]/30 text-[#0A84FF] flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">
          Health Score Not Yet Available
        </h3>
        <p className="text-xs sm:text-sm text-[#8A93B5] max-w-md mx-auto leading-relaxed">
          Add a few transactions and set up a budget to calculate your Health Score.
        </p>
      </Card>
    );
  }

  const { score = 0, grade = 'N/A', breakdown = {} } = healthData;

  const {
    savingsRate = null,
    budgetAdherence = null,
    recurringRatio = null,
    consistency = null,
  } = breakdown;

  const formatPct = (val) => (val !== null && val !== undefined ? `${Math.round(val * 100)}%` : 'No data');

  const gradeColors = {
    A: 'bg-[#22D36A]/[0.15] text-[#22D36A] border-[#22D36A]/30',
    B: 'bg-[#0A84FF]/[0.15] text-[#0A84FF] border-[#0A84FF]/30',
    C: 'bg-[#F5A524]/[0.15] text-[#F5A524] border-[#F5A524]/30',
    D: 'bg-[#FF4D6A]/[0.15] text-[#FF4D6A] border-[#FF4D6A]/30',
  };

  const currentGradeStyle = gradeColors[grade] || gradeColors['C'];

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* Main Score Card */}
      <Card hover={false} className="p-8 sm:p-10 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-2">
              <BadgePill icon="🛡️" text="Composite Health Index" />
              <span className={`px-3 py-0.5 text-xs font-bold rounded-full border ${currentGradeStyle}`}>
                GRADE {grade}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Financial Health <span className="bg-gradient-to-r from-[#0A84FF] via-[#22D36A] to-[#39FF14] bg-clip-text text-transparent">Telemetry</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#8A93B5] max-w-lg leading-relaxed">
              Calculated dynamically from your monthly cashflow, category limit adherence, subscription load, and spending consistency.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-6 rounded-[20px] bg-[#0A0E27]/60 border border-white/[0.08] min-w-[180px]">
            <span className="text-5xl font-extrabold text-white tracking-tight">
              {score}
            </span>
            <span className="text-[11px] uppercase font-bold text-[#39FF14] tracking-wider mt-1">
              / 100 Points
            </span>
          </div>
        </div>
      </Card>

      {/* 4 Component Breakdown List */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 tracking-tight">
          Score Components Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* 1. Savings Rate */}
          <Card hover={false} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#8A93B5] font-semibold">
                Savings Rate
              </span>
              <span className="text-[11px] text-[#8A93B5]">35% Weight</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatPct(savingsRate)}
            </div>
            <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#1FB5A5] to-[#22D36A] rounded-full transition-all duration-500"
                style={{ width: `${savingsRate !== null ? Math.min(100, Math.round(savingsRate * 100)) : 0}%` }}
              />
            </div>
            <p className="text-[11px] text-[#8A93B5]">
              Income retained after settled monthly expenses.
            </p>
          </Card>

          {/* 2. Budget Adherence */}
          <Card hover={false} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#8A93B5] font-semibold">
                Budget Adherence
              </span>
              <span className="text-[11px] text-[#8A93B5]">30% Weight</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatPct(budgetAdherence)}
            </div>
            <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#0A84FF] to-[#1FB5A5] rounded-full transition-all duration-500"
                style={{ width: `${budgetAdherence !== null ? Math.min(100, Math.round(budgetAdherence * 100)) : 0}%` }}
              />
            </div>
            <p className="text-[11px] text-[#8A93B5]">
              Ratio of category budgets maintained within ceiling.
            </p>
          </Card>

          {/* 3. Subscription Load */}
          <Card hover={false} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#8A93B5] font-semibold">
                Subscription Load
              </span>
              <span className="text-[11px] text-[#8A93B5]">20% Weight</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {recurringRatio !== null ? formatPct(recurringRatio) : 'No data'}
            </div>
            <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#F5A524] to-[#FF4D6A] rounded-full transition-all duration-500"
                style={{ width: `${recurringRatio !== null ? Math.min(100, Math.round(recurringRatio * 100)) : 0}%` }}
              />
            </div>
            <p className="text-[11px] text-[#8A93B5]">
              Recurring fixed expenses as % of total outflow.
            </p>
          </Card>

          {/* 4. Spending Consistency */}
          <Card hover={false} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#8A93B5] font-semibold">
                Spending Consistency
              </span>
              <span className="text-[11px] text-[#8A93B5]">15% Weight</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {formatPct(consistency)}
            </div>
            <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#22D36A] to-[#39FF14] rounded-full transition-all duration-500"
                style={{ width: `${consistency !== null ? Math.min(100, Math.round(consistency * 100)) : 0}%` }}
              />
            </div>
            <p className="text-[11px] text-[#8A93B5]">
              Month-over-month spending stability comparison.
            </p>
          </Card>

        </div>
      </div>

    </div>
  );
}
