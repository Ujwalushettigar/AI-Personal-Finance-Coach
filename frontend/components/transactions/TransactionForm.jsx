'use client';

import React, { useState, useEffect } from 'react';

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
    <div
      style={{
        background: 'rgba(17, 24, 39, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '24px 28px',
        boxShadow: isIncome
          ? '0 20px 40px -15px rgba(16, 185, 129, 0.15), 0 0 0 1px rgba(16, 185, 129, 0.2)'
          : '0 20px 40px -15px rgba(99, 102, 241, 0.18), 0 0 0 1px rgba(99, 102, 241, 0.2)',
        marginBottom: '32px',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle background glow */}
      <div
        style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: isIncome ? 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: isIncome
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(5, 150, 105, 0.15))'
                : 'linear-gradient(135deg, rgba(99, 102, 241, 0.25), rgba(79, 70, 229, 0.15))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isIncome ? '#34d399' : '#818cf8',
              border: isIncome ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(99, 102, 241, 0.3)'
            }}
          >
            {initialData ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            )}
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#f8fafc', letterSpacing: '-0.02em' }}>
              {initialData ? 'Modify Transaction' : 'Record Transaction'}
            </h3>
            <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
              {initialData ? 'Update transaction details below' : 'Smart categorization with real-time feedback'}
            </p>
          </div>
        </div>

        {/* Expense vs Income Animated Pill Toggle */}
        <div
          style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: 'none',
              background: !isIncome ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'transparent',
              color: !isIncome ? '#ffffff' : '#94a3b8',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: !isIncome ? '0 4px 12px rgba(239, 68, 68, 0.35)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="7" x2="17" y2="17"/><polyline points="17 7 17 17 7 17"/></svg>
            Expense
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            style={{
              padding: '7px 16px',
              borderRadius: '8px',
              border: 'none',
              background: isIncome ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
              color: isIncome ? '#ffffff' : '#94a3b8',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: isIncome ? '0 4px 12px rgba(16, 185, 129, 0.35)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            Income
          </button>
        </div>
      </div>

      {errorMsg && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '13px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          {/* Amount Field */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Amount (₹) *
            </label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: isIncome ? '#34d399' : '#818cf8', fontWeight: '700', fontSize: '16px' }}>
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
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 34px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#f8fafc',
                  fontSize: '16px',
                  fontWeight: '600',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
              />
            </div>
          </div>

          {/* Date Field */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Date *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#f8fafc',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          {/* Description Field */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Description *
            </label>
            <input
              type="text"
              placeholder="e.g. Swiggy biryani, Uber to office, Salary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#f8fafc',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Merchant Field */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Merchant / Payee (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Swiggy, Amazon, Uber, Employer"
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#f8fafc',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Category Field with Auto-Suggestion badge */}
        <div style={{ marginBottom: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Category
            </label>
            {suggestedCategory && !isManualOverride && (
              <span style={{ fontSize: '12px', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>✨ Auto-suggested:</span>
                <strong style={{ color: '#c7d2fe' }}>{suggestedCategory}</strong>
              </span>
            )}
            {isManualOverride && (
              <span style={{ fontSize: '12px', color: '#38bdf8' }}>
                ✓ Manual Override Selected
              </span>
            )}
          </div>
          <select
            value={category}
            onChange={handleCategoryChange}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: '12px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#f8fafc',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          >
            <option value="" style={{ background: '#0f172a', color: '#94a3b8' }}>
              -- Automatic Categorization --
            </option>
            {categories.map((c) => (
              <option key={c} value={c} style={{ background: '#0f172a', color: '#f8fafc' }}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              style={{
                padding: '11px 20px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#94a3b8',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              padding: '12px 28px',
              borderRadius: '12px',
              border: 'none',
              background: isIncome
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #3b82f6 100%)',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '700',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              boxShadow: isIncome
                ? '0 8px 24px -6px rgba(16, 185, 129, 0.5)'
                : '0 8px 24px -6px rgba(99, 102, 241, 0.5)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
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
    </div>
  );
}
