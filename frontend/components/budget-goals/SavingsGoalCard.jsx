'use client';

import React, { useState } from 'react';
import { Card, IconTile } from './ThemeCard';
import { addSavingsProgress, deleteSavingsGoal } from '../../services/api/budget';

/**
 * SavingsGoalCard Component (CryptoVault Fintech Theme)
 * Renders individual savings goal card with progress bar, inline "+ Add funds" input, and delete option.
 */
export default function SavingsGoalCard({ goal, onUpdate }) {
  const {
    id,
    title = 'Savings Goal',
    target_amount = 0,
    targetAmount = target_amount,
    current_amount = 0,
    currentAmount = current_amount,
    target_date = null,
    targetDate = target_date,
    category = 'General',
  } = goal || {};

  const target = Number(targetAmount || 0);
  const current = Number(currentAmount || 0);
  const remaining = Math.max(0, target - current);
  const progressPercent = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;

  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addedAmount, setAddedAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddFundsSubmit = async (e) => {
    e.preventDefault();
    const val = Number(addedAmount);
    if (isNaN(val) || val <= 0) return;

    try {
      setIsSubmitting(true);
      await addSavingsProgress(id, val);
      setAddedAmount('');
      setShowAddFunds(false);
      if (onUpdate) await onUpdate();
    } catch (err) {
      console.error('Failed to add funds:', err);
      alert(err.message || 'Failed to add funds');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      setIsDeleting(true);
      await deleteSavingsGoal(id);
      if (onUpdate) await onUpdate();
    } catch (err) {
      console.error('Failed to delete goal:', err);
      alert(err.message || 'Failed to delete goal');
    } finally {
      setIsDeleting(false);
    }
  };

  const formattedTargetDate = targetDate
    ? new Date(targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <Card className="flex flex-col justify-between group">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3.5 min-w-0">
            <IconTile>
              <span className="text-xl" role="img" aria-label="goal icon">
                🎯
              </span>
            </IconTile>
            <div className="min-w-0">
              <h3 className="font-bold text-lg text-white truncate tracking-tight">
                {title}
              </h3>
              <p className="text-xs text-[#8A93B5] capitalize">
                {category} milestone
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 rounded-[8px] bg-white/[0.04] hover:bg-[#FF4D6A]/[0.15] text-[#8A93B5] hover:text-[#FF4D6A] transition-colors focus:outline-none"
            title="Delete Goal"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Amount Progress Stats */}
        <div className="flex items-baseline justify-between mb-2.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-[26px] font-bold text-white tracking-tight">
              ${current.toLocaleString()}
            </span>
            <span className="text-xs text-[#8A93B5]">
              / ${target.toLocaleString()}
            </span>
          </div>
          <span className="text-sm font-bold text-[#39FF14] tracking-tight">
            {progressPercent}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-[#0A84FF] via-[#22D36A] to-[#39FF14] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between text-xs text-[#8A93B5] mb-4">
          <span>
            {progressPercent >= 100 ? (
              <span className="text-[#39FF14] font-semibold">🎉 Target Achieved!</span>
            ) : (
              `$${remaining.toLocaleString()} remaining`
            )}
          </span>
          {formattedTargetDate && <span>Target: {formattedTargetDate}</span>}
        </div>
      </div>

      {/* Add Funds Action Row */}
      <div className="pt-3 border-t border-white/[0.06]">
        {showAddFunds ? (
          <form onSubmit={handleAddFundsSubmit} className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              step="any"
              placeholder="Amount $"
              value={addedAmount}
              onChange={(e) => setAddedAmount(e.target.value)}
              className="w-full px-3 py-1.5 rounded-[10px] bg-[#0B1029] border border-white/[0.12] text-white text-xs focus:outline-none focus:border-[#0A84FF]"
              autoFocus
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-3 py-1.5 rounded-[10px] bg-[#39FF14] text-[#0A0E27] font-semibold text-xs transition hover:brightness-110 flex-shrink-0"
            >
              {isSubmitting ? '...' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddFunds(false)}
              className="px-2 py-1.5 rounded-[10px] bg-white/[0.06] text-[#8A93B5] hover:text-white text-xs"
            >
              ✕
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setShowAddFunds(true)}
            className="w-full py-2 rounded-[10px] bg-white/[0.04] hover:bg-white/[0.08] text-[#0A84FF] hover:text-white font-medium text-xs transition flex items-center justify-center gap-1.5 border border-[#0A84FF]/20"
          >
            <span>+ Add funds</span>
          </button>
        )}
      </div>
    </Card>
  );
}
