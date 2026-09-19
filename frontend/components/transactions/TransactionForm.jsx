'use client';

import React, { useState, useEffect } from 'react';
import GlassCard from '../common/GlassCard';

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

  return (
    <GlassCard className="mb-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              isIncome
                ? 'bg-positive/10 border-positive/30 text-positive'
                : 'bg-accent/10 border-accent/30 text-accent'
            }`}
          >
            {initialData ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary">
              {initialData ? 'Modify Transaction' : 'Record Transaction'}
            </h3>
            <p className="text-xs text-text-muted">
              {initialData ? 'Update transaction details below' : 'Smart categorization with real-time feedback'}
            </p>
          </div>
        </div>

        {/* Expense vs Income Toggle */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-border">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              !isIncome
                ? 'bg-negative text-white font-bold shadow-md'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="7" x2="17" y2="17"/><polyline points="17 7 17 17 7 17"/></svg>
            Expense
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              isIncome
                ? 'bg-positive text-[#0A0E1A] font-bold shadow-md'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            Income
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-negative/10 border border-negative/30 text-negative px-4 py-2.5 rounded-xl text-xs mb-4 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Amount Field */}
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
              Amount (₹) *
            </label>
            <div className="relative">
              <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-base ${isIncome ? 'text-positive' : 'text-accent'}`}>
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
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-white/5 border border-border text-text-primary text-sm font-semibold outline-none focus:border-accent transition-colors"
              />
            </div>
          </div>

          {/* Date Field */}
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-text-primary text-sm outline-none focus:border-accent transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Description Field */}
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
              Description *
            </label>
            <input
              type="text"
              placeholder="e.g. Swiggy biryani, Uber to office, Salary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-text-primary text-sm outline-none focus:border-accent transition-colors placeholder-slate-500"
            />
          </div>

          {/* Merchant Field */}
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wider">
              Merchant / Payee (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Swiggy, Amazon, Uber, Employer"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-text-primary text-sm outline-none focus:border-accent transition-colors placeholder-slate-500"
            />
          </div>
        </div>

        {/* Category Field */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Category
            </label>
            {suggestedCategory && !isManualOverride && (
              <span className="text-xs text-accent flex items-center gap-1">
                <span>✨ Auto-suggested:</span>
                <strong className="text-text-primary">{suggestedCategory}</strong>
              </span>
            )}
            {isManualOverride && (
              <span className="text-xs text-accent-2">
                ✓ Manual Override Selected
              </span>
            )}
          </div>
          <select
            value={category}
            onChange={handleCategoryChange}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-text-primary text-sm outline-none focus:border-accent transition-colors"
          >
            <option value="" className="bg-[#0A0E1A] text-text-muted">
              -- Automatic Categorization --
            </option>
            {categories.map((c) => (
              <option key={c} value={c} className="bg-[#0A0E1A] text-text-primary">
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-border bg-white/5 text-text-muted hover:text-text-primary text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg ${
              isIncome
                ? 'bg-positive text-[#0A0E1A] hover:bg-positive/90'
                : 'bg-accent text-[#0A0E1A] hover:bg-accent/90'
            } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : initialData ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Update Transaction
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Transaction
              </>
            )}
          </button>
        </div>
      </form>
    </GlassCard>
  );
}
