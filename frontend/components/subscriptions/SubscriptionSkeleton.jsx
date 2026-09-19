'use client';

import React from 'react';

/**
 * SubscriptionSkeleton Loader (CryptoVault Fintech Theme)
 * Matching the 16px radius, #0F1633 card, #0B1029 tile, and layout of the restyled page.
 */
export default function SubscriptionSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="w-48 h-6 rounded-full bg-white/[0.06]" />
        <div className="w-80 h-10 rounded-[12px] bg-white/[0.08]" />
        <div className="w-64 h-4 rounded bg-white/[0.04]" />
      </div>

      {/* Stats Panel Skeleton */}
      <div className="bg-[#0F1633] border border-white/[0.06] rounded-[16px] p-6 sm:p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="space-y-3">
              <div className="w-20 h-3 rounded bg-white/[0.06]" />
              <div className="w-28 h-9 rounded bg-white/[0.08]" />
              <div className="w-16 h-3 rounded bg-white/[0.04]" />
            </div>
          ))}
        </div>
      </div>

      {/* Review Panel Skeleton */}
      <div className="p-6 rounded-[16px] bg-[#0F1633] border border-white/[0.06] space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[10px] bg-white/[0.05]" />
          <div className="space-y-2 flex-1">
            <div className="w-60 h-5 rounded bg-white/[0.07]" />
            <div className="w-80 h-3 rounded bg-white/[0.04]" />
          </div>
        </div>
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="w-36 h-10 rounded-[10px] bg-white/[0.04]" />
          ))}
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Subscriptions Column */}
        <div className="lg:col-span-3 space-y-4">
          <div className="w-40 h-6 rounded bg-white/[0.07]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((idx) => (
              <div key={idx} className="p-6 rounded-[16px] bg-[#0F1633] border border-white/[0.06] h-[200px]" />
            ))}
          </div>
        </div>

        {/* Leaks Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="w-32 h-6 rounded bg-white/[0.07]" />
          {[1, 2].map((idx) => (
            <div key={idx} className="p-6 rounded-[16px] bg-[#0F1633] border border-white/[0.06] h-[180px]" />
          ))}
        </div>
      </div>

      {/* Recurring Table Skeleton */}
      <div className="p-6 rounded-[16px] bg-[#0F1633] border border-white/[0.06] space-y-4">
        <div className="w-40 h-5 rounded bg-white/[0.07]" />
        {[1, 2, 3, 4].map((idx) => (
          <div key={idx} className="flex gap-6 items-center py-3 border-t border-white/[0.04]">
            <div className="w-28 h-4 rounded bg-white/[0.06]" />
            <div className="w-16 h-4 rounded bg-white/[0.04]" />
            <div className="w-16 h-4 rounded bg-white/[0.04]" />
            <div className="w-20 h-4 rounded bg-white/[0.04]" />
            <div className="w-20 h-4 rounded bg-white/[0.04]" />
          </div>
        ))}
      </div>
    </div>
  );
}

