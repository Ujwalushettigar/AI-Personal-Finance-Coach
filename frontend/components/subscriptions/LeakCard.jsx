'use client';

import React from 'react';
import { Card, Tile } from '../budget-goals/ThemeCard';

/**
 * Subscription Leak Alert Card (CryptoVault Fintech Theme)
 * Reads properties from real subscription / leak API data.
 */
export default function LeakCard({ leak, money }) {
  const merchant = leak.merchant || 'Subscription';
  const monthlyCost = Number(leak.monthly_cost ?? leak.monthlyCost ?? leak.amount ?? 0);
  const potentialMonthlySavings = Number(
    leak.potential_monthly_savings ?? leak.potentialMonthlySavings ?? monthlyCost
  );
  const confidence = Number(leak.confidence ?? 0);
  const isRarelyUsed = Boolean(leak.rarely_used ?? leak.rarelyUsed);

  const defaultReasons = isRarelyUsed
    ? ['Flagged as rarely used']
    : confidence < 60
    ? ['Low detection confidence']
    : ['High monthly cost recurring subscription'];

  const reasons = leak.reasons && leak.reasons.length > 0 ? leak.reasons : defaultReasons;

  const severity =
    leak.severity ||
    (isRarelyUsed || monthlyCost > 30 || confidence < 60 ? 'high' : 'medium');

  const isHigh = severity === 'high';

  const severityConfig = isHigh
    ? {
        label: 'High Priority',
        icon: '⚠️',
        badgeClass: 'bg-[#FF4D6A]/[0.12] text-[#FF4D6A] border-[#FF4D6A]/30',
        accentBorder: 'border-l-[#FF4D6A]',
      }
    : {
        label: 'Medium Priority',
        icon: '⚡',
        badgeClass: 'bg-[#F5A524]/[0.12] text-[#F5A524] border-[#F5A524]/30',
        accentBorder: 'border-l-[#F5A524]',
      };

  return (
    <Card
      hover={true}
      className={`border-l-[3px] ${severityConfig.accentBorder} flex flex-col justify-between`}
    >
      <div>
        {/* Top: Severity Badge + Merchant + Cost */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <div
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${severityConfig.badgeClass} mb-2 uppercase tracking-wider`}
            >
              <span className="text-[10px] leading-none" aria-hidden="true">
                {severityConfig.icon}
              </span>
              <span>{severityConfig.label}</span>
            </div>
            <h3 className="font-bold text-base text-white tracking-tight truncate">
              {merchant}
            </h3>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-lg font-bold text-white tracking-tight">
              {money(monthlyCost)}
            </span>
            <span className="block text-[10px] text-[#8A93B5]">
              per month
            </span>
          </div>
        </div>

        {/* Reasons */}
        {reasons.length > 0 && (
          <div className="mb-4">
            {reasons.map((reason, idx) => (
              <p key={idx} className="text-xs text-[#8A93B5] leading-relaxed flex items-start gap-2 mb-1">
                <span className="text-[#8A93B5] font-bold mt-0.5">•</span>
                <span>{reason}</span>
              </p>
            ))}
          </div>
        )}

        {/* Potential Savings Tile */}
        <Tile className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[8px] bg-[#22D36A]/[0.12] border border-[#22D36A]/30 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-[#22D36A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs text-[#8A93B5]">
              Potential savings
            </span>
          </div>
          <span className="text-sm font-bold text-[#39FF14]">
            {money(potentialMonthlySavings)}/mo
          </span>
        </Tile>
      </div>

      {/* Confidence Footer */}
      <div className="pt-3 mt-3 border-t border-white/[0.06] text-[11px] text-[#8A93B5]">
        Detection confidence: {confidence}%
      </div>
    </Card>
  );
}
