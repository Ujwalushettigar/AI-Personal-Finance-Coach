'use client';

import React from 'react';
import { Card, IconTile } from '../budget-goals/ThemeCard';

/**
 * Transaction List (CryptoVault Fintech Theme)
 * - Each transaction row is a feature card with icon tile + description + amount
 * - Category badge pills with semantic colors
 * - Income in green (#22D36A), expense in red (#FF4D6A) — with text labels for accessibility
 * - Edit/Delete action buttons with focus rings
 * - Hover lift effect matching other CryptoVault cards
 */

const CATEGORY_META = {
  Food: { emoji: '🍔', color: '#F5A524' },
  Transport: { emoji: '🚕', color: '#0A84FF' },
  Shopping: { emoji: '🛒', color: '#FF4D6A' },
  Entertainment: { emoji: '🎬', color: '#1FB5A5' },
  Bills: { emoji: '⚡', color: '#F5A524' },
  Healthcare: { emoji: '💊', color: '#22D36A' },
  Education: { emoji: '📚', color: '#0A84FF' },
  Travel: { emoji: '✈️', color: '#1FB5A5' },
  Salary: { emoji: '💼', color: '#22D36A' },
  Freelance: { emoji: '💻', color: '#39FF14' },
  'Other Income': { emoji: '💰', color: '#F5A524' },
  Other: { emoji: '🏷️', color: '#8A93B5' }
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
          <Card
            key={tx.id || idx}
            className="flex items-center justify-between gap-4 group"
          >
            {/* Left section: Category Icon + Description + Date */}
            <div className="flex items-center gap-4 flex-1 min-w-[200px]">
              <div
                className="w-11 h-11 rounded-[12px] flex items-center justify-center text-xl flex-shrink-0 border"
                style={{
                  background: `${meta.color}18`,
                  borderColor: `${meta.color}40`
                }}
              >
                {meta.emoji}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-semibold text-[15px] text-white tracking-tight truncate">
                    {tx.description}
                  </span>
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-[6px] border tracking-wide"
                    style={{
                      background: `${meta.color}18`,
                      color: meta.color,
                      borderColor: `${meta.color}40`
                    }}
                  >
                    {tx.category || 'Other'}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 mt-1 text-xs text-[#8A93B5]">
                  <span>{formatDate(tx.date)}</span>
                  {tx.merchant && (
                    <>
                      <span>•</span>
                      <span className="text-[#8A93B5]">{tx.merchant}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right section: Amount + Edit/Delete Actions */}
            <div className="flex items-center gap-4">
              <div className={`text-right font-bold text-[17px] tracking-tight ${
                isIncome ? 'text-[#22D36A]' : 'text-[#FF4D6A]'
              }`}>
                {isIncome ? '+' : '-'}{formatCurrency(parseFloat(tx.amount))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  title="Edit transaction"
                  onClick={() => onEdit(tx)}
                  className="w-8 h-8 rounded-[8px] border border-white/[0.08] bg-white/[0.04] hover:bg-[#0A84FF]/20 text-[#8A93B5] hover:text-[#0A84FF] flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </button>

                <button
                  type="button"
                  title="Delete transaction"
                  onClick={() => onDelete(tx.id)}
                  className="w-8 h-8 rounded-[8px] border border-[#FF4D6A]/20 bg-[#FF4D6A]/[0.08] hover:bg-[#FF4D6A]/25 text-[#FF4D6A] flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF4D6A]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

