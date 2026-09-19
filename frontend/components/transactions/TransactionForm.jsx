'use client';

import React, { useState, useEffect } from 'react';
import { Card, PrimaryButton, SecondaryButton, IconTile } from '../budget-goals/ThemeCard';

/**
 * Transaction Form (CryptoVault Fintech Theme)
 * - #0F1633 card surface with 16px radius and subtle border
 * - Inputs use #0B1029 surface with #0A84FF focus rings
 * - Expense/Income toggle pills with CryptoVault blue active state
 * - Neon green primary action button for income, blue for expense
 * - Auto-categorization badge in blue (#0A84FF)
 * - All business logic, auto-categorization, validation IDENTICAL to original
 */

const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Other Income'];
const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills',
  'Healthcare',
  'Education',
  'Travel',
  'Other'
];

const AUTO_KEYWORD_RULES = {
  swiggy: 'Food', zomato: 'Food', restaurant: 'Food', cafe: 'Food', food: 'Food', burger: 'Food', pizza: 'Food', starbucks: 'Food', kfc: 'Food', bakery: 'Food', blinkit: 'Food', instamart: 'Food', zepto: 'Food',
  uber: 'Transport', ola: 'Transport', rapido: 'Transport', fuel: 'Transport', taxi: 'Transport', petrol: 'Transport', diesel: 'Transport', metro: 'Transport', bus: 'Transport', auto: 'Transport',
  amazon: 'Shopping', flipkart: 'Shopping', myntra: 'Shopping', zara: 'Shopping', ajio: 'Shopping', shopping: 'Shopping', clothes: 'Shopping',
  netflix: 'Entertainment', spotify: 'Entertainment', youtube: 'Entertainment', movie: 'Entertainment', pvr: 'Entertainment', cinema: 'Entertainment', hotstar: 'Entertainment',
  electricity: 'Bills', water: 'Bills', internet: 'Bills', mobile: 'Bills', recharge: 'Bills', wifi: 'Bills', broadband: 'Bills', utility: 'Bills', bescom: 'Bills',
  hospital: 'Healthcare', pharmacy: 'Healthcare', medical: 'Healthcare', clinic: 'Healthcare', doctor: 'Healthcare', medicine: 'Healthcare', apollo: 'Healthcare',
  college: 'Education', course: 'Education', books: 'Education', university: 'Education', udemy: 'Education', tuition: 'Education',
  flight: 'Travel', hotel: 'Travel', train: 'Travel', airbnb: 'Travel', irctc: 'Travel', booking: 'Travel'
};

export default function TransactionForm({ onSubmit, initialData = null, onCancel = null, isSubmitting = false }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState('');
  const [isManualOverride, setIsManualOverride] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [errorMsg, setErrorMsg] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState('');

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'expense');
      setAmount(initialData.amount ? String(initialData.amount) : '');
      setDescription(initialData.description || '');
      setMerchant(initialData.merchant || '');
      setCategory(initialData.category || '');
      setIsManualOverride(true);
      setDate(initialData.date ? initialData.date.split('T')[0] : new Date().toISOString().split('T')[0]);
    } else {
      reset();
    }
  }, [initialData]);

  // Live auto-categorization detection
  useEffect(() => {
    if (type === 'expense' && description) {
      const lower = description.toLowerCase();
      let found = '';
      for (const [key, cat] of Object.entries(AUTO_KEYWORD_RULES)) {
        if (lower.includes(key)) {
          found = cat;
          break;
        }
      }
      setSuggestedCategory(found);
      if (!isManualOverride && found) {
        setCategory(found);
      }
    } else if (type === 'income' && description) {
      const lower = description.toLowerCase();
      let found = 'Other Income';
      if (lower.includes('salary') || lower.includes('payroll') || lower.includes('wages')) found = 'Salary';
      else if (lower.includes('freelance') || lower.includes('upwork') || lower.includes('client')) found = 'Freelance';
      setSuggestedCategory(found);
      if (!isManualOverride) {
        setCategory(found);
      }
    } else {
      setSuggestedCategory('');
    }
  }, [description, type, isManualOverride]);

  const reset = () => {
    setType('expense');
    setAmount('');
    setDescription('');
    setMerchant('');
    setCategory('');
    setIsManualOverride(false);
    setDate(new Date().toISOString().split('T')[0]);
    setErrorMsg('');
    setSuggestedCategory('');
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory('');
    setIsManualOverride(false);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setIsManualOverride(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Please enter a valid amount greater than ₹0');
      return;
    }

    if (!description || description.trim().length === 0) {
      setErrorMsg('Please provide a description');
      return;
    }

    const payload = {
      amount: numAmount,
      type,
      description: description.trim(),
      merchant: merchant.trim() || undefined,
      category: category.trim() || undefined,
      date
    };

    try {
      await onSubmit(payload);
      if (!initialData) {
        reset();
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save transaction');
    }
  };

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const isIncome = type === 'income';

  /* Input style reuse */
  const inputClass = "w-full px-4 py-2.5 rounded-[12px] bg-[#0B1029] border border-white/[0.08] text-white text-sm placeholder-[#8A93B5]/50 focus:outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/40 transition";
  const labelClass = "block text-xs font-semibold text-[#8A93B5] uppercase tracking-wider mb-1.5";

  return (
    <Card hover={false} className="mb-8 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className={`absolute -top-16 -right-16 w-44 h-44 rounded-full blur-[60px] pointer-events-none ${isIncome ? 'bg-[#22D36A]/[0.08]' : 'bg-[#0A84FF]/[0.08]'
        }`} />

      <div className="relative z-10">
        {/* Header: Title + Type Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <IconTile className={isIncome ? 'from-[#22D36A]/[0.22] to-[#39FF14]/[0.18]' : ''}>
              {initialData ? (
                <svg className="w-5 h-5 text-[#0A84FF]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
              ) : (
                <svg className="w-5 h-5 text-[#0A84FF]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
              )}
            </IconTile>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {initialData ? 'Modify Transaction' : 'Record Transaction'}
              </h3>
              <p className="text-xs text-[#8A93B5]">
                {initialData ? 'Update transaction details below' : 'Smart categorization with real-time feedback'}
              </p>
            </div>
          </div>

          {/* Expense / Income Toggle */}
          <div className="flex items-center p-1 rounded-[12px] bg-[#0B1029] border border-white/[0.06]">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`px-4 py-2 rounded-[10px] text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${!isIncome
                  ? 'bg-[#FF4D6A] text-white shadow-[0_0_16px_rgba(255,77,106,0.35)]'
                  : 'text-[#8A93B5] hover:text-white'
                }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="7" x2="17" y2="17" /><polyline points="17 7 17 17 7 17" /></svg>
              Expense
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`px-4 py-2 rounded-[10px] text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${isIncome
                  ? 'bg-[#22D36A] text-[#0A0E27] shadow-[0_0_16px_rgba(34,211,106,0.35)]'
                  : 'text-[#8A93B5] hover:text-white'
                }`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>
              Income
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-[12px] bg-[#FF4D6A]/[0.12] border border-[#FF4D6A]/30 text-[#FF4D6A] text-xs flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Amount + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Amount (₹) *</label>
              <div className="relative">
                <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-base ${isIncome ? 'text-[#22D36A]' : 'text-[#0A84FF]'}`}>
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className={`${inputClass} pl-8 !text-base !font-semibold`}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Row 2: Description + Merchant */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Description *</label>
              <input
                type="text"
                placeholder="e.g. Swiggy biryani, Uber to office, Salary"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Merchant / Payee (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Swiggy, Amazon, Uber, Employer"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          {/* Category with Auto-Suggestion */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-[#8A93B5] uppercase tracking-wider">Category</label>
              {suggestedCategory && !isManualOverride && (
                <span className="text-xs text-[#0A84FF] flex items-center gap-1">
                  <span>✨ Auto-suggested:</span>
                  <strong className="text-white">{suggestedCategory}</strong>
                </span>
              )}
              {isManualOverride && (
                <span className="text-xs text-[#1FB5A5]">
                  ✓ Manual Override Selected
                </span>
              )}
            </div>
            <select
              value={category}
              onChange={handleCategoryChange}
              className={inputClass}
            >
              <option value="" className="bg-[#0B1029] text-[#8A93B5]">-- Automatic Categorization --</option>
              {categories.map((c) => (
                <option key={c} value={c} className="bg-[#0B1029] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
            {onCancel && (
              <SecondaryButton onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </SecondaryButton>
            )}
            <PrimaryButton type="submit" disabled={isSubmitting} className={
              isIncome ? '' : '!bg-[#0A84FF] hover:!bg-[#0975e0] hover:!shadow-[0_0_24px_rgba(10,132,255,0.35)]'
            }>
              {isSubmitting ? (
                <span>Saving...</span>
              ) : initialData ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                  Update Transaction
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  Add Transaction
                </>
              )}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </Card>
  );
}

