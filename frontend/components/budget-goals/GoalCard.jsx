'use client';

import React from 'react';
import GlassCard from '../common/GlassCard';

export default function GoalCard({ goal, onEdit, onDelete, onAddFunds }) {
  const { 
    id, 
    title, 
    targetAmount, 
    currentAmount, 
    remainingAmount, 
    progressPercentage, 
    targetDate, 
    requiredMonthlyContribution, 
    category 
  } = goal;

  const isCompleted = progressPercentage >= 100;

  return (
    <GlassCard className="p-5 flex flex-col justify-between">
      <div>
        {/* Category & Status */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-accent/10 border border-accent/20 px-2.5 py-0.5 rounded-full">
            {category || 'General'}
          </span>
          {isCompleted ? (
            <span className="text-xs font-bold text-positive bg-positive/10 border border-positive/20 px-2.5 py-0.5 rounded-full">
              ✨ Achieved
            </span>
          ) : targetDate ? (
            <span className="text-xs text-text-muted">
              Target: {new Date(targetDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
            </span>
          ) : null}
        </div>

        {/* Title */}
        <h3 className="font-bold text-lg text-text-primary mb-2">{title}</h3>

        {/* Amount Progress */}
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-2xl font-bold text-text-primary">₹{currentAmount.toLocaleString()}</span>
          <span className="text-sm text-text-muted">Target: ₹{targetAmount.toLocaleString()}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-gradient-to-r from-accent to-positive transition-all duration-500" 
            style={{ width: `${Math.min(100, progressPercentage)}%` }}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white/5 border border-border mb-4 text-xs">
          <div>
            <div className="text-text-muted">Remaining</div>
            <div className="font-semibold text-text-primary">₹{remainingAmount.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-text-muted">Monthly Req.</div>
            <div className="font-semibold text-accent">
              {requiredMonthlyContribution > 0 ? `₹${requiredMonthlyContribution}/mo` : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-border text-xs">
        <button
          onClick={() => onAddFunds(goal)}
          disabled={isCompleted}
          className="px-3 py-1.5 rounded-lg bg-positive/10 hover:bg-positive/20 text-positive font-medium transition disabled:opacity-40 disabled:pointer-events-none border border-positive/20"
        >
          + Add Funds
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEdit(goal)}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-muted hover:text-text-primary font-medium transition border border-border"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(id)}
            className="px-3 py-1.5 rounded-lg bg-negative/10 hover:bg-negative/20 text-negative font-medium transition border border-negative/20"
          >
            Delete
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

