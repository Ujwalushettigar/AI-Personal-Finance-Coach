'use client';

import React, { useState, useEffect } from 'react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md p-6 rounded-2xl bg-[#0A0E1A] border border-border shadow-2xl text-text-primary">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-border">
          <h2 className="text-lg font-bold text-text-primary tracking-tight">
            {initialData ? 'Edit Category Budget' : 'Create Category Budget'}
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-text-muted hover:text-text-primary flex items-center justify-center transition text-sm"
          >
            ✕
          </button>
        </div>

        {/* Validation Error Banner */}
        {validationError && (
          <div className="mb-4 p-3 rounded-xl bg-negative/10 border border-negative/20 text-negative text-xs flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0 text-negative" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{validationError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              Category Name
            </label>
            <input 
              type="text"
              required
              placeholder="e.g. Groceries, Dining, Transport"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-border text-text-primary text-sm placeholder-slate-500 focus:outline-none focus:border-accent transition"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              Monthly Budget Limit (₹)
            </label>
            <input 
              type="number"
              required
              min="1"
              step="any"
              placeholder="600"
              value={amountLimit}
              onChange={(e) => setAmountLimit(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-border text-text-primary text-sm placeholder-slate-500 focus:outline-none focus:border-accent transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-1.5">
              Current Spent Amount (₹)
            </label>
            <input 
              type="number"
              min="0"
              step="any"
              placeholder="0"
              value={spent}
              onChange={(e) => setSpent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-border text-text-primary text-sm placeholder-slate-500 focus:outline-none focus:border-accent transition"
            />
            <p className="text-[11px] text-text-muted mt-1">
              Initial or current cycle expenditure for this category.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-border text-text-muted text-xs font-medium transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-accent text-[#0A0E1A] text-xs font-bold shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Saving...
                </>
              ) : (
                initialData ? 'Save Changes' : 'Create Budget'
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

