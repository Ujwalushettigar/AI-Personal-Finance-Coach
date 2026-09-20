'use client';

import React from 'react';
import { Card, IconTile } from '../budget-goals/ThemeCard';

/**
 * Subscription Feature Card (CryptoVault Fintech Theme)
 * Reads properties from real subscription API data (supporting both snake_case and camelCase).
 */
export default function SubscriptionCard({ subscription, money, dateLabel }) {
  const merchant = subscription.merchant || 'Subscription';
  const cadence = subscription.cadence || 'monthly';
  const amount = Number(subscription.amount ?? subscription.monthly_cost ?? subscription.monthlyCost ?? 0);
  const monthlyCost = Number(subscription.monthly_cost ?? subscription.monthlyCost ?? amount);
  const confidence = Number(subscription.confidence ?? 0);
  const nextExpectedPayment = subscription.next_expected_payment ?? subscription.nextExpectedPayment;
  const transactionCount = subscription.transaction_count ?? subscription.transactionCount;

  // Confidence-based color theming
  const isHigh = confidence >= 80;
  const isMedium = confidence >= 60 && confidence < 80;

  const confidenceBarClass = isHigh
    ? 'bg-gradient-to-r from-[#1FB5A5] to-[#22D36A]'
    : isMedium
    ? 'bg-[#F5A524]'
    : 'bg-[#FF4D6A]';

  const confidenceTextClass = isHigh
    ? 'text-[#22D36A] bg-[#22D36A]/[0.12] border-[#22D36A]/30'
    : isMedium
    ? 'text-[#F5A524] bg-[#F5A524]/[0.12] border-[#F5A524]/30'
    : 'text-[#FF4D6A] bg-[#FF4D6A]/[0.12] border-[#FF4D6A]/30';

  const confidenceLabel = isHigh ? 'High' : isMedium ? 'Medium' : 'Low';

  return (
    <Card className="flex flex-col justify-between group">
      <div>
        {/* Top Row: Icon Tile + Merchant + Cadence Pill */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <IconTile>
              <span className="text-base font-bold text-[#0A84FF]">
                {merchant.charAt(0).toUpperCase()}
              </span>
            </IconTile>
            <div className="min-w-0">
              <h3 className="font-bold text-lg text-white truncate tracking-tight">
                {merchant}
              </h3>
              <p className="text-xs text-[#8A93B5] capitalize">
                {cadence} · {money(amount)} per cycle
              </p>
            </div>
          </div>

          {/* Cadence Badge */}
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border bg-[#0A84FF]/[0.12] border-[#0A84FF]/30 text-[#0A84FF] flex-shrink-0 uppercase tracking-wider">
            {cadence}
          </span>
        </div>

        {/* Monthly Cost */}
        <div className="flex items-baseline justify-between mb-3">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-[26px] font-bold text-white tracking-tight">
              {money(monthlyCost)}
            </span>
            <span className="text-xs text-[#8A93B5]">
              / month
            </span>
          </div>
          {transactionCount !== undefined && transactionCount !== null && (
            <span className="text-[11px] text-[#8A93B5]">
              {transactionCount} transactions
            </span>
          )}
        </div>

        {/* Confidence Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-[#8A93B5]">Detection confidence</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${confidenceTextClass}`}>
              {confidenceLabel} · {confidence}%
            </span>
          </div>
          <div className="w-full bg-white/[0.08] h-2 rounded-full overflow-hidden">
            <div
              className={`h-full ${confidenceBarClass} rounded-full transition-all duration-500 ease-out`}
              style={{ width: `${Math.min(100, Math.max(0, confidence))}%` }}
              role="progressbar"
              aria-valuenow={confidence}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${confidence}% confidence`}
            />
          </div>
        </div>

        {/* Next Payment */}
        <div className="flex items-center justify-between text-xs text-[#8A93B5]">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#0A84FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Next: {dateLabel(nextExpectedPayment)}
          </span>
        </div>
      </div>
    </Card>
  );
}
