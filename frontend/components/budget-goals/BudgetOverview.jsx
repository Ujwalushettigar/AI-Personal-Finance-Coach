'use client';

import React from 'react';
import { BadgePill, PrimaryButton } from './ThemeCard';

/**
 * Budget Overview Component (CryptoVault Fintech Theme)
 * - Section heading with badge pill and gradient highlighted text
 * - Primary CTA in signature neon green (#39FF14) with dark text (#0A0E27) and soft green glow
 * - Stats Panel: Single large card with 4-column grid
 *   - Each column has 36-40px bold gradient number (from #1FB5A5 to #22D36A)
 *   - White semibold label
 *   - 12px muted sub-label in #8A93B5
 */
export default function BudgetOverview({ summary = {}, onCreateBudget }) {
  const totalLimit = Number(summary.totalLimit || 0);
  const totalSpent = Number(summary.totalSpent || 0);
  const totalRemaining = Number(summary.totalRemaining || Math.max(0, totalLimit - totalSpent));
  const overallPercentage = Number(
    summary.overallPercentageUsed || (totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0)
  ).toFixed(1);

  const currentMonthPeriod = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8">
      {/* Top Header: Badge Pill + Section Heading + Primary Neon CTA */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <BadgePill
            icon="🛡️"
            text={`Active Period • ${currentMonthPeriod}`}
            className="mb-3"
          />
          <h1 className="text-3xl sm:text-4xl md:text-[44px] font-bold text-white tracking-tight leading-[1.15]">
            Stay in Control of Your{' '}
            <span className="bg-gradient-to-r from-[#0A84FF] via-[#22D36A] to-[#39FF14] bg-clip-text text-transparent">
              Capital
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#8A93B5] mt-2 max-w-xl">
            Real-time telemetry, automated spending guardrails, and category-level asset tracking.
          </p>
        </div>

        <div className="flex-shrink-0">
          <PrimaryButton onClick={onCreateBudget}>
            <svg className="w-4 h-4 text-[#0A0E27]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Budget</span>
          </PrimaryButton>
        </div>
      </div>

      {/* Signature 4-Column Stats Panel */}
      <div className="bg-[#0F1633] border border-white/[0.06] rounded-[16px] p-6 sm:p-8 hover:border-[#0A84FF]/25 transition-all duration-200">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06]">
          
          {/* Stat 1: Total Allocated Limit */}
          <div className="pt-4 lg:pt-0 lg:px-4 first:lg:pl-0 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-wider text-[#8A93B5] font-semibold">
              Total Allocated
            </span>
            <div className="mt-2">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#1FB5A5] to-[#22D36A] bg-clip-text text-transparent tracking-tight">
                ${totalLimit.toLocaleString()}
              </div>
              <div className="text-sm font-semibold text-white mt-1">
                Budget Ceiling
              </div>
              <div className="text-xs text-[#8A93B5] mt-0.5">
                Across all categories
              </div>
            </div>
          </div>

          {/* Stat 2: Total Spent */}
          <div className="pt-4 lg:pt-0 lg:px-6 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-wider text-[#8A93B5] font-semibold">
              Current Outflow
            </span>
            <div className="mt-2">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#1FB5A5] to-[#22D36A] bg-clip-text text-transparent tracking-tight">
                ${totalSpent.toLocaleString()}
              </div>
              <div className="text-sm font-semibold text-white mt-1">
                Actual Spent
              </div>
              <div className="text-xs text-[#8A93B5] mt-0.5">
                Settled transactions
              </div>
            </div>
          </div>

          {/* Stat 3: Total Remaining */}
          <div className="pt-4 lg:pt-0 lg:px-6 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-wider text-[#8A93B5] font-semibold">
              Remaining Reserve
            </span>
            <div className="mt-2">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#1FB5A5] to-[#22D36A] bg-clip-text text-transparent tracking-tight">
                ${totalRemaining.toLocaleString()}
              </div>
              <div className="text-sm font-semibold text-white mt-1">
                Available Buffer
              </div>
              <div className="text-xs text-[#8A93B5] mt-0.5">
                Remaining safe limit
              </div>
            </div>
          </div>

          {/* Stat 4: Cap Utilization */}
          <div className="pt-4 lg:pt-0 lg:px-6 flex flex-col justify-between">
            <span className="text-xs uppercase tracking-wider text-[#8A93B5] font-semibold">
              Cap Utilization
            </span>
            <div className="mt-2">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#1FB5A5] to-[#22D36A] bg-clip-text text-transparent tracking-tight">
                {overallPercentage}%
              </div>
              <div className="text-sm font-semibold text-white mt-1">
                {overallPercentage > 100 ? 'Exceeded Budget' : overallPercentage >= 70 ? 'Approaching Cap' : 'Optimal Pace'}
              </div>
              <div className="text-xs text-[#8A93B5] mt-0.5">
                Cycle run rate
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

