'use client';

import React from 'react';

/**
 * Savings Goal Card Component
 * Displays savings target, saved amount, remaining, progress %, and monthly required contribution
 */
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
    <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col justify-between backdrop-blur-md">
      <div>
        {/* Category & Status */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-full">
            {category || 'General'}
          </span>
          {isCompleted ? (
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              ✨ Achieved
            </span>
          ) : targetDate ? (
            <span className="text-xs text-slate-400">
              Target: {new Date(targetDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
            </span>
          ) : null}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-lg text-slate-100 mb-2">{title}</h3>

        {/* Amount Progress */}
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-2xl font-bold text-white">${currentAmount.toLocaleString()}</span>
          <span className="text-sm text-slate-400">Target: ${targetAmount.toLocaleString()}</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500" 
            style={{ width: `${Math.min(100, progressPercentage)}%` }}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950/50 border border-slate-800/60 mb-4 text-xs">
          <div>
            <div className="text-slate-500">Remaining</div>
            <div className="font-semibold text-slate-200">${remainingAmount.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-slate-500">Monthly Req.</div>
            <div className="font-semibold text-indigo-300">
              {requiredMonthlyContribution > 0 ? `$${requiredMonthlyContribution}/mo` : 'N/A'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
        <button
          onClick={() => onAddFunds(goal)}
          disabled={isCompleted}
          className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-medium transition disabled:opacity-40 disabled:pointer-events-none"
        >
          + Add Funds
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => onEdit(goal)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(id)}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
