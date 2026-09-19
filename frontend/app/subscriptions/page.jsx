'use client';

import { useEffect, useMemo, useState } from 'react';
import { detectSubscriptions, getSubscriptions } from '../../services/api/subscriptions';
import GlassCard from '../../components/common/GlassCard';

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

const money = (value) => `$${Number(value || 0).toFixed(2)}`;
const dateLabel = (value) => value ? new Date(`${value}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not available';

function MetricCard({ label, value, detail, accent = '#39FF88' }) {
	return (
		<GlassCard className="p-5 border-t-2" style={{ borderTopColor: accent }}>
			<span className="block text-text-muted text-xs font-semibold mb-2">{label}</span>
			<strong className="block text-2xl font-extrabold text-text-primary tracking-tight mb-1">{value}</strong>
			<span className="text-text-muted text-xs">{detail}</span>
		</GlassCard>
	);
}

function Confidence({ value }) {
	const colorClass = value >= 80 ? 'bg-positive/10 text-positive border-positive/30' : value >= 60 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-negative/10 text-negative border-negative/30';
	return <span className={`inline-block border rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${colorClass}`}>{value}% confidence</span>;
}

export default function SubscriptionsPage() {
	const [data, setData] = useState(fallbackData);
	const [loading, setLoading] = useState(true);
	const [usingDemo, setUsingDemo] = useState(false);
	const [rarelyUsedIds, setRarelyUsedIds] = useState([]);
	const [reviewing, setReviewing] = useState(false);
	const [reviewMessage, setReviewMessage] = useState('');

	useEffect(() => {
		getSubscriptions().then((result) => {
			setData({ ...fallbackData, ...result });
		}).catch(() => setUsingDemo(true)).finally(() => setLoading(false));
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
			const selected = subscriptions.filter((item) => rarelyUsedIds.includes(item.id));
			const selectedLeaks = selected.map((item) => ({ id: `user-${item.id}`, subscriptionId: item.id, merchant: item.merchant, monthlyCost: item.monthlyCost, potentialMonthlySavings: item.monthlyCost, severity: 'high', confidence: item.confidence, reasons: ['You marked it as rarely used'] }));
			setData((current) => ({ ...current, leaks: [...selectedLeaks, ...(current.leaks || []).filter((leak) => !rarelyUsedIds.includes(leak.subscriptionId))] }));
			setReviewMessage('Your selections were added to the leak review.');
		} finally {
			setReviewing(false);
		}
	}

	return (
		<main className="min-h-screen bg-bg text-text-primary p-4 sm:p-6 md:p-8 space-y-6">
			<div className="max-w-7xl mx-auto space-y-6">
				{/* Page Header */}
				<GlassCard className="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<div>
						<div className="text-xs font-extrabold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-0.5 rounded-full border border-accent/30 inline-block mb-2">
							FINPILOT / SPENDING INTELLIGENCE
						</div>
						<h1 className="text-3xl font-bold text-text-primary tracking-tight">Subscriptions</h1>
						<p className="text-sm text-text-muted mt-1">See every recurring payment, what it costs, and where your money may be quietly leaking.</p>
					</div>
					<div className="text-xs text-text-muted flex items-center gap-2 font-medium shrink-0">
						<span>{loading ? 'Analyzing transactions…' : usingDemo ? 'Demo insights · API offline' : 'Live transaction analysis'}</span>
						<span className={`w-2.5 h-2.5 rounded-full ${usingDemo ? 'bg-amber-400' : 'bg-positive'}`} />
					</div>
				</GlassCard>

				{/* Metrics Row */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<MetricCard label="Detected subscriptions" value={summary.totalSubscriptions ?? subscriptions.length} detail="Recurring merchants" accent="#39FF88" />
					<MetricCard label="Monthly commitment" value={money(summary.monthlyCost)} detail="Average monthly spend" accent="#22D3EE" />
					<MetricCard label="Yearly commitment" value={money(summary.yearlyCost)} detail="Projected annual cost" accent="#F5F7FA" />
					<MetricCard label="Potential monthly leaks" value={money(savings)} detail={`${leaks.length} item${leaks.length === 1 ? '' : 's'} worth reviewing`} accent="#FF5C7A" />
				</div>

				{/* Rarely Used Review Panel */}
				<GlassCard className="space-y-4">
					<div className="flex items-start gap-3">
						<div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/40 text-accent flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">?</div>
						<div>
							<h2 className="text-lg font-bold text-text-primary">Which subscriptions do you rarely use?</h2>
							<p className="text-xs text-text-muted">Select anything you do not use often. We will flag it as a potential money leak for review.</p>
						</div>
					</div>
					<div className="flex flex-wrap gap-3 pt-2">
						{subscriptions.map((subscription) => (
							<label
								key={subscription.id}
								className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border transition-all cursor-pointer text-xs ${
									rarelyUsedIds.includes(subscription.id)
										? 'bg-accent/15 border-accent text-accent font-semibold'
										: 'bg-white/5 border-border text-text-primary hover:border-white/20'
								}`}
							>
								<input
									type="checkbox"
									checked={rarelyUsedIds.includes(subscription.id)}
									onChange={() => toggleRarelyUsed(subscription.id)}
									className="accent-accent w-4 h-4 rounded"
								/>
								<span className="font-semibold">{subscription.merchant}</span>
								<span className="text-text-muted">{money(subscription.monthlyCost)}/mo</span>
							</label>
						))}
					</div>
					<div className="flex items-center gap-4 pt-2 flex-wrap">
						<button
							type="button"
							onClick={reviewRarelyUsed}
							disabled={!rarelyUsedIds.length || reviewing}
							className="px-4 py-2 rounded-xl bg-accent text-[#0A0E1A] font-bold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-accent/90"
						>
							{reviewing ? 'Reviewing…' : `Review selected${rarelyUsedIds.length ? ` (${rarelyUsedIds.length})` : ''}`}
						</button>
						{reviewMessage && <span className="text-xs font-semibold text-positive">{reviewMessage}</span>}
					</div>
				</GlassCard>

				{/* Content Grid */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
					{/* Subscriptions List Panel */}
					<GlassCard className="lg:col-span-7 space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-lg font-bold text-text-primary">Your subscriptions</h2>
								<p className="text-xs text-text-muted">Recurring payments with a predictable cadence</p>
							</div>
							<span className="px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/30 text-accent font-bold text-xs">
								{subscriptions.length}
							</span>
						</div>
						<div className="divide-y divide-border pt-2">
							{subscriptions.map((subscription) => (
								<article key={subscription.id} className="py-3.5 flex items-center justify-between gap-4">
									<div className="flex items-center gap-3 min-w-0 flex-1">
										<div className="w-9 h-9 rounded-xl bg-accent text-[#0A0E1A] font-extrabold text-xs flex items-center justify-center shrink-0">
											{subscription.merchant.slice(0, 1).toUpperCase()}
										</div>
										<div className="min-w-0 flex-1">
											<div className="font-bold text-sm text-text-primary truncate">{subscription.merchant}</div>
											<div className="text-xs text-text-muted truncate">
												{subscription.cadence} · {money(subscription.amount)} per cycle · next {dateLabel(subscription.nextExpectedPayment)}
											</div>
											<div className="w-full max-w-[180px] bg-white/10 h-1.5 rounded-full overflow-hidden mt-1.5">
												<div className="h-full bg-accent rounded-full transition-all" style={{ width: `${Math.min(100, subscription.confidence)}%` }} />
											</div>
										</div>
									</div>
									<div className="text-right flex flex-col items-end gap-1 shrink-0">
										<strong className="text-sm font-bold text-text-primary">{money(subscription.monthlyCost)}</strong>
										<span className="text-[10px] text-text-muted">per month</span>
										<Confidence value={subscription.confidence} />
									</div>
								</article>
							))}
						</div>
					</GlassCard>

					{/* Leaks Side Panel */}
					<GlassCard className="lg:col-span-5 space-y-4">
						<div className="flex items-center justify-between">
							<div>
								<h2 className="text-lg font-bold text-text-primary">Potential leaks</h2>
								<p className="text-xs text-text-muted">Recurring expenses that deserve a second look</p>
							</div>
							<span className="px-2.5 py-1 rounded-lg bg-negative/10 border border-negative/30 text-negative font-bold text-xs">
								{leaks.length}
							</span>
						</div>
						<div className="divide-y divide-border pt-2">
							{leaks.length ? leaks.map((leak) => (
								<article key={leak.id} className="py-3.5 space-y-2">
									<div className="flex items-center justify-between text-xs">
										<span className={`font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded border ${leak.severity === 'high' ? 'bg-negative/10 text-negative border-negative/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
											{leak.severity} priority
										</span>
										<strong className="text-text-primary font-bold">{leak.merchant}</strong>
										<span className="text-text-muted font-semibold">{money(leak.monthlyCost)}/mo</span>
									</div>
									<p className="text-xs text-text-muted leading-relaxed">{leak.reasons?.join(' · ')}</p>
									<div className="text-xs text-positive bg-positive/10 border border-positive/20 px-3 py-1.5 rounded-lg">
										Could save about <strong className="font-bold">{money(leak.potentialMonthlySavings)}/mo</strong>
									</div>
								</article>
							)) : (
								<p className="text-xs text-text-muted py-6 text-center">No potential leaks detected. Nice work!</p>
							)}
						</div>
					</GlassCard>
				</div>

				{/* Recurring Table Section */}
				<GlassCard className="space-y-4">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-lg font-bold text-text-primary">Recurring expenses</h2>
							<p className="text-xs text-text-muted">Every repeated expense pattern found in your transaction history</p>
						</div>
						<span className="px-2.5 py-1 rounded-lg bg-white/5 border border-border text-text-muted font-bold text-xs">
							{recurring.length}
						</span>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full text-xs text-left border-collapse">
							<thead>
								<tr className="border-b border-border text-text-muted uppercase text-[10px] tracking-wider">
									<th className="py-2.5 px-3 font-semibold">Merchant</th>
									<th className="py-2.5 px-3 font-semibold">Pattern</th>
									<th className="py-2.5 px-3 font-semibold">Typical payment</th>
									<th className="py-2.5 px-3 font-semibold">Next payment</th>
									<th className="py-2.5 px-3 font-semibold">Confidence</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{recurring.map((item) => (
									<tr key={item.id} className="hover:bg-white/5 transition-colors">
										<td className="py-3 px-3 font-semibold text-text-primary">{item.merchant}</td>
										<td className="py-3 px-3 capitalize text-text-muted">{item.cadence}</td>
										<td className="py-3 px-3 text-text-primary font-medium">{money(item.amount)}</td>
										<td className="py-3 px-3 text-text-muted">{dateLabel(item.nextExpectedPayment)}</td>
										<td className="py-3 px-3"><Confidence value={item.confidence} /></td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</GlassCard>

				{/* Footer note */}
				<p className="text-center text-xs text-text-muted pt-2 pb-6">
					Confidence is based on payment timing, amount consistency, and transaction history. Always confirm a subscription before cancelling it.
				</p>
			</div>
		</main>
	);
}
