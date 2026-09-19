'use client';

import React from 'react';
import GlassCard from '../common/GlassCard';

export default function BudgetSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {[1, 2, 3, 4, 5, 6].map((idx) => (
        <GlassCard 
          key={idx} 
          className="p-5 flex flex-col justify-between h-[210px]"
        >
          <div>
            {/* Top row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/10" />
                <div className="w-24 h-4 rounded bg-white/10" />
              </div>
              <div className="w-16 h-5 rounded-full bg-white/10" />
            </div>

            {/* Spent & Limit */}
            <div className="flex items-baseline justify-between mb-3">
              <div className="w-28 h-7 rounded bg-white/10" />
              <div className="w-16 h-4 rounded bg-white/5" />
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/5 h-2 rounded-full mb-3" />

            {/* Subtext */}
            <div className="flex justify-between">
              <div className="w-20 h-3 rounded bg-white/5" />
              <div className="w-12 h-3 rounded bg-white/5" />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <div className="w-12 h-6 rounded-lg bg-white/5" />
            <div className="w-12 h-6 rounded-lg bg-white/5" />
          </div>
        </GlassCard>
      ))}
    </div>
  );
}

