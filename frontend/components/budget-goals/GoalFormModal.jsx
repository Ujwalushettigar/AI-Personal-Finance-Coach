'use client';

import React, { useState, useEffect } from 'react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 rounded-2xl bg-[#0A0E1A] border border-border shadow-2xl text-text-primary">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-border">
          <h2 className="text-xl font-bold text-text-primary">
            {mode === 'addFunds' 
              ? `Add Funds: ${initialData?.title}`
              : initialData ? 'Edit Savings Goal' : 'Create Savings Goal'}
          </h2>
          <button 
            onClick={onClose} 
            className="text-text-muted hover:text-text-primary transition"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'addFunds' ? (
            <div>
              <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                Deposit Amount (₹)
              </label>
              <input 
                type="number"
                required
                min="1"
                step="any"
                placeholder="100"
                value={addFundsAmount}
                onChange={(e) => setAddFundsAmount(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-text-primary placeholder-slate-500 focus:outline-none focus:border-accent transition"
                autoFocus
              />
              <p className="mt-2 text-xs text-text-muted">
                Current Saved: ₹{initialData?.currentAmount?.toLocaleString()} / ₹{initialData?.targetAmount?.toLocaleString()}
              </p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                  Goal Title
                </label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Emergency Fund, New Car"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-text-primary placeholder-slate-500 focus:outline-none focus:border-accent transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                  Target Amount (₹)
                </label>
                <input 
                  type="number"
                  required
                  min="1"
                  step="any"
                  placeholder="5000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-text-primary placeholder-slate-500 focus:outline-none focus:border-accent transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                    Initial Saved (₹)
                  </label>
                  <input 
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-text-primary placeholder-slate-500 focus:outline-none focus:border-accent transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <input 
                    type="text"
                    placeholder="Emergency, Tech"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-text-primary placeholder-slate-500 focus:outline-none focus:border-accent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
                  Target Completion Date (Optional)
                </label>
                <input 
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-border text-text-primary focus:outline-none focus:border-accent transition"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-border text-text-muted font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-xl font-bold text-sm shadow-md transition ${
                mode === 'addFunds'
                  ? 'bg-positive text-[#0A0E1A]'
                  : 'bg-accent text-[#0A0E1A]'
              }`}
            >
              {mode === 'addFunds' ? 'Deposit Funds' : initialData ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

