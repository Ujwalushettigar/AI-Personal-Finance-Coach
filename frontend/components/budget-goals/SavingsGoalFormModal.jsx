'use client';

import React, { useState, useEffect } from 'react';
import { PrimaryButton, SecondaryButton } from './ThemeCard';
import { createSavingsGoal } from '../../services/api/budget';

/**
 * SavingsGoalFormModal Component (CryptoVault Fintech Theme)
 * Modal form for creating a new savings goal milestone
 */
export default function SavingsGoalFormModal({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setTargetAmount('');
      setTargetDate('');
      setCategory('');
      setError('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Please enter a goal title.');
      return;
    }

    const numAmount = Number(targetAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Target amount must be a positive number greater than 0.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        title: trimmedTitle,
        target_amount: numAmount,
        target_date: targetDate || null,
        category: category.trim() || undefined,
      };

      await createSavingsGoal(payload);
      if (onSuccess) await onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create savings goal. Please try again.');
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
            <h2 className="text-xl font-bold text-white tracking-tight">
              New Savings Goal
            </h2>
            <p className="text-xs text-[#8A93B5] mt-0.5">
              Set a capital target and timeline milestone
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

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 rounded-[12px] bg-[#FF4D6A]/[0.12] border border-[#FF4D6A]/30 text-[#FF4D6A] text-xs flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#8A93B5] uppercase tracking-wider mb-1.5">
              Goal Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Emergency Reserve, Vacation Fund"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-[12px] bg-[#0B1029] border border-white/[0.08] text-white text-sm placeholder-[#8A93B5]/50 focus:outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/40 transition"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8A93B5] uppercase tracking-wider mb-1.5">
              Target Amount ($) *
            </label>
            <input
              type="number"
              required
              min="1"
              step="any"
              placeholder="5000"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full px-4 py-2.5 rounded-[12px] bg-[#0B1029] border border-white/[0.08] text-white text-sm placeholder-[#8A93B5]/50 focus:outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/40 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8A93B5] uppercase tracking-wider mb-1.5">
              Target Date (Optional)
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-[12px] bg-[#0B1029] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/40 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8A93B5] uppercase tracking-wider mb-1.5">
              Category (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Savings, Travel, Investment"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-[12px] bg-[#0B1029] border border-white/[0.08] text-white text-sm placeholder-[#8A93B5]/50 focus:outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/40 transition"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/[0.06]">
            <SecondaryButton onClick={onClose} disabled={isSubmitting}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Savings Goal'}
            </PrimaryButton>
          </div>
        </form>

      </div>
    </div>
  );
}
