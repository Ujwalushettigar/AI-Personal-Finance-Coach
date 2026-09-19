'use client';

import React from 'react';
import { Card, Tile, BadgePill } from './ThemeCard';

/**
 * Savings Goal Feature Card (CryptoVault Fintech Theme)
 * - Feature-card with circular progress ring:
 *   - Stroke gradient from blue (#0A84FF) to green (#22D36A)
 *   - Track in rgba(255,255,255,0.08)
 * - Saved vs Target in bold white typography
 * - Projected completion date in muted text (#8A93B5)
 * - Required monthly amount displayed cleanly in a nested #0B1029 tile
 * - 16px radius, #0F1633 background, translateY(-2px) hover
 */
export default function GoalCard({ goal, onEdit, onDelete, onAddFunds }) {
  const {
    id,
    title = 'Savings Goal',
    targetAmount = 0,
    currentAmount = 0,
    remainingAmount = 0,
    progressPercentage = 0,
    targetDate,
    requiredMonthlyContribution = 0,
    category = 'General'
  } = goal;

  const isCompleted = progressPercentage >= 100;
  const clampedProgress = Math.min(100, Math.max(0, progressPercentage));

  // Circular progress ring math (radius 32, circumference ~201)
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * clampedProgress) / 100;
  const gradientId = `goal-grad-${id || Math.random().toString(36).substring(2, 9)}`;

  return (
    <Card className="flex flex-col justify-between group">
      <div>
        {/* Top Meta Row: Category Badge & Target Date / Achieved Status */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <BadgePill
            icon="🎯"
            text={category}
            className="text-[11px] py-0.5 px-2.5"
          />

          {isCompleted ? (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#39FF14] bg-[#39FF14]/[0.12] border border-[#39FF14]/30 px-2.5 py-0.5 rounded-full">
              <span>✓</span> Target Achieved
            </span>
          ) : targetDate ? (
            <span className="text-xs text-[#8A93B5]">
              Due: {new Date(targetDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
            </span>
          ) : (
            <span className="text-xs text-[#8A93B5]">Ongoing Goal</span>
          )}
        </div>

        {/* Header & Circular Progress Ring Section */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-lg text-white truncate tracking-tight">
              {title}
            </h3>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="text-2xl font-bold text-white tracking-tight">
                ${Number(currentAmount).toLocaleString()}
              </span>
              <span className="text-xs text-[#8A93B5]">
                of ${Number(targetAmount).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Circular Progress Ring */}
          <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <svg className="w-20 h-20 transform -rotate-90">
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0A84FF" />
                  <stop offset="100%" stopColor="#22D36A" />
                </linearGradient>
              </defs>
              {/* Background Track */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="6"
                fill="transparent"
              />
              {/* Gradient Progress Stroke */}
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke={`url(#${gradientId})`}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-white">
                {clampedProgress.toFixed(0)}%
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#8A93B5]">
                Funded
              </span>
            </div>
          </div>
        </div>

        {/* Nested Inner Tile: Remaining & Monthly Required Contribution */}
        <Tile className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#8A93B5] font-semibold block">
              Remaining
            </span>
            <span className="text-sm font-bold text-white mt-0.5 block">
              ${Number(remainingAmount).toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#8A93B5] font-semibold block">
              Monthly Req.
            </span>
            <span className="text-sm font-bold text-[#1FB5A5] mt-0.5 block">
              {requiredMonthlyContribution > 0 ? `$${requiredMonthlyContribution}/mo` : 'On track'}
            </span>
          </div>
        </Tile>
      </div>

      {/* Actions Row: Add Funds (Neon/Teal) + Edit/Delete */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.06] text-xs">
        <button
          type="button"
          onClick={() => onAddFunds(goal)}
          disabled={isCompleted}
          className="px-3 py-1.5 rounded-[10px] bg-[#0A84FF]/[0.15] hover:bg-[#0A84FF]/[0.25] text-[#0A84FF] hover:text-white font-semibold transition-all duration-150 border border-[#0A84FF]/30 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
        >
          <span>+</span> Add Funds
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(goal)}
            className="px-3 py-1.5 rounded-[10px] bg-white/[0.04] hover:bg-white/[0.08] text-[#8A93B5] hover:text-white font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(id)}
            className="px-3 py-1.5 rounded-[10px] bg-[#FF4D6A]/[0.10] hover:bg-[#FF4D6A]/[0.18] text-[#FF4D6A] font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF4D6A]"
          >
            Delete
          </button>
        </div>
      </div>
    </Card>
  );
}

