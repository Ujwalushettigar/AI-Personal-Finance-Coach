'use client';

import React from 'react';

/**
 * BudgetSkeleton Loader
 * Renders sleek pulse skeletons matching the exact dimensions and layout of the budget cards
 */
export default function BudgetSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((idx) => (
        <div 
          key={idx} 
          className="p-5 rounded-2xl bg-[#12131b] border border-white/[0.05] flex flex-col justify-between h-[210px]"
        >
          <div>
            {/* Top row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/[0.05]" />
                <div className="w-24 h-4 rounded bg-white/[0.06]" />
              </div>
              <div className="w-16 h-5 rounded-full bg-white/[0.05]" />
            </div>

            {/* Spent & Limit */}
            <div className="flex items-baseline justify-between mb-3">
              <div className="w-28 h-7 rounded bg-white/[0.08]" />
              <div className="w-16 h-4 rounded bg-white/[0.04]" />
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/[0.04] h-2 rounded-full mb-3" />

            {/* Subtext */}
            <div className="flex justify-between">
              <div className="w-20 h-3 rounded bg-white/[0.04]" />
              <div className="w-12 h-3 rounded bg-white/[0.04]" />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.04]">
            <div className="w-12 h-6 rounded-lg bg-white/[0.04]" />
            <div className="w-12 h-6 rounded-lg bg-white/[0.04]" />
          </div>
        </div>
      ))}
    </div>
  );
}
