'use client';

import React from 'react';
import GlassCard from '../common/GlassCard';

export default function HealthScoreSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero Score Card Skeleton */}
      <GlassCard className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 flex-1 w-full">
          <div className="w-36 h-6 rounded-lg bg-white/10" />
          <div className="w-64 h-4 rounded bg-white/5" />
          <div className="w-48 h-10 rounded-xl bg-white/10 mt-4" />
        </div>
        
        {/* Radial Ring Placeholder */}
        <div className="w-36 h-36 rounded-full border-8 border-white/10 flex items-center justify-center shrink-0">
          <div className="w-16 h-8 rounded bg-white/10" />
        </div>
      </GlassCard>

      {/* 4 Factor Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(idx => (
          <GlassCard key={idx} className="p-5 space-y-3">
            <div className="flex justify-between items-center">
              <div className="w-20 h-3.5 rounded bg-white/10" />
              <div className="w-10 h-3 rounded bg-white/5" />
            </div>
            <div className="w-16 h-7 rounded bg-white/10" />
            <div className="w-full h-2 rounded-full bg-white/5" />
          </GlassCard>
        ))}
      </div>

      {/* Detail Panels Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map(idx => (
          <GlassCard key={idx} className="p-5 space-y-3 h-48">
            <div className="w-28 h-4 rounded bg-white/10" />
            <div className="w-full h-3 rounded bg-white/5" />
            <div className="w-4/5 h-3 rounded bg-white/5" />
            <div className="w-3/5 h-3 rounded bg-white/5" />
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

