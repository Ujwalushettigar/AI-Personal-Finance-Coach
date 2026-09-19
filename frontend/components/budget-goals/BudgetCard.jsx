'use client';

import React from 'react';
import GlassCard from '../common/GlassCard';
import { CategoryIcon } from './CategoryIcons';
import { Card, IconTile } from './ThemeCard';

/**
 * Budget Category Feature Card (CryptoVault Fintech Theme)
 * - Feature card structure (48x48px icon tile + title + status badge)
 * - 8px rounded progress bar with status fills:
 *   - safe (<70%): gradient teal-to-green (#1FB5A5 to #22D36A)
 *   - warning (70-100%): amber (#F5A524)
 *   - over (>100%): red (#FF4D6A)
 * - Neon green (#39FF14) used strictly for safe percentage highlight
 * - Status conveyed by text labels and icons (never color alone)
 * - 16px radius, #0F1633 background, 1px subtle border, translateY(-2px) hover
 */
export default function BudgetCard({ budget, onEdit, onDeleteClick }) {
  const {
    id,
    category = 'Category',
    amountLimit = 0,
    spent = 0,
    percentageUsed = 0,
    status = 'NORMAL',
    remaining = 0,
    period = 'monthly'
  } = budget;

  // Determine status configuration
  const isOver = status === 'EXCEEDED' || percentageUsed > 100;
  const isWarning = !isOver && (status === 'WARNING' || status === 'CRITICAL' || percentageUsed >= 70);
  const isSafe = !isOver && !isWarning;

  const statusConfig = isOver
    ? {
      label: 'Over Limit',
      icon: '⚠️',
      badgeClass: 'bg-[#FF4D6A]/[0.12] text-[#FF4D6A] border-[#FF4D6A]/30',
      barFillClass: 'bg-[#FF4D6A]',
      percentTextClass: 'text-[#FF4D6A]'
    }
    : isWarning
      ? {
        label: percentageUsed >= 90 ? 'Critical' : 'Warning',
        icon: '⚡',
        badgeClass: 'bg-[#F5A524]/[0.12] text-[#F5A524] border-[#F5A524]/30',
        barFillClass: 'bg-[#F5A524]',
        percentTextClass: 'text-[#F5A524]'
      }
      : {
        label: 'Protected',
        icon: '🛡️',
        badgeClass: 'bg-[#22D36A]/[0.12] text-[#22D36A] border-[#22D36A]/30',
        barFillClass: 'bg-gradient-to-r from-[#1FB5A5] to-[#22D36A]',
        // Neon green used exclusively for safe percentage highlight
        percentTextClass: 'text-[#39FF14]'
      };

  const clampedProgress = Math.min(100, Math.max(0, percentageUsed));

  return (
    <Card className="flex flex-col justify-between group">
      <div>
        {/* Top Header: 48x48 Icon Tile + Title + Status Pill */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3.5 min-w-0">
            <IconTile>
              <CategoryIcon category={category} className="w-5 h-5 text-[#0A84FF]" />
            </IconTile>
            <div className="min-w-0">
              <h3 className="font-bold text-lg text-white truncate tracking-tight">
                {category}
              </h3>
              <p className="text-xs text-[#8A93B5] capitalize">
                {period} allocation
              </p>
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.badgeClass} flex-shrink-0`}
          >
            <span className="text-[11px] leading-none" aria-hidden="true">
              {statusConfig.icon}
            </span>
            <span>{statusConfig.label}</span>
          </div>
        </div>

        {/* Primary Spent & Limit Visual Numbers */}
        <div className="flex items-baseline justify-between mb-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-[26px] font-bold text-white tracking-tight">
              ${Number(spent).toLocaleString()}
            </span>
            <span className="text-xs text-[#8A93B5]">
              / ${Number(amountLimit).toLocaleString()}
            </span>
          </div>
          <span
            className={`text-sm font-bold tracking-tight ${statusConfig.percentTextClass}`}
          >
            {percentageUsed}%
          </span>
        </div>

        {/* 8px Rounded Progress Bar with subtle track */}
        <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full ${statusConfig.barFillClass} rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${clampedProgress}%` }}
            role="progressbar"
            aria-valuenow={percentageUsed}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {/* Remaining / Over Budget Status */}
        <div className="flex items-center justify-between text-xs text-[#8A93B5] mb-5">
          <span>
            {isOver ? (
              <span className="text-[#FF4D6A] font-semibold flex items-center gap-1">
                <span>Exceeded by</span>
                <span>${(Number(spent) - Number(amountLimit)).toLocaleString()}</span>
              </span>
            ) : (
              <span>${Number(remaining).toLocaleString()} available buffer</span>
            )}
          </span>
          <span className="text-[11px] text-[#8A93B5]">
            {100 - clampedProgress > 0 ? `${(100 - clampedProgress).toFixed(0)}% left` : 'Cap reached'}
          </span>
        </div>
      </div>

      {/* Action Buttons: Minimalist & Clean */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/[0.06] text-xs">
        <button
          type="button"
          onClick={() => onEdit(budget)}
          className="px-3 py-1.5 rounded-[10px] bg-white/[0.04] hover:bg-white/[0.08] text-[#8A93B5] hover:text-white font-medium transition-colors duration-150 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
          title="Edit budget category"
        >
          <svg className="w-3.5 h-3.5 text-[#0A84FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDeleteClick(budget)}
          className="px-3 py-1.5 rounded-[10px] bg-[#FF4D6A]/[0.10] hover:bg-[#FF4D6A]/[0.18] text-[#FF4D6A] font-medium transition-colors duration-150 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#FF4D6A]"
          title="Delete budget category"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete
        </button>
      </div>
    </Card>
  );
}

