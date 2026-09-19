'use client';

import React from 'react';
import { CategoryIcon } from './CategoryIcons';

/**
 * Fintech-Style Budget Card Component
 * Conforms to the reference dark fintech aesthetic:
 * - Dark surface (#12131b) with subtle border (#1e2230)
 * - Category icon badge + Name
 * - Bold primary spent amount with visual hierarchy
 * - Electric blue progress bar with subtle status glow
 * - Muted metadata (remaining amount & percentage)
 * - Subtle Edit and Delete actions
 */
export default function BudgetCard({ budget, onEdit, onDeleteClick }) {
  const { id, category, amountLimit = 0, spent = 0, percentageUsed = 0, status = 'NORMAL', remaining = 0 } = budget;

  // Subtle status badge styling (restrained, dark theme, low-saturation indicators)
  const statusStyles = {
    NORMAL: {
      label: 'Normal',
      badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      barGradient: 'from-blue-600 to-blue-400',
      glow: 'shadow-[0_0_12px_rgba(59,130,246,0.3)]'
    },
    WARNING: {
      label: 'Warning',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      barGradient: 'from-blue-600 via-blue-500 to-amber-500',
      glow: 'shadow-[0_0_12px_rgba(245,158,11,0.25)]'
    },
    CRITICAL: {
      label: 'Critical',
      badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      barGradient: 'from-blue-600 via-orange-500 to-orange-400',
      glow: 'shadow-[0_0_12px_rgba(249,115,22,0.3)]'
    },
    EXCEEDED: {
      label: 'Exceeded',
      badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      barGradient: 'from-rose-600 to-rose-500',
      glow: 'shadow-[0_0_12px_rgba(244,63,94,0.35)]'
    }
  };

  const currentTheme = statusStyles[status] || statusStyles.NORMAL;
  const clampedProgress = Math.min(100, Math.max(0, percentageUsed));

  return (
    <div className="p-5 rounded-2xl bg-[#12131b] border border-white/[0.07] hover:border-blue-500/40 transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex flex-col justify-between group">
      <div>
        {/* Top Header: Icon + Category Name & Status Badge */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#181a24] border border-white/[0.06] flex items-center justify-center flex-shrink-0 group-hover:border-blue-500/30 transition-colors">
              <CategoryIcon category={category} className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className="font-semibold text-base text-white truncate tracking-tight">
              {category}
            </h3>
          </div>

          <span className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full border ${currentTheme.badge} flex-shrink-0`}>
            {currentTheme.label}
          </span>
        </div>

        {/* Primary Spent & Limit Visual Hierarchy */}
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-extrabold text-white tracking-tight">
              ${Number(spent).toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-normal">
              / ${Number(amountLimit).toLocaleString()}
            </span>
          </div>
          <span className="text-xs font-semibold text-blue-400">
            {percentageUsed}%
          </span>
        </div>

        {/* Progress Bar with Electric Blue Fill */}
        <div className="w-full bg-white/[0.06] h-2 rounded-full overflow-hidden mb-2.5">
          <div
            className={`h-full bg-gradient-to-r ${currentTheme.barGradient} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${clampedProgress}%` }}
          />
        </div>

        {/* Remaining / Over Budget Info */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
          <span>
            {status === 'EXCEEDED' ? (
              <span className="text-rose-400 font-medium">
                Over budget by ${(Number(spent) - Number(amountLimit)).toLocaleString()}
              </span>
            ) : (
              <span>
                ${Number(remaining).toLocaleString()} remaining
              </span>
            )}
          </span>
          <span className="text-[11px] text-slate-500">
            {100 - clampedProgress > 0 ? `${(100 - clampedProgress).toFixed(0)}% left` : 'Limit reached'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.05] text-xs">
        <button
          onClick={() => onEdit(budget)}
          className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white font-medium transition flex items-center gap-1.5"
          title="Edit budget category"
        >
          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit
        </button>

        <button
          onClick={() => onDeleteClick(budget)}
          className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 font-medium transition flex items-center gap-1.5"
          title="Delete budget category"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </div>
  );
}
