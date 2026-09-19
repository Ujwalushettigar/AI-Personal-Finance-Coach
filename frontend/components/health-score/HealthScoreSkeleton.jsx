'use client';

import React from 'react';

/**
 * HealthScoreSkeleton Loader
 * Polished dark fintech skeleton placeholder matching score hero, 4 factor cards, and advice panels
 */
export default function HealthScoreSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero Score Card Skeleton */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#12131b] border border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 flex-1 w-full">
          <div className="w-36 h-6 rounded-lg bg-white/[0.08]" />
          <div className="w-64 h-4 rounded bg-white/[0.04]" />
          <div className="w-48 h-10 rounded-xl bg-white/[0.06] mt-4" />
        </div>
        
        {/* Radial Ring Placeholder */}
        <div className="w-36 h-36 rounded-full border-8 border-white/[0.05] flex items-center justify-center flex-shrink-0">
          <div className="w-16 h-8 rounded bg-white/[0.08]" />
        </div>
      </div>

      {/* 4 Factor Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(idx => (
          <div key={idx} className="p-5 rounded-2xl bg-[#12131b] border border-white/[0.05] space-y-3">
            <div className="flex justify-between items-center">
              <div className="w-20 h-3.5 rounded bg-white/[0.06]" />
              <div className="w-10 h-3 rounded bg-white/[0.04]" />
            </div>
            <div className="w-16 h-7 rounded bg-white/[0.08]" />
            <div className="w-full h-2 rounded-full bg-white/[0.04]" />
          </div>
        ))}
      </div>

      {/* Detail Panels Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(idx => (
          <div key={idx} className="p-5 rounded-2xl bg-[#12131b] border border-white/[0.05] space-y-3 h-48">
            <div className="w-28 h-4 rounded bg-white/[0.07]" />
            <div className="w-full h-3 rounded bg-white/[0.04]" />
            <div className="w-4/5 h-3 rounded bg-white/[0.04]" />
            <div className="w-3/5 h-3 rounded bg-white/[0.04]" />
          </div>
        ))}
      </div>
    </div>
  );
}
