'use client';

import React from 'react';
import GlassCard from '../common/GlassCard';

export default function BudgetOverview({ summary = {}, onCreateBudget }) {
  const totalLimit = Number(summary.totalLimit || 0);
  const totalSpent = Number(summary.totalSpent || 0);
  const totalRemaining = Number(summary.totalRemaining || Math.max(0, totalLimit - totalSpent));
  const overallPercentage = Number(summary.overallPercentageUsed || (totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0)).toFixed(1);

  const currentMonthPeriod = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-text-primary">Budget</h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
              {currentMonthPeriod}
            </span>
          </div>
          <p className="text-sm text-text-muted mt-1">
            Track and control your spending limits across categories
          </p>
        </div>

        <div>
          <button
            onClick={onCreateBudget}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-accent text-[#0A0E1A] font-bold text-sm shadow-md hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Budget
          </button>
        </div>
      </div>

      {/* Main Overview Grid: Metric Cards + Circular Expense Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left Side: 4 Compact Metric Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <GlassCard className="p-4 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Total Budget
            </div>
            <div className="mt-2">
              <div className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                ₹{totalLimit.toLocaleString()}
              </div>
              <div className="text-[11px] text-text-muted mt-1">Allocated limit</div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Spent
            </div>
            <div className="mt-2">
              <div className="text-xl sm:text-2xl font-bold text-accent tracking-tight">
                ₹{totalSpent.toLocaleString()}
              </div>
              <div className="text-[11px] text-text-muted mt-1">Current period</div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Remaining
            </div>
            <div className="mt-2">
              <div className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
                ₹{totalRemaining.toLocaleString()}
              </div>
              <div className="text-[11px] text-text-muted mt-1">Available buffer</div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">
              Used
            </div>
            <div className="mt-2">
              <div className="text-xl sm:text-2xl font-bold text-accent-2 tracking-tight">
                {overallPercentage}%
              </div>
              <div className="text-[11px] text-text-muted mt-1">Utilization rate</div>
            </div>
          </GlassCard>

        </div>

        {/* Right Side: Circular Expenses Gauge Card */}
        <GlassCard className="p-5 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Cycle Status
            </div>
            <div className="text-sm text-text-primary mt-1 font-medium">
              {overallPercentage > 100 
                ? 'Over Budget Limit' 
                : overallPercentage >= 90 
                ? 'Critical Capacity' 
                : overallPercentage >= 70 
                ? 'Warning Threshold' 
                : 'Safe Allocation'}
            </div>
            <div className="text-xs text-text-muted mt-2">
              ₹{totalSpent.toLocaleString()} of ₹{totalLimit.toLocaleString()} spent
            </div>
          </div>

          {/* Segmented Ring Gauge */}
          <div className="relative flex items-center justify-center shrink-0 w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="38"
                stroke="currentColor"
                strokeWidth="7"
                className="text-white/10"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="38"
                stroke="#39FF88"
                strokeWidth="7"
                strokeDasharray="238"
                strokeDashoffset={238 - (238 * Math.min(100, overallPercentage)) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-sm font-bold text-text-primary">{overallPercentage}%</span>
              <span className="text-[9px] text-text-muted uppercase">Cap</span>
            </div>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}

