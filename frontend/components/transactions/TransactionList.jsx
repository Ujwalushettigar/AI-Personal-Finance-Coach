'use client';

import React from 'react';
import GlassCard from '../common/GlassCard';

const CATEGORY_META = {
  Food: { emoji: '🍔', color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)', border: 'rgba(249, 115, 22, 0.25)' },
  Transport: { emoji: '🚕', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.25)' },
  Shopping: { emoji: '🛒', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)', border: 'rgba(236, 72, 153, 0.25)' },
  Entertainment: { emoji: '🎬', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)', border: 'rgba(168, 85, 247, 0.25)' },
  Bills: { emoji: '⚡', color: '#eab308', bg: 'rgba(234, 179, 8, 0.12)', border: 'rgba(234, 179, 8, 0.25)' },
  Healthcare: { emoji: '💊', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.25)' },
  Education: { emoji: '📚', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.12)', border: 'rgba(99, 102, 241, 0.25)' },
  Travel: { emoji: '✈️', color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.12)', border: 'rgba(20, 184, 166, 0.25)' },
  Salary: { emoji: '💼', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.25)' },
  Freelance: { emoji: '💻', color: '#34d399', bg: 'rgba(52, 211, 153, 0.12)', border: 'rgba(52, 211, 153, 0.25)' },
  'Other Income': { emoji: '💰', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)' },
  Other: { emoji: '🏷️', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)', border: 'rgba(148, 163, 184, 0.25)' }
};

export default function TransactionList({ transactions = [], onEdit, onDelete }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {transactions.map((tx, idx) => {
        const meta = CATEGORY_META[tx.category] || CATEGORY_META.Other;
        const isIncome = tx.type === 'income';

        return (
          <GlassCard
            key={tx.id || idx}
            className="p-4 flex items-center justify-between gap-4 transition-all hover:-translate-y-0.5"
          >
            {/* Left section: Category Icon + Description + Date */}
            <div className="flex items-center gap-4 flex-1 min-w-[200px]">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 border"
                style={{
                  background: meta.bg,
                  borderColor: meta.border
                }}
              >
                {meta.emoji}
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-semibold text-sm text-text-primary">
                    {tx.description}
                  </span>
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-md border"
                    style={{
                      background: meta.bg,
                      color: meta.color,
                      borderColor: meta.border
                    }}
                  >
                    {tx.category || 'Other'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
                  <span>{formatDate(tx.date)}</span>
                  {tx.merchant && (
                    <>
                      <span>•</span>
                      <span>{tx.merchant}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right section: Amount + Edit/Delete Actions */}
            <div className="flex items-center gap-4">
              <div
                className={`text-right font-bold text-base ${
                  isIncome ? 'text-positive' : 'text-negative'
                }`}
              >
                {isIncome ? '+' : '-'}{formatCurrency(parseFloat(tx.amount))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  title="Edit transaction"
                  onClick={() => onEdit(tx)}
                  className="w-8 h-8 rounded-lg border border-border bg-white/5 text-text-muted hover:text-accent hover:bg-accent/10 hover:border-accent/30 flex items-center justify-center transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>

                <button
                  type="button"
                  title="Delete transaction"
                  onClick={() => onDelete(tx.id)}
                  className="w-8 h-8 rounded-lg border border-negative/20 bg-negative/10 text-negative hover:bg-negative/20 flex items-center justify-center transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}

