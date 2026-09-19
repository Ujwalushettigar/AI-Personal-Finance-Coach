'use client';

import React from 'react';

/**
 * Category icon selector returning line icons in signature #0A84FF stroke
 */
export function CategoryIcon({ category = '', className = 'w-6 h-6 text-[#0A84FF]' }) {
  const norm = (category || '').toLowerCase();

  // Food / Dining / Groceries
  if (norm.includes('food') || norm.includes('grocer') || norm.includes('dining') || norm.includes('restaurant')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h4v6a4 4 0 01-4-4V4zm12 0h4v16h-4V4z" />
      </svg>
    );
  }

  // Housing / Rent / Real Estate
  if (norm.includes('house') || norm.includes('rent') || norm.includes('home') || norm.includes('mortgage')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    );
  }

  // Transport / Auto / Fuel
  if (norm.includes('trans') || norm.includes('car') || norm.includes('gas') || norm.includes('fuel') || norm.includes('commute')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 17h8M5 17h.01M19 17h.01M5 11l2-5h10l2 5M5 11h14m-14 0v6a1 1 0 001 1h1m12-7v6a1 1 0 01-1 1h-1" />
      </svg>
    );
  }

  // Entertainment / Media / Leisure
  if (norm.includes('entertain') || norm.includes('movie') || norm.includes('game') || norm.includes('fun') || norm.includes('music')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    );
  }

  // Shopping / Retail / Lifestyle
  if (norm.includes('shop') || norm.includes('cloth') || norm.includes('apparel') || norm.includes('retail')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    );
  }

  // Utilities / Electricity / Cloud Bills
  if (norm.includes('util') || norm.includes('bill') || norm.includes('electric') || norm.includes('water') || norm.includes('tech')) {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
  }

  // Default Vault / Wallet line icon
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

export default CategoryIcon;

