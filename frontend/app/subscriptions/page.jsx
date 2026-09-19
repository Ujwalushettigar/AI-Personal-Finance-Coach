'use client';

import { useEffect, useMemo, useState } from 'react';
import { detectSubscriptions, getSubscriptions } from '../../services/api/subscriptions';

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

function MetricCard({ label, value, detail, accent }) {
	return <div style={{ ...styles.metricCard, borderTopColor: accent }}><span style={styles.metricLabel}>{label}</span><strong style={styles.metricValue}>{value}</strong><span style={styles.metricDetail}>{detail}</span></div>;
}

function Confidence({ value }) {
	const color = value >= 80 ? '#16a36a' : value >= 60 ? '#d48a1f' : '#d94c58';
	return <span style={{ ...styles.confidence, color, background: `${color}18` }}>{value}% confidence</span>;
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

	return <main style={styles.page}>
		<div style={styles.shell}>
			<header style={styles.header}>
				<div><div style={styles.eyebrow}>FINPILOT / SPENDING INTELLIGENCE</div><h1 style={styles.title}>Subscriptions</h1><p style={styles.subtitle}>See every recurring payment, what it costs, and where your money may be quietly leaking.</p></div>
				<div style={styles.status}>{loading ? 'Analyzing transactions…' : usingDemo ? 'Demo insights · API offline' : 'Live transaction analysis'}<span style={{ ...styles.statusDot, background: usingDemo ? '#d48a1f' : '#16a36a' }} /></div>
			</header>

			<section style={styles.metrics}>
				<MetricCard label="Detected subscriptions" value={summary.totalSubscriptions ?? subscriptions.length} detail="Recurring merchants" accent="#5b6cf5" />
				<MetricCard label="Monthly commitment" value={money(summary.monthlyCost)} detail="Average monthly spend" accent="#16a36a" />
				<MetricCard label="Yearly commitment" value={money(summary.yearlyCost)} detail="Projected annual cost" accent="#d48a1f" />
				<MetricCard label="Potential monthly leaks" value={money(savings)} detail={`${leaks.length} item${leaks.length === 1 ? '' : 's'} worth reviewing`} accent="#d94c58" />
			</section>

			<section style={styles.reviewPanel}>
				<div style={styles.reviewCopy}><div style={styles.reviewIcon}>?</div><div><h2 style={styles.panelTitle}>Which subscriptions do you rarely use?</h2><p style={styles.panelHint}>Select anything you do not use often. We will flag it as a potential money leak for review.</p></div></div>
				<div style={styles.reviewOptions}>{subscriptions.map((subscription) => <label key={subscription.id} style={{ ...styles.reviewOption, ...(rarelyUsedIds.includes(subscription.id) ? styles.reviewOptionSelected : {}) }}><input type="checkbox" checked={rarelyUsedIds.includes(subscription.id)} onChange={() => toggleRarelyUsed(subscription.id)} style={styles.checkbox} /><span style={styles.reviewMerchant}>{subscription.merchant}</span><span style={styles.reviewAmount}>{money(subscription.monthlyCost)}/mo</span></label>)}</div>
				<div style={styles.reviewAction}><button type="button" onClick={reviewRarelyUsed} disabled={!rarelyUsedIds.length || reviewing} style={{ ...styles.reviewButton, opacity: !rarelyUsedIds.length || reviewing ? .55 : 1 }}>{reviewing ? 'Reviewing…' : `Review selected${rarelyUsedIds.length ? ` (${rarelyUsedIds.length})` : ''}`}</button>{reviewMessage && <span style={styles.reviewMessage}>{reviewMessage}</span>}</div>
			</section>

			<section style={styles.contentGrid}>
				<div style={styles.panel}><div style={styles.panelHeader}><div><h2 style={styles.panelTitle}>Your subscriptions</h2><p style={styles.panelHint}>Recurring payments with a predictable cadence</p></div><span style={styles.count}>{subscriptions.length}</span></div>
					<div style={styles.subscriptionList}>{subscriptions.map((subscription) => <article key={subscription.id} style={styles.subscriptionRow}>
						<div style={styles.merchantIcon}>{subscription.merchant.slice(0, 1).toUpperCase()}</div><div style={styles.subscriptionMain}><div style={styles.merchantName}>{subscription.merchant}</div><div style={styles.meta}>{subscription.cadence} · {money(subscription.amount)} per cycle · next {dateLabel(subscription.nextExpectedPayment)}</div><div style={styles.progress}><span style={{ ...styles.progressBar, width: `${Math.min(100, subscription.confidence)}%` }} /></div></div><div style={styles.subscriptionCost}><strong style={styles.subscriptionCostStrong}>{money(subscription.monthlyCost)}</strong><span style={styles.subscriptionCostLabel}>per month</span><Confidence value={subscription.confidence} /></div>
					</article>)}</div>
				</div>

				<aside style={styles.panel}><div style={styles.panelHeader}><div><h2 style={styles.panelTitle}>Potential leaks</h2><p style={styles.panelHint}>Recurring expenses that deserve a second look</p></div><span style={{ ...styles.count, color: '#d94c58', background: '#fff0f1' }}>{leaks.length}</span></div><div>{leaks.length ? leaks.map((leak) => <article key={leak.id} style={styles.leakRow}><div style={styles.leakTop}><span style={{ ...styles.severity, color: leak.severity === 'high' ? '#d94c58' : '#d48a1f' }}>{leak.severity} priority</span><strong>{leak.merchant}</strong><span style={styles.leakCost}>{money(leak.monthlyCost)}/mo</span></div><p style={styles.reason}>{leak.reasons?.join(' · ')}</p><div style={styles.savings}>Could save about <strong>{money(leak.potentialMonthlySavings)}/mo</strong></div></article>) : <p style={styles.empty}>No potential leaks detected. Nice work!</p>}</div></aside>
			</section>

			<section style={styles.panel}><div style={styles.panelHeader}><div><h2 style={styles.panelTitle}>Recurring expenses</h2><p style={styles.panelHint}>Every repeated expense pattern found in your transaction history</p></div><span style={styles.count}>{recurring.length}</span></div><div style={styles.tableWrap}><table style={styles.table}><thead><tr><th>Merchant</th><th>Pattern</th><th>Typical payment</th><th>Next payment</th><th>Confidence</th></tr></thead><tbody>{recurring.map((item) => <tr key={item.id}><td style={styles.tableMerchant}>{item.merchant}</td><td style={styles.capitalize}>{item.cadence}</td><td>{money(item.amount)}</td><td>{dateLabel(item.nextExpectedPayment)}</td><td><Confidence value={item.confidence} /></td></tr>)}</tbody></table></div></section>
			<footer style={styles.footer}>Confidence is based on payment timing, amount consistency, and transaction history. Always confirm a subscription before cancelling it.</footer>
		</div>
	</main>;
}

const styles = {
	page: { minHeight: '100vh', background: '#f5f7fb', color: '#162033', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', padding: '40px 20px' },
	shell: { maxWidth: 1180, margin: '0 auto' },
	header: { display: 'flex', justifyContent: 'space-between', gap: 24, alignItems: 'flex-start', marginBottom: 32 },
	eyebrow: { color: '#5b6cf5', fontSize: 11, fontWeight: 800, letterSpacing: 1.8, marginBottom: 10 },
	title: { fontSize: 'clamp(32px, 5vw, 48px)', letterSpacing: -1.5, margin: 0, lineHeight: 1.1 },
	subtitle: { color: '#6d7890', fontSize: 15, lineHeight: 1.6, maxWidth: 580, margin: '12px 0 0' },
	status: { color: '#6d7890', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', paddingTop: 10 },
	statusDot: { width: 8, height: 8, borderRadius: '50%', display: 'inline-block' },
	metrics: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 14, marginBottom: 18 },
	metricCard: { background: '#fff', border: '1px solid #e7eaf1', borderTop: '3px solid', borderRadius: 14, padding: '20px 21px', boxShadow: '0 8px 24px rgba(39, 52, 86, .04)' },
	metricLabel: { display: 'block', color: '#6d7890', fontSize: 12, fontWeight: 700, marginBottom: 10 },
	metricValue: { display: 'block', fontSize: 27, letterSpacing: -.7, marginBottom: 5 }, metricDetail: { color: '#98a1b2', fontSize: 12 },
	reviewPanel: { background: '#f0f3ff', border: '1px solid #dce2ff', borderRadius: 16, padding: 22, marginBottom: 18 }, reviewCopy: { display: 'flex', gap: 12, alignItems: 'flex-start' }, reviewIcon: { display: 'grid', placeItems: 'center', width: 28, height: 28, flex: '0 0 28px', borderRadius: '50%', background: '#5b6cf5', color: '#fff', fontWeight: 800 }, reviewOptions: { display: 'flex', flexWrap: 'wrap', gap: 9, margin: '18px 0' }, reviewOption: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: '#fff', border: '1px solid #dce2f1', borderRadius: 9, cursor: 'pointer', fontSize: 12 }, reviewOptionSelected: { borderColor: '#5b6cf5', boxShadow: '0 0 0 2px #5b6cf522' }, checkbox: { accentColor: '#5b6cf5', width: 15, height: 15 }, reviewMerchant: { fontWeight: 750 }, reviewAmount: { color: '#6d7890' }, reviewAction: { display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }, reviewButton: { border: 0, borderRadius: 8, padding: '10px 14px', background: '#5b6cf5', color: '#fff', fontWeight: 750, cursor: 'pointer' }, reviewMessage: { color: '#16865a', fontSize: 12, fontWeight: 700 },
	contentGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 18, marginBottom: 18 },
	panel: { background: '#fff', border: '1px solid #e7eaf1', borderRadius: 16, padding: 22, boxShadow: '0 8px 24px rgba(39, 52, 86, .04)', marginBottom: 18 },
	panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 18 }, panelTitle: { margin: 0, fontSize: 17, letterSpacing: -.2 }, panelHint: { margin: '6px 0 0', color: '#8a94a7', fontSize: 12 }, count: { display: 'grid', placeItems: 'center', minWidth: 28, height: 28, borderRadius: 9, background: '#eef0ff', color: '#5b6cf5', fontWeight: 800, fontSize: 12 },
	subscriptionList: { display: 'grid', gap: 4 }, subscriptionRow: { display: 'flex', gap: 13, alignItems: 'center', padding: '13px 0', borderTop: '1px solid #f0f2f6' }, merchantIcon: { display: 'grid', placeItems: 'center', width: 38, height: 38, flex: '0 0 38px', borderRadius: 11, background: '#eef0ff', color: '#5b6cf5', fontWeight: 800 }, subscriptionMain: { minWidth: 0, flex: 1 }, merchantName: { fontWeight: 750, fontSize: 14 }, meta: { color: '#8a94a7', fontSize: 11, marginTop: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }, progress: { height: 4, background: '#edf0f5', borderRadius: 4, marginTop: 10, maxWidth: 220 }, progressBar: { display: 'block', height: '100%', borderRadius: 4, background: '#16a36a' }, subscriptionCost: { textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }, subscriptionCostStrong: { fontSize: 14 }, subscriptionCostLabel: { color: '#98a1b2', fontSize: 10 }, confidence: { display: 'inline-block', borderRadius: 5, padding: '4px 6px', fontSize: 10, fontWeight: 750, whiteSpace: 'nowrap' },
	leakRow: { padding: '14px 0', borderTop: '1px solid #f0f2f6' }, leakTop: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', fontSize: 13 }, severity: { fontSize: 10, textTransform: 'uppercase', letterSpacing: .5, fontWeight: 800 }, leakCost: { marginLeft: 'auto', fontWeight: 800 }, reason: { color: '#8a94a7', fontSize: 11, margin: '8px 0' }, savings: { color: '#16a36a', background: '#eefaf5', borderRadius: 7, padding: '7px 9px', fontSize: 11 }, empty: { color: '#8a94a7', fontSize: 13, padding: '20px 0' },
	tableWrap: { overflowX: 'auto' }, table: { width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 620 }, th: { textAlign: 'left', padding: '10px 12px', color: '#98a1b2', fontSize: 10, textTransform: 'uppercase', letterSpacing: .7, borderBottom: '1px solid #edf0f5' }, td: { padding: '14px 12px', borderBottom: '1px solid #f0f2f6', color: '#6d7890' }, tableMerchant: { color: '#162033', fontWeight: 750 }, capitalize: { textTransform: 'capitalize' }, footer: { color: '#98a1b2', fontSize: 11, textAlign: 'center', padding: '2px 0 20px' },
};
