'use client';

import React, { useState, useEffect } from 'react';
import { PrimaryButton, SecondaryButton } from './ThemeCard';

/**
 * Budget Form Modal Component (CryptoVault Fintech Theme)
 * - Elevated #0F1633 card with 1px border and 16px radius
 * - Inputs styled with #0B1029 surface and #0A84FF focus rings
 * - Neon green (#39FF14) primary action button with dark text (#0A0E27)
 */
export default function BudgetFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [category, setCategory] = useState('');
  const [amountLimit, setAmountLimit] = useState('');
  const [spent, setSpent] = useState('0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category || '');
      setAmountLimit(initialData.amountLimit !== undefined ? String(initialData.amountLimit) : '');
      setSpent(initialData.spent !== undefined ? String(initialData.spent) : '0');
    } else {
      setCategory('');
      setAmountLimit('');
      setSpent('0');
    }
    setValidationError('');
    setIsSubmitting(false);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    const trimmedCat = category.trim();
    if (!trimmedCat) {
      setValidationError('Please enter a category name.');
      return;
    }

    const limitNum = Number(amountLimit);
    if (isNaN(limitNum) || limitNum <= 0) {
      setValidationError('Monthly limit must be a positive number greater than 0.');
      return;
    }

    const spentNum = Number(spent);
    if (isNaN(spentNum) || spentNum < 0) {
      setValidationError('Current spent amount must be 0 or greater.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        category: trimmedCat,
        amountLimit: limitNum,
        spent: spentNum
      });
      onClose();
    } catch (err) {
      setValidationError(err.message || 'Failed to save budget. Please try again.');
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
              {initialData ? 'Edit Budget Allocation' : 'Create Budget Allocation'}
            </h2>
            <p className="text-xs text-[#8A93B5] mt-0.5">
              Define spending threshold for this category
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
              Category Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Groceries, Cloud Services, Dining"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-[12px] bg-[#0B1029] border border-white/[0.08] text-white text-sm placeholder-[#8A93B5]/50 focus:outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/40 transition"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8A93B5] uppercase tracking-wider mb-1.5">
              Monthly Budget Ceiling ($)
            </label>
            <input
              type="number"
              required
              min="1"
              step="any"
              placeholder="600"
              value={amountLimit}
              onChange={(e) => setAmountLimit(e.target.value)}
              className="w-full px-4 py-2.5 rounded-[12px] bg-[#0B1029] border border-white/[0.08] text-white text-sm placeholder-[#8A93B5]/50 focus:outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/40 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#8A93B5] uppercase tracking-wider mb-1.5">
              Current Spent Amount ($)
            </label>
            <input
              type="number"
              min="0"
              step="any"
              placeholder="0"
              value={spent}
              onChange={(e) => setSpent(e.target.value)}
              className="w-full px-4 py-2.5 rounded-[12px] bg-[#0B1029] border border-white/[0.08] text-white text-sm placeholder-[#8A93B5]/50 focus:outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/40 transition"
            />
            <p className="text-[11px] text-[#8A93B5] mt-1.5">
              Starting or current billing cycle outflow recorded for this category.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/[0.06]">
            <SecondaryButton onClick={onClose} disabled={isSubmitting}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Confirm Allocation'}
            </PrimaryButton>
          </div>
        </form>

      </div>
    </div>
  );
}

