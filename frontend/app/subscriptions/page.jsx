'use client';

import { useEffect, useMemo, useState } from 'react';
import { detectSubscriptions, getSubscriptions, addSubscription } from '../../services/api/subscriptions';
import { Card, BadgePill, Tile, IconTile, PrimaryButton } from '../../components/budget-goals/ThemeCard';
import SubscriptionCard from '../../components/subscriptions/SubscriptionCard';
import LeakCard from '../../components/subscriptions/LeakCard';
import SubscriptionSkeleton from '../../components/subscriptions/SubscriptionSkeleton';

/* ─────────────────────────────────────────────────────────
   Fallback data — identical to original, zero logic changes
   ───────────────────────────────────────────────────────── */
const fallbackData = {
	summary: { totalSubscriptions: 4, monthlyCost: 110.15, yearlyCost: 1321.8 },
	subscriptions: [
		{ id: 'streamflix', merchant: 'StreamFlix', cadence: 'monthly', amount: 15.99, monthlyCost: 15.99, yearlyCost: 191.88, confidence: 96, nextExpectedPayment: '2026-09-05', transactionCount: 4 },
		{ id: 'cloudbox', merchant: 'CloudBox Pro', cadence: 'monthly', amount: 49.99, monthlyCost: 49.99, yearlyCost: 599.88, confidence: 94, nextExpectedPayment: '2026-09-12', transactionCount: 4 },
		{ id: 'fitstudio', merchant: 'Fit Studio', cadence: 'monthly', amount: 29, monthlyCost: 29, yearlyCost: 348, confidence: 90, nextExpectedPayment: '2026-09-01', transactionCount: 4 },
		{ id: 'designannual', merchant: 'Design Annual', cadence: 'yearly', amount: 199, monthlyCost: 16.58, yearlyCost: 199, confidence: 62, nextExpectedPayment: '2027-08-20', transactionCount: 2 },
	],
	recurringExpenses: [
		{ id: 'streamflix', merchant: 'StreamFlix', cadence: 'monthly', amount: 15.99, confidence: 96 },
		{ id: 'cloudbox', merchant: 'CloudBox Pro', cadence: 'monthly', amount: 49.99, confidence: 94 },
		{ id: 'fitstudio', merchant: 'Fit Studio', cadence: 'monthly', amount: 29, confidence: 90 },
		{ id: 'designannual', merchant: 'Design Annual', cadence: 'yearly', amount: 199, confidence: 62 },
	],
	leaks: [
		{ id: 'leak-cloudbox', merchant: 'CloudBox Pro', monthlyCost: 49.99, potentialMonthlySavings: 37.49, severity: 'high', confidence: 94, reasons: ['High recurring cost'] },
		{ id: 'leak-designannual', merchant: 'Design Annual', monthlyCost: 16.58, potentialMonthlySavings: 8.29, severity: 'medium', confidence: 62, reasons: ['Pattern needs review', 'Annual renewal can be easy to miss'] },
	],
};

/* ─────────────────────────────────────────────────────────
   Helpers — identical to original
   ───────────────────────────────────────────────────────── */
const money = (value) => `$${Number(value || 0).toFixed(2)}`;
const dateLabel = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not available';

/* ─────────────────────────────────────────────────────────
   Confidence Badge (local sub-component)
   ───────────────────────────────────────────────────────── */
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

/* ═════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   All state, effects, handlers, API calls IDENTICAL to original
   ═════════════════════════════════════════════════════════ */
export default function SubscriptionsPage() {
	const [data, setData] = useState(fallbackData);
	const [loading, setLoading] = useState(true);
	const [usingDemo, setUsingDemo] = useState(false);
	const [error, setError] = useState('');
	const [rarelyUsedIds, setRarelyUsedIds] = useState([]);
	const [reviewing, setReviewing] = useState(false);
	const [reviewMessage, setReviewMessage] = useState('');
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [newSubForm, setNewSubForm] = useState({ merchant: '', cadence: 'monthly', amount: '' });
	const [isAdding, setIsAdding] = useState(false);
	const [addError, setAddError] = useState('');

	async function handleAddSubscription(e) {
		e.preventDefault();
		if (!newSubForm.merchant || !newSubForm.amount) return;
		setIsAdding(true);
		setAddError('');
		try {
			await addSubscription(newSubForm);
			const result = await getSubscriptions();
			setData({ ...fallbackData, ...result });
			setIsAddModalOpen(false);
			setNewSubForm({ merchant: '', cadence: 'monthly', amount: '' });
		} catch (err) {
			setAddError(err.message || 'Failed to add subscription');
		} finally {
			setIsAdding(false);
		}
	}

	useEffect(() => {
		getSubscriptions().then((result) => {
			setData({ ...fallbackData, ...result });
		}).catch((requestError) => {
			setUsingDemo(true);
			setError(requestError.message || 'Unable to load subscription data.');
		}).finally(() => setLoading(false));
	}, []);



	const summary = data.summary || {};
	const recurring = data.recurringExpenses || data.subscriptions || [];
	const subscriptions = data.subscriptions || [];
	const leaks = data.leaks || [];
	const savings = useMemo(() => leaks.reduce((total, leak) => total + Number(leak.potentialMonthlySavings || 0), 0), [leaks]);

	function toggleRarelyUsed(id) {
		setRarelyUsedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
		setReviewMessage('');
	}

	async function reviewRarelyUsed() {
		if (!rarelyUsedIds.length) return;
		setReviewing(true);
		try {
			const result = await detectSubscriptions(undefined, rarelyUsedIds);
			setData((current) => ({ ...current, ...result }));
			setReviewMessage(`${rarelyUsedIds.length} subscription${rarelyUsedIds.length === 1 ? '' : 's'} added to your leak review.`);
		} catch (error) {
			setReviewMessage(error.message || 'Unable to update the live leak analysis.');
		} finally {
			setReviewing(false);
		}
	}

	/* ───────────────────────────────────────────────────────
	   RENDER — CryptoVault Dark Fintech Theme
	   ─────────────────────────────────────────────────────── */
	return (
		<div className="min-h-screen bg-[#0A0E27] text-white p-4 sm:p-8 space-y-10 antialiased">
			<div className="max-w-[1216px] mx-auto space-y-10">

				{/* ═══════════════════════════════════════════════════
				    HEADER: Badge Pill + Section Heading + Status
				    ═══════════════════════════════════════════════════ */}
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

					{/* Live / Demo Status Indicator */}
					<div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#0F1633] border border-white/[0.06] text-xs font-medium flex-shrink-0">
						<span className={`w-2 h-2 rounded-full flex-shrink-0 ${usingDemo ? 'bg-[#F5A524]' : 'bg-[#22D36A]'}`} />
						<span className="text-[#8A93B5]">
							{loading ? 'Analyzing transactions…' : usingDemo ? 'Demo insights · API offline' : 'Live transaction analysis'}
						</span>
					</div>
				</div>

				{/* Show skeleton while loading */}
				{loading ? (
					<SubscriptionSkeleton />
				) : (
					<>
						{/* ═══════════════════════════════════════════════════
						    STATS PANEL — 4-column metric grid
						    ═══════════════════════════════════════════════════ */}
						<div className="bg-[#0F1633] border border-white/[0.06] rounded-[16px] p-6 sm:p-8 hover:border-[#0A84FF]/25 transition-all duration-200">
							<div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06]">

								{/* Stat 1: Detected Subscriptions */}
								<div className="pt-4 lg:pt-0 lg:px-4 first:lg:pl-0 flex flex-col justify-between">
									<span className="text-xs uppercase tracking-wider text-[#8A93B5] font-semibold">
										Detected
									</span>
									<div className="mt-2">
										<div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#1FB5A5] to-[#22D36A] bg-clip-text text-transparent tracking-tight">
											{summary.totalSubscriptions ?? subscriptions.length}
										</div>
										<div className="text-sm font-semibold text-white mt-1">
											Active Subscriptions
										</div>
										<div className="text-xs text-[#8A93B5] mt-0.5">
											Recurring merchants
										</div>
									</div>
								</div>

								{/* Stat 2: Monthly Cost */}
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

								{/* Stat 3: Yearly Cost */}
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

								{/* Stat 4: Potential Leaks */}
								<div className="pt-4 lg:pt-0 lg:px-6 flex flex-col justify-between">
									<span className="text-xs uppercase tracking-wider text-[#8A93B5] font-semibold">
										Leak Exposure
									</span>
									<div className="mt-2">
										<div className="text-3xl sm:text-4xl font-bold text-[#FF4D6A] tracking-tight">
											{money(savings)}
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

						{/* ═══════════════════════════════════════════════════
						    RARELY USED REVIEW PANEL
						    ═══════════════════════════════════════════════════ */}
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
							<div className="flex flex-wrap gap-2.5 mb-5">
								{subscriptions.map((subscription) => {
									const isSelected = rarelyUsedIds.includes(subscription.id);
									return (
										<label
											key={subscription.id}
											className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] cursor-pointer text-xs font-medium transition-all duration-150 border ${
												isSelected
													? 'bg-[#0A84FF]/[0.15] border-[#0A84FF]/40 text-white shadow-[0_0_12px_rgba(10,132,255,0.2)]'
													: 'bg-[#0B1029] border-white/[0.06] text-[#8A93B5] hover:border-white/[0.15] hover:text-white'
											}`}
										>
											<input
												type="checkbox"
												checked={isSelected}
												onChange={() => toggleRarelyUsed(subscription.id)}
												className="sr-only"
											/>
											{/* Custom checkbox visual */}
											<div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center flex-shrink-0 transition-all ${
												isSelected
													? 'bg-[#0A84FF] border-[#0A84FF]'
													: 'bg-transparent border-white/[0.2]'
											}`}>
												{isSelected && (
													<svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
														<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
													</svg>
												)}
											</div>
											<span className="font-semibold">{subscription.merchant}</span>
											<span className={isSelected ? 'text-white/60' : 'text-[#8A93B5]/60'}>
												{money(subscription.monthlyCost)}/mo
											</span>
										</label>
									);
								})}
							</div>

							{/* Review Action */}
							<div className="flex items-center gap-3 flex-wrap">
								<PrimaryButton
									onClick={reviewRarelyUsed}
									disabled={!rarelyUsedIds.length || reviewing}
								>
									{reviewing ? (
										<>
											<svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
											</svg>
											<span>Reviewing…</span>
										</>
									) : (
										`Review selected${rarelyUsedIds.length ? ` (${rarelyUsedIds.length})` : ''}`
									)}
								</PrimaryButton>
								{reviewMessage && (
									<span className="text-xs font-semibold text-[#22D36A] flex items-center gap-1.5">
										<span>✓</span> {reviewMessage}
									</span>
								)}
							</div>
						</Card>

						{/* ═══════════════════════════════════════════════════
						    CONTENT GRID — Subscriptions + Leaks
						    ═══════════════════════════════════════════════════ */}
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
											Potential{' '}
											<span className="text-[#FF4D6A]">Leaks</span>
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

						{/* ═══════════════════════════════════════════════════
						    RECURRING EXPENSES TABLE
						    ═══════════════════════════════════════════════════ */}
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
									{recurring.length}
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
										{recurring.map((item) => (
											<tr
												key={item.id}
												className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors duration-100"
											>
												<td className="py-3.5 px-3 text-sm font-semibold text-white">
													{item.merchant}
												</td>
												<td className="py-3.5 px-3 text-xs text-[#8A93B5] capitalize">
													{item.cadence}
												</td>
												<td className="py-3.5 px-3 text-xs text-white font-medium">
													{money(item.amount)}
												</td>
												<td className="py-3.5 px-3 text-xs text-[#8A93B5]">
													{dateLabel(item.nextExpectedPayment)}
												</td>
												<td className="py-3.5 px-3">
													<ConfidenceBadge value={item.confidence} />
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</Card>

						{/* ═══════════════════════════════════════════════════
						    FOOTER DISCLAIMER
						    ═══════════════════════════════════════════════════ */}
						<div className="text-center text-[11px] text-[#8A93B5] pb-4">
							Confidence is based on payment timing, amount consistency, and transaction history. Always confirm a subscription before cancelling it.
						</div>
					</>
				)}

			</div>
		</div>
	);
}

