'use client';

import React from 'react';
import GlassCard from '../common/GlassCard';

const CATEGORY_OPTIONS = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Bills',
  'Healthcare',
  'Education',
  'Travel',
  'Salary',
  'Freelance',
  'Other Income',
  'Other'
];

export default function TransactionFilters({ filters, onFilterChange, onReset }) {
  const handleChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Boolean(filters.search || filters.type || filters.category);

  return (
    <GlassCard className="p-4 mb-6 flex flex-wrap gap-3 items-center justify-between">
      <div className="flex flex-wrap gap-3 flex-1 min-w-[300px]">
        {/* Search Input with Icon */}
        <div className="flex-1 min-w-[220px] relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted flex">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input
            type="text"
            placeholder="Search transactions, merchants..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-border text-text-primary text-xs placeholder-slate-500 focus:border-accent focus:outline-none"
          />
        </div>

        {/* Type Toggle Pills */}
        <div className="flex bg-white/5 p-1 rounded-xl border border-border">
          {[
            { label: 'All', value: '' },
            { label: 'Expenses', value: 'expense' },
            { label: 'Income', value: 'income' }
          ].map((item) => {
            const active = (filters.type || '') === item.value;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => handleChange('type', item.value)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? 'bg-accent text-[#0A0E1A] font-bold shadow-sm'
                    : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Category Dropdown */}
        <div className="w-40">
          <select
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-border text-text-primary text-xs focus:border-accent focus:outline-none"
          >
            <option value="" className="bg-[#070A14] text-text-muted">All Categories</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c} className="bg-[#070A14] text-text-primary">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onReset}
          className="px-3 py-1.5 rounded-lg border border-border bg-white/5 text-text-muted hover:text-text-primary text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Clear Filters
        </button>
      )}
    </GlassCard>
  );
}
