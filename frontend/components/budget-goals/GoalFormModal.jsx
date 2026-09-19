'use client';

import React, { useState, useEffect } from 'react';
import { PrimaryButton, SecondaryButton } from './ThemeCard';

/**
 * Savings Goal Form Modal Component (CryptoVault Fintech Theme)
 * - #0F1633 surface, 16px radius, #0B1029 nested input fields
 * - Handles both Goal Creation/Edit and 'addFunds' deposit workflow
 * - Neon green primary action button with dark text
 */
export default function GoalFormModal({ isOpen, onClose, onSubmit, initialData = null, mode = 'create' }) {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('0');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('General');
  const [addFundsAmount, setAddFundsAmount] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setTargetAmount(initialData.targetAmount || '');
      setCurrentAmount(initialData.currentAmount !== undefined ? String(initialData.currentAmount) : '0');
      setTargetDate(initialData.targetDate ? initialData.targetDate.split('T')[0] : '');
      setCategory(initialData.category || 'General');
    } else {
      setTitle('');
      setTargetAmount('');
      setCurrentAmount('0');
      setTargetDate('');
      setCategory('General');
    }
    setAddFundsAmount('');
  }, [initialData, isOpen, mode]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === 'addFunds') {
      const added = Number(addFundsAmount);
      if (!added || added <= 0) return;
      onSubmit({
        ...initialData,
        currentAmount: (Number(initialData.currentAmount) || 0) + added
      });
      onClose();
      return;
    }

    if (!title.trim() || !targetAmount || Number(targetAmount) <= 0) return;

    onSubmit({
      title: title.trim(),
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount) || 0,
      targetDate: targetDate || null,
      category: category.trim() || 'General'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0E27]/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md p-6 sm:p-7 rounded-[16px] bg-[#0F1633] border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white">

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.06]">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {mode === 'addFunds'
                ? `Deposit to: ${initialData?.title}`
                : initialData ? 'Edit Savings Target' : 'Create Savings Target'}
            </h2>
            <p className="text-xs text-[#8A93B5] mt-0.5">
              {mode === 'addFunds'
                ? 'Allocate capital directly toward this goal'
                : 'Define target milestone and projected timeline'}
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

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'addFunds' ? (
            <div>
              <label className="block text-xs font-semibold text-[#8A93B5] uppercase tracking-wider mb-1.5">
                Deposit Amount ($)
              </label>
              <input
                type="number"
                required
                min="1"
                step="any"
                placeholder="100"
                value={addFundsAmount}
                onChange={(e) => setAddFundsAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-[12px] bg-[#0B1029] border border-white/[0.08] text-white text-base placeholder-[#8A93B5]/50 focus:outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/40 transition"
                autoFocus
              />
              <p className="mt-2 text-xs text-[#8A93B5]">
                Current Progress: <strong className="text-white">${Number(initialData?.currentAmount || 0).toLocaleString()}</strong> of ${Number(initialData?.targetAmount || 0).toLocaleString()}
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#8A93B5] uppercase tracking-wider mb-1.5">
                  Goal Identifier
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cold Storage Reserve, Emergency Fund"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-[12px] bg-[#0B1029] border border-white/[0.08] text-white text-sm placeholder-[#8A93B5]/50 focus:outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/40 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A93B5] uppercase tracking-wider mb-1.5">
                  Target Amount ($)
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#8A93B5] uppercase tracking-wider mb-1.5">
                    Initial Balance ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-[12px] bg-[#0B1029] border border-white/[0.08] text-white text-sm placeholder-[#8A93B5]/50 focus:outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/40 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#8A93B5] uppercase tracking-wider mb-1.5">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    placeholder="Emergency, Assets"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-[12px] bg-[#0B1029] border border-white/[0.08] text-white text-sm placeholder-[#8A93B5]/50 focus:outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/40 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#8A93B5] uppercase tracking-wider mb-1.5">
                  Target Completion Date (Optional)
                </label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-[12px] bg-[#0B1029] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/40 transition"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/[0.06]">
            <SecondaryButton onClick={onClose}>
              Cancel
            </SecondaryButton>
            <PrimaryButton type="submit">
              {mode === 'addFunds' ? 'Deposit Funds' : initialData ? 'Save Changes' : 'Create Goal'}
            </PrimaryButton>
          </div>
        </form>

      </div>
    </div>
  );
}

