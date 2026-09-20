'use client';

import React, { useState, useEffect } from 'react';
import { createTransaction } from '../../services/api/transactions';
import { PrimaryButton, SecondaryButton } from './ThemeCard';

/**
 * Log Spend Modal Component (CryptoVault Fintech Theme)
 * Allows users to log an expense directly against a budget category.
 */
export default function LogSpendModal({ isOpen, onClose, category, onSuccess }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setDescription('');
      // Default to today's date formatted as YYYY-MM-DD
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
      setValidationError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setValidationError('Please enter a valid expense amount greater than $0.');
      return;
    }

    if (!date) {
      setValidationError('Please select a transaction date.');
      return;
    }

    try {
      setIsSubmitting(true);
      const descTrimmed = description.trim();
      await createTransaction({
        amount: numAmount,
        type: 'expense',
        category: category || 'Uncategorized',
        merchant: descTrimmed || 'Manual budget entry',
        description: descTrimmed || '',
        date: date,
      });

      if (onSuccess) {
        await onSuccess();
      }
      onClose();
    } catch (err) {
      console.error('Failed to log spend transaction:', err);
      setValidationError(err.message || 'Failed to record expense. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0E27]/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md p-6 sm:p-7 rounded-[16px] bg-[#0F1633] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.06]">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>Log Expense</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#39FF14]/[0.15] text-[#39FF14] border border-[#39FF14]/30 font-semibold uppercase tracking-wider">
                {category || 'Category'}
              </span>
            </h2>
            <p className="text-xs text-[#8A93B5] mt-0.5">
              Record a new outflow transaction against this budget limit
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-[10px] bg-white/[0.04] hover:bg-white/[0.08] text-[#8A93B5] hover:text-white flex items-center justify-center transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
          >
            ✕
          </button>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="mb-4 p-3 rounded-[12px] bg-[#FF4D6A]/[0.12] border border-[#FF4D6A]/30 text-[#FF4D6A] text-xs flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#8A93B5] uppercase tracking-wider mb-1.5">
              Category
            </label>
            <input
              type="text"
              value={category || ''}
              disabled
              className="w-full px-4 py-2.5 rounded-[12px] bg-white/[0.04] border border-white/[0.06] text-[#8A93B5] text-sm font-semibold cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8A93B5] uppercase tracking-wider mb-1.5">
              Amount ($) *
            </label>
            <input
              type="number"
              required
              min="0.01"
              step="any"
              placeholder="e.g. 45.50"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-[12px] bg-[#0B1029] border border-white/[0.08] text-white text-sm placeholder-[#8A93B5]/50 focus:outline-none focus:border-[#39FF14] focus:ring-2 focus:ring-[#39FF14]/40 transition"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8A93B5] uppercase tracking-wider mb-1.5">
              Description / Merchant (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Weekly grocery run, Coffee, Invoice"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-[12px] bg-[#0B1029] border border-white/[0.08] text-white text-sm placeholder-[#8A93B5]/50 focus:outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/40 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8A93B5] uppercase tracking-wider mb-1.5">
              Transaction Date *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-[12px] bg-[#0B1029] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/40 transition"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/[0.06]">
            <SecondaryButton onClick={onClose} disabled={isSubmitting}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Logging...' : 'Record Spend'}
            </PrimaryButton>
          </div>
        </form>

      </div>
    </div>
  );
}
