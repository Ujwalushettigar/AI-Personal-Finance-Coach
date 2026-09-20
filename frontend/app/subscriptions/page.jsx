'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSubscriptions, markRarelyUsed } from '../../services/api/subscriptions';
import { Card, BadgePill, IconTile } from '../../components/budget-goals/ThemeCard';
import SubscriptionCard from '../../components/subscriptions/SubscriptionCard';
import LeakCard from '../../components/subscriptions/LeakCard';
import SubscriptionSkeleton from '../../components/subscriptions/SubscriptionSkeleton';

const money = (value) => `$${Number(value || 0).toFixed(2)}`;
const dateLabel = (value) =>
  value
    ? new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Not available';

function ConfidenceBadge({ value }) {
  const isHigh = value >= 80;
  const isMedium = value >= 60 && value < 80;

  const badgeClass = isHigh
    ? 'text-[#22D36A] bg-[#22D36A]/[0.12] border-[#22D36A]/30'
    : isMedium
    ? 'text-[#F5A524] bg-[#F5A524]/[0.12] border-[#F5A524]/30'
    : 'text-[#FF4D6A] bg-[#FF4D6A]/[0.12] border-[#FF4D6A]/30';

  const label = isHigh ? 'High' : isMedium ? 'Medium' : 'Low';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badgeClass}`}>
      {label} · {value}%
    </span>
  );
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchSubscriptionsData = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getSubscriptions();
      const list = Array.isArray(res) ? res : res?.subscriptions || [];
      setSubscriptions(list);
    } catch (err) {
      console.error('Failed to load subscriptions:', err);
      setError(err.message || 'Unable to load subscription data.');
      setSubscriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionsData();
  }, []);

  // Derived Statistics from real subscriptions data
  const summary = useMemo(() => {
    const totalCount = subscriptions.length;
    let monthlyTotal = 0;
    let yearlyTotal = 0;
    let leakTotal = 0;

    subscriptions.forEach((sub) => {
      const mCost = Number(sub.monthly_cost ?? sub.monthlyCost ?? sub.amount ?? 0);
      const yCost = Number(sub.yearly_cost ?? sub.yearlyCost ?? mCost * 12);
      monthlyTotal += mCost;
      yearlyTotal += yCost;

      const isRarely = Boolean(sub.rarely_used ?? sub.rarelyUsed);
      if (isRarely) {
        leakTotal += mCost;
      }
    });

    return {
      totalSubscriptions: totalCount,
      monthlyCost: monthlyTotal,
      yearlyCost: yearlyTotal,
      potentialMonthlyLeaks: leakTotal,
    };
  }, [subscriptions]);

  // Derived Leaks: subscriptions where rarely_used === true OR confidence < 80
  const leaks = useMemo(() => {
    return subscriptions
      .filter((sub) => {
        const isRarely = Boolean(sub.rarely_used ?? sub.rarelyUsed);
        const conf = Number(sub.confidence ?? 100);
        return isRarely || conf < 80;
      })
      .map((sub) => {
        const mCost = Number(sub.monthly_cost ?? sub.monthlyCost ?? sub.amount ?? 0);
        const isRarely = Boolean(sub.rarely_used ?? sub.rarelyUsed);
        const conf = Number(sub.confidence ?? 100);
        const reasons = [];

        if (isRarely) reasons.push('Flagged as rarely used');
        if (conf < 80) reasons.push(`Low detection confidence (${conf}%)`);
        if (mCost > 30) reasons.push('High recurring cost');

        return {
          ...sub,
          monthlyCost: mCost,
          potentialMonthlySavings: mCost,
          severity: isRarely || mCost > 30 || conf < 60 ? 'high' : 'medium',
          reasons: reasons.length ? reasons : ['Pattern needs review'],
        };
      });
  }, [subscriptions]);

  // Toggle rarely used checklist item
  async function handleToggleRarelyUsed(id, currentValue) {
    setUpdatingId(id);
    try {
      const newValue = !currentValue;
      await markRarelyUsed(id, newValue);
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === id ? { ...sub, rarely_used: newValue, rarelyUsed: newValue } : sub
        )
      );
    } catch (err) {
      console.error('Failed to update rarely used status:', err);
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white p-4 sm:p-8 space-y-10 antialiased">
      <div className="max-w-[1216px] mx-auto space-y-10">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <BadgePill icon="🔍" text="Spending Intelligence" className="mb-3" />
            <h1 className="text-3xl sm:text-4xl md:text-[44px] font-bold text-white tracking-tight leading-[1.15]">
              Subscription{' '}
              <span className="bg-gradient-to-r from-[#0A84FF] via-[#22D36A] to-[#39FF14] bg-clip-text text-transparent">
                Intelligence
              </span>
            </h1>
            <p className="text-sm sm:text-base text-[#8A93B5] mt-2 max-w-xl leading-relaxed">
              See every recurring payment, what it costs, and where your money may be quietly leaking.
            </p>
          </div>

          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#0F1633] border border-white/[0.06] text-xs font-medium flex-shrink-0">
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${loading ? 'bg-[#F5A524] animate-pulse' : error ? 'bg-[#FF4D6A]' : 'bg-[#22D36A]'}`} />
            <span className="text-[#8A93B5]">
              {loading ? 'Analyzing transactions…' : error ? 'Error loading API' : 'Live transaction analysis'}
            </span>
          </div>
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <SubscriptionSkeleton />
        ) : subscriptions.length === 0 ? (
          /* EMPTY STATE */
          <Card hover={false} className="py-16 px-6 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-[16px] bg-[#0A84FF]/[0.12] border border-[#0A84FF]/30 text-[#0A84FF] flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="max-w-md space-y-1">
              <h2 className="text-xl font-bold text-white tracking-tight">No subscriptions detected yet</h2>
              <p className="text-xs sm:text-sm text-[#8A93B5]">
                Your recurring subscriptions will appear here automatically as they are detected from your transaction history.
              </p>
            </div>
          </Card>
        ) : (
          <>
            {/* STATS PANEL */}
            <div className="bg-[#0F1633] border border-white/[0.06] rounded-[16px] p-6 sm:p-8 hover:border-[#0A84FF]/25 transition-all duration-200">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06]">

                {/* Stat 1: Active Subscriptions */}
                <div className="pt-4 lg:pt-0 lg:px-4 first:lg:pl-0 flex flex-col justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#8A93B5] font-semibold">
                    Detected
                  </span>
                  <div className="mt-2">
                    <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#1FB5A5] to-[#22D36A] bg-clip-text text-transparent tracking-tight">
                      {summary.totalSubscriptions}
                    </div>
                    <div className="text-sm font-semibold text-white mt-1">
                      Active Subscriptions
                    </div>
                    <div className="text-xs text-[#8A93B5] mt-0.5">
                      Recurring merchants
                    </div>
                  </div>
                </div>

                {/* Stat 2: Monthly Commitment */}
                <div className="pt-4 lg:pt-0 lg:px-6 flex flex-col justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#8A93B5] font-semibold">
                    Monthly Outflow
                  </span>
                  <div className="mt-2">
                    <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#1FB5A5] to-[#22D36A] bg-clip-text text-transparent tracking-tight">
                      {money(summary.monthlyCost)}
                    </div>
                    <div className="text-sm font-semibold text-white mt-1">
                      Monthly Commitment
                    </div>
                    <div className="text-xs text-[#8A93B5] mt-0.5">
                      Average monthly spend
                    </div>
                  </div>
                </div>

                {/* Stat 3: Yearly Commitment */}
                <div className="pt-4 lg:pt-0 lg:px-6 flex flex-col justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#8A93B5] font-semibold">
                    Annual Projection
                  </span>
                  <div className="mt-2">
                    <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#1FB5A5] to-[#22D36A] bg-clip-text text-transparent tracking-tight">
                      {money(summary.yearlyCost)}
                    </div>
                    <div className="text-sm font-semibold text-white mt-1">
                      Yearly Commitment
                    </div>
                    <div className="text-xs text-[#8A93B5] mt-0.5">
                      Projected annual cost
                    </div>
                  </div>
                </div>

                {/* Stat 4: Potential Monthly Leaks */}
                <div className="pt-4 lg:pt-0 lg:px-6 flex flex-col justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#8A93B5] font-semibold">
                    Leak Exposure
                  </span>
                  <div className="mt-2">
                    <div className="text-3xl sm:text-4xl font-bold text-[#FF4D6A] tracking-tight">
                      {money(summary.potentialMonthlyLeaks)}
                    </div>
                    <div className="text-sm font-semibold text-white mt-1">
                      Potential Monthly Leaks
                    </div>
                    <div className="text-xs text-[#8A93B5] mt-0.5">
                      {leaks.length} item{leaks.length === 1 ? '' : 's'} worth reviewing
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* RARELY USED REVIEW PANEL */}
            <Card hover={false} className="p-6 sm:p-7">
              <div className="flex items-start gap-3.5 mb-5">
                <IconTile>
                  <svg className="w-5 h-5 text-[#0A84FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </IconTile>
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Which subscriptions do you rarely use?
                  </h2>
                  <p className="text-xs text-[#8A93B5] mt-1 leading-relaxed">
                    Select anything you do not use often. We will flag it as a potential money leak for review.
                  </p>
                </div>
              </div>

              {/* Subscription Checkbox Pills */}
              <div className="flex flex-wrap gap-2.5 mb-2">
                {subscriptions.map((sub) => {
                  const isRarely = Boolean(sub.rarely_used ?? sub.rarelyUsed);
                  const isUpdating = updatingId === sub.id;
                  const mCost = Number(sub.monthly_cost ?? sub.monthlyCost ?? sub.amount ?? 0);

                  return (
                    <label
                      key={sub.id}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] cursor-pointer text-xs font-medium transition-all duration-150 border ${isRarely
                          ? 'bg-[#0A84FF]/[0.15] border-[#0A84FF]/40 text-white shadow-[0_0_12px_rgba(10,132,255,0.2)]'
                          : 'bg-[#0B1029] border-white/[0.06] text-[#8A93B5] hover:border-white/[0.15] hover:text-white'
                        } ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={isRarely}
                        onChange={() => handleToggleRarelyUsed(sub.id, isRarely)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center flex-shrink-0 transition-all ${isRarely
                          ? 'bg-[#0A84FF] border-[#0A84FF]'
                          : 'bg-transparent border-white/[0.2]'
                        }`}>
                        {isRarely && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="font-semibold">{sub.merchant}</span>
                      <span className={isRarely ? 'text-white/60' : 'text-[#8A93B5]/60'}>
                        {money(mCost)}/mo
                      </span>
                    </label>
                  );
                })}
              </div>
            </Card>

            {/* CONTENT GRID — Subscriptions + Leaks */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

              {/* Left Column: Subscription Cards (3/5 width) */}
              <div className="lg:col-span-3 space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Your Subscriptions
                    </h2>
                    <p className="text-xs text-[#8A93B5] mt-0.5">
                      Recurring payments with a predictable cadence
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-[8px] bg-[#0A84FF]/[0.12] border border-[#0A84FF]/30 text-[#0A84FF] text-xs font-bold">
                    {subscriptions.length}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subscriptions.map((subscription) => (
                    <SubscriptionCard
                      key={subscription.id}
                      subscription={subscription}
                      money={money}
                      dateLabel={dateLabel}
                    />
                  ))}
                </div>
              </div>

              {/* Right Column: Leak Cards (2/5 width) */}
              <div className="lg:col-span-2 space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      Potential <span className="text-[#FF4D6A]">Leaks</span>
                    </h2>
                    <p className="text-xs text-[#8A93B5] mt-0.5">
                      Recurring expenses that deserve a second look
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-[8px] bg-[#FF4D6A]/[0.12] border border-[#FF4D6A]/30 text-[#FF4D6A] text-xs font-bold">
                    {leaks.length}
                  </span>
                </div>

                {leaks.length > 0 ? (
                  <div className="space-y-4">
                    {leaks.map((leak) => (
                      <LeakCard
                        key={leak.id}
                        leak={leak}
                        money={money}
                      />
                    ))}
                  </div>
                ) : (
                  <Card hover={false} className="py-12 px-6 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-[12px] bg-[#22D36A]/[0.12] border border-[#22D36A]/30 text-[#22D36A] flex items-center justify-center mb-3">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">
                      No Leaks Detected
                    </h3>
                    <p className="text-xs text-[#8A93B5]">
                      All subscriptions appear to be actively used. Nice work!
                    </p>
                  </Card>
                )}
              </div>
            </div>

            {/* RECURRING EXPENSES TABLE */}
            <Card hover={false} className="overflow-hidden">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    Recurring Expenses
                  </h2>
                  <p className="text-xs text-[#8A93B5] mt-0.5">
                    Every repeated expense pattern found in your transaction history
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-[8px] bg-[#0A84FF]/[0.12] border border-[#0A84FF]/30 text-[#0A84FF] text-xs font-bold">
                  {subscriptions.length}
                </span>
              </div>

              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full border-collapse text-sm min-w-[620px]">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left py-3 px-3 text-[10px] uppercase tracking-wider text-[#8A93B5] font-semibold">
                        Merchant
                      </th>
                      <th className="text-left py-3 px-3 text-[10px] uppercase tracking-wider text-[#8A93B5] font-semibold">
                        Pattern
                      </th>
                      <th className="text-left py-3 px-3 text-[10px] uppercase tracking-wider text-[#8A93B5] font-semibold">
                        Typical Payment
                      </th>
                      <th className="text-left py-3 px-3 text-[10px] uppercase tracking-wider text-[#8A93B5] font-semibold">
                        Next Payment
                      </th>
                      <th className="text-left py-3 px-3 text-[10px] uppercase tracking-wider text-[#8A93B5] font-semibold">
                        Confidence
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscriptions.map((item) => {
                      const mCost = Number(item.monthly_cost ?? item.monthlyCost ?? item.amount ?? 0);
                      const nextPay = item.next_expected_payment ?? item.nextExpectedPayment;
                      const conf = Number(item.confidence ?? 0);

                      return (
                        <tr
                          key={item.id}
                          className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors duration-100"
                        >
                          <td className="py-3.5 px-3 text-sm font-semibold text-white">
                            {item.merchant}
                          </td>
                          <td className="py-3.5 px-3 text-xs text-[#8A93B5] capitalize">
                            {item.cadence || 'monthly'}
                          </td>
                          <td className="py-3.5 px-3 text-xs text-white font-medium">
                            {money(mCost)}
                          </td>
                          <td className="py-3.5 px-3 text-xs text-[#8A93B5]">
                            {dateLabel(nextPay)}
                          </td>
                          <td className="py-3.5 px-3">
                            <ConfidenceBadge value={conf} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* FOOTER DISCLAIMER */}
            <div className="text-center text-[11px] text-[#8A93B5] pb-4">
              Confidence is based on payment timing, amount consistency, and transaction history. Always confirm a subscription before cancelling it.
            </div>
          </>
        )}

      </div>
    </div>
  );
}
