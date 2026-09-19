'use client';

import React from 'react';

/**
 * BudgetSkeleton Loader (CryptoVault Fintech Theme)
 * Matching the exact 16px radius, #0F1633 background, and layout of BudgetCard
 */
export default function BudgetSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((idx) => (
        <div
          key={idx}
          className="p-6 rounded-[16px] bg-[#0F1633] border border-white/[0.06] flex flex-col justify-between h-[230px]"
        >
          <div>
            {/* Top row: 48x48 icon tile placeholder + Title + Status Pill */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-[12px] bg-white/[0.05]" />
                <div className="space-y-1.5">
                  <div className="w-28 h-4 rounded bg-white/[0.07]" />
                  <div className="w-16 h-3 rounded bg-white/[0.04]" />
                </div>
              </div>
              <div className="w-20 h-6 rounded-full bg-white/[0.05]" />
            </div>

            {/* Spent & Limit */}
            <div className="flex items-baseline justify-between mb-3">
              <div className="w-32 h-7 rounded bg-white/[0.08]" />
              <div className="w-12 h-4 rounded bg-white/[0.05]" />
            </div>

            {/* 8px Progress Bar */}
            <div className="w-full bg-white/[0.05] h-2 rounded-full mb-3" />

            {/* Subtext */}
            <div className="flex justify-between">
              <div className="w-24 h-3 rounded bg-white/[0.04]" />
              <div className="w-14 h-3 rounded bg-white/[0.04]" />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-end gap-2 pt-4 border-t border-white/[0.05]">
            <div className="w-16 h-7 rounded-[10px] bg-white/[0.04]" />
            <div className="w-16 h-7 rounded-[10px] bg-white/[0.04]" />
          </div>
        </div>
      ))}
    </div>
  );
}

