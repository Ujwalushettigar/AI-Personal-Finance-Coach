'use client';

import React from 'react';
import GlassCard from '../common/GlassCard';

/**
 * HealthScoreSkeleton Loader (CryptoVault Fintech Theme)
 * Matching the 16px radius, #0F1633 background, and layout of HealthScoreDashboard
 */
export default function HealthScoreSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Hero Highlight Panel Skeleton */}
      <div className="p-8 sm:p-10 rounded-[16px] bg-[#0F1633] border border-white/[0.06] flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="space-y-4 flex-1 w-full">
          <div className="w-40 h-6 rounded-full bg-white/[0.06]" />
          <div className="w-3/4 h-10 rounded-[12px] bg-white/[0.08]" />
          <div className="w-1/2 h-4 rounded bg-white/[0.04]" />
          <div className="w-60 h-6 rounded bg-white/[0.05] mt-4" />
        </div>

        {/* Radial Ring Placeholder */}
        <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-full border-[10px] border-white/[0.06] flex items-center justify-center flex-shrink-0">
          <div className="w-16 h-10 rounded-[10px] bg-white/[0.08]" />
        </div>
      </div>

      {/* 4 Factor Tiles Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="p-6 rounded-[12px] bg-[#0B1029] border border-white/[0.05] space-y-4">
            <div className="flex justify-between items-center">
              <div className="w-24 h-4 rounded bg-white/[0.06]" />
              <div className="w-12 h-3 rounded bg-white/[0.04]" />
            </div>
            <div className="w-16 h-8 rounded bg-white/[0.08]" />
            <div className="w-full h-2 rounded-full bg-white/[0.05]" />
          </div>
        ))}
      </div>

      {/* Detail Panels Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((idx) => (
          <div key={idx} className="p-6 rounded-[16px] bg-[#0F1633] border border-white/[0.06] space-y-4 h-52">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[10px] bg-white/[0.05]" />
              <div className="w-24 h-5 rounded bg-white/[0.07]" />
            </div>
            <div className="w-full h-3 rounded bg-white/[0.04]" />
            <div className="w-4/5 h-3 rounded bg-white/[0.04]" />
            <div className="w-3/5 h-3 rounded bg-white/[0.04]" />
          </div>
        ))}
      </div>
    </div>
  );
}

