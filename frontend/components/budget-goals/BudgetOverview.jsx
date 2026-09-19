'use client';

import React from 'react';

/**
 * Budget Overview Component
 * Implements fintech-style summary inspired by the reference screenshot:
 * - Header with current period and electric blue "+ Create Budget" button
 * - Segmented circular progress gauge for current period expenses vs budget
 * - 4 compact summary cards: [ Total Budget ] [ Spent ] [ Remaining ] [ Used ]
 */
export default function BudgetOverview({ summary = {}, onCreateBudget }) {
  const totalLimit = Number(summary.totalLimit || 0);
  const totalSpent = Number(summary.totalSpent || 0);
  const totalRemaining = Number(summary.totalRemaining || Math.max(0, totalLimit - totalSpent));
  const overallPercentage = Number(summary.overallPercentageUsed || (totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0)).toFixed(1);

  // Current period label (e.g. September 2026)
  const currentMonthPeriod = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Circular gauge calculations (circumference for radius 46 is ~289)
  const circumference = 2 * Math.PI * 46;
  const strokeDashoffset = Math.max(0, circumference - (circumference * Math.min(100, overallPercentage)) / 100);

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Budget</h1>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {currentMonthPeriod}
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Track and control your spending limits across categories
          </p>
        </div>

        <div>
          <button
            onClick={onCreateBudget}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm shadow-[0_0_22px_rgba(37,99,235,0.4)] transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create Budget
          </button>
        </div>
      </div>

      {/* Main Overview Grid: Metric Cards + Circular Expense Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Left Side: 4 Compact Metric Cards (2x2 grid) */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          {/* Card 1: Total Budget */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#12131b] border border-white/[0.07] hover:border-blue-500/30 transition-colors duration-200 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Budget
            </div>
            <div className="mt-2">
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                ${totalLimit.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Allocated limit</div>
            </div>
          </div>

          {/* Card 2: Spent */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#12131b] border border-white/[0.07] hover:border-blue-500/30 transition-colors duration-200 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Spent
            </div>
            <div className="mt-2">
              <div className="text-xl sm:text-2xl font-bold text-blue-400 tracking-tight">
                ${totalSpent.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Current period</div>
            </div>
          </div>

          {/* Card 3: Remaining */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#12131b] border border-white/[0.07] hover:border-blue-500/30 transition-colors duration-200 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Remaining
            </div>
            <div className="mt-2">
              <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                ${totalRemaining.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Available buffer</div>
            </div>
          </div>

          {/* Card 4: Used */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#12131b] border border-white/[0.07] hover:border-blue-500/30 transition-colors duration-200 flex flex-col justify-between">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Used
            </div>
            <div className="mt-2">
              <div className="text-xl sm:text-2xl font-bold text-blue-300 tracking-tight">
                {overallPercentage}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Utilization rate</div>
            </div>
          </div>

        </div>

        {/* Right Side: Circular Expenses Gauge Card (Directly inspired by screenshot's top-right card) */}
        <div className="p-5 rounded-2xl bg-[#12131b] border border-white/[0.07] flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Cycle Status
            </div>
            <div className="text-sm text-slate-300 mt-1 font-medium">
              {overallPercentage > 100 
                ? 'Over Budget Limit' 
                : overallPercentage >= 90 
                ? 'Critical Capacity' 
                : overallPercentage >= 70 
                ? 'Warning Threshold' 
                : 'Safe Allocation'}
            </div>
            <div className="text-xs text-slate-500 mt-2">
              ${totalSpent.toLocaleString()} of ${totalLimit.toLocaleString()} spent
            </div>
          </div>

          {/* Segmented Ring Gauge */}
          <div className="relative flex items-center justify-center flex-shrink-0 w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="38"
                stroke="currentColor"
                strokeWidth="7"
                className="text-white/[0.06]"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="38"
                stroke="#3b82f6"
                strokeWidth="7"
                strokeDasharray="238"
                strokeDashoffset={238 - (238 * Math.min(100, overallPercentage)) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-sm font-bold text-white">{overallPercentage}%</span>
              <span className="text-[9px] text-slate-400 uppercase">Cap</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
