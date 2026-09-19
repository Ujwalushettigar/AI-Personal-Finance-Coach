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

/**
 * Transaction Filters (CryptoVault Fintech Theme)
 * - #0F1633 card background, 16px radius, subtle border
 * - Search input with #0B1029 surface and blue focus ring
 * - Toggle pills with #0A84FF active state
 * - Category dropdown with dark surface
 */
export default function TransactionFilters({ filters, onFilterChange, onReset }) {
  const handleChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = Boolean(filters.search || filters.type || filters.category);

  return (
    <div className="bg-[#0F1633] border border-white/[0.06] rounded-[16px] p-4 sm:p-5 mb-6 flex flex-wrap gap-3 items-center justify-between">
      <div className="flex flex-wrap gap-3 flex-1 min-w-[300px]">
        {/* Search Input with Icon */}
        <div className="flex-1 min-w-[220px] relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A93B5] flex">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </span>
          <input
            type="text"
            placeholder="Search transactions, merchants..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full py-2.5 px-3.5 pl-9 rounded-[12px] bg-[#0B1029] border border-white/[0.08] text-white text-sm placeholder-[#8A93B5]/50 focus:outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/40 transition"
          />
        </div>

        {/* Type Toggle Pills */}
        <div className="flex items-center p-1 rounded-[12px] bg-[#0B1029] border border-white/[0.06]">
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
                className={`px-3.5 py-1.5 rounded-[10px] text-xs font-medium transition-all duration-150 ${active
                    ? 'bg-[#0A84FF] text-white font-semibold shadow-[0_0_12px_rgba(10,132,255,0.4)]'
                    : 'text-[#8A93B5] hover:text-white'
                  }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Category Dropdown */}
        <div className="w-[160px]">
          <select
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            className="w-full py-2.5 px-3 rounded-[12px] bg-[#0B1029] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-[#0A84FF] focus:ring-2 focus:ring-[#0A84FF]/40 transition"
          >
            <option value="" className="bg-[#0B1029] text-[#8A93B5]">All Categories</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c} className="bg-[#0B1029] text-white">
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
          className="px-3.5 py-2 rounded-[10px] border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] text-[#8A93B5] hover:text-white text-xs font-medium transition-colors duration-150 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          Clear Filters
        </button>
      )}
    </div>
  );
}

