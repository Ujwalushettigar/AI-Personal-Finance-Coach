'use client';

import React from 'react';
import GlassCard from '../common/GlassCard';
import { CategoryIcon } from './CategoryIcons';

export default function BudgetCard({ budget, onEdit, onDeleteClick }) {
  const { id, category, amountLimit = 0, spent = 0, percentageUsed = 0, status = 'NORMAL', remaining = 0 } = budget;

  const statusStyles = {
    NORMAL: {
      label: 'Normal',
      badge: 'bg-positive/10 text-positive border-positive/20',
      barGradient: 'from-accent to-positive'
    },
    WARNING: {
      label: 'Warning',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      barGradient: 'from-accent to-amber-500'
    },
    CRITICAL: {
      label: 'Critical',
      badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      barGradient: 'from-amber-500 to-orange-500'
    },
    EXCEEDED: {
      label: 'Exceeded',
      badge: 'bg-negative/10 text-negative border-negative/20',
      barGradient: 'from-negative to-rose-600'
    }
  };

  const currentTheme = statusStyles[status] || statusStyles.NORMAL;
  const clampedProgress = Math.min(100, Math.max(0, percentageUsed));

  return (
    <GlassCard className="p-5 flex flex-col justify-between group hover:-translate-y-0.5 transition-all">
      <div>
        {/* Top Header: Icon + Category Name & Status Badge */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-border flex items-center justify-center shrink-0 group-hover:border-accent/30 transition-colors">
              <CategoryIcon category={category} className="w-4 h-4 text-accent" />
            </div>
            <h3 className="font-semibold text-base text-text-primary truncate tracking-tight">
              {category}
            </h3>
          </div>

          <span className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full border ${currentTheme.badge} shrink-0`}>
            {currentTheme.label}
          </span>
        </div>

        {/* Primary Spent & Limit Visual Hierarchy */}
        <div className="flex items-baseline justify-between mb-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-text-primary tracking-tight">
              ₹{Number(spent).toLocaleString()}
            </span>
            <span className="text-xs text-text-muted font-normal">
              / ₹{Number(amountLimit).toLocaleString()}
            </span>
          </div>
          <span className="text-xs font-semibold text-accent">
            {percentageUsed}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-2.5">
          <div
            className={`h-full bg-gradient-to-r ${currentTheme.barGradient} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${clampedProgress}%` }}
          />
        </div>

        {/* Remaining / Over Budget Info */}
        <div className="flex items-center justify-between text-xs text-text-muted mb-4">
          <span>
            {status === 'EXCEEDED' ? (
              <span className="text-negative font-medium">
                Over budget by ₹{(Number(spent) - Number(amountLimit)).toLocaleString()}
              </span>
            ) : (
              <span>
                ₹{Number(remaining).toLocaleString()} remaining
              </span>
            )}
          </span>
          <span className="text-[11px] text-text-muted">
            {100 - clampedProgress > 0 ? `${(100 - clampedProgress).toFixed(0)}% left` : 'Limit reached'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-border text-xs">
        <button
          onClick={() => onEdit(budget)}
          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-muted hover:text-text-primary font-medium transition flex items-center gap-1.5 border border-border"
          title="Edit budget category"
        >
          <svg className="w-3.5 h-3.5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit
        </button>

        <button
          onClick={() => onDeleteClick(budget)}
          className="px-3 py-1.5 rounded-lg bg-negative/10 hover:bg-negative/20 text-negative font-medium transition flex items-center gap-1.5 border border-negative/20"
          title="Delete budget category"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </GlassCard>
  );
}

