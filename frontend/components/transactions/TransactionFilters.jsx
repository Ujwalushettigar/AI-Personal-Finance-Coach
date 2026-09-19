'use client';

import React from 'react';

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
    <div
      style={{
        background: 'rgba(17, 24, 39, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)'
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', flex: 1, minWidth: '300px' }}>
        {/* Search Input with Icon */}
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b', display: 'flex' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </span>
          <input
            type="text"
            placeholder="Search transactions, merchants..."
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 36px',
              borderRadius: '10px',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#f8fafc',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Type Toggle Pills */}
        <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.7)', padding: '3px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
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
                style={{
                  padding: '6px 14px',
                  borderRadius: '7px',
                  border: 'none',
                  background: active ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                  color: active ? '#818cf8' : '#94a3b8',
                  fontSize: '12px',
                  fontWeight: active ? '600' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Category Dropdown */}
        <div style={{ width: '160px' }}>
          <select
            value={filters.category || ''}
            onChange={(e) => handleChange('category', e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '10px',
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#f8fafc',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          >
            <option value="" style={{ background: '#0f172a', color: '#94a3b8' }}>All Categories</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c} style={{ background: '#0f172a', color: '#f8fafc' }}>
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
          style={{
            padding: '8px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: 'rgba(255, 255, 255, 0.05)',
            color: '#94a3b8',
            fontSize: '12px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Clear Filters
        </button>
      )}
    </div>
  );
}
