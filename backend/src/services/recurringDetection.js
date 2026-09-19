const CADENCES = {
	weekly: { min: 5, max: 9, days: 7, monthlyMultiplier: 52 / 12 },
	biweekly: { min: 12, max: 18, days: 14, monthlyMultiplier: 26 / 12 },
	monthly: { min: 25, max: 35, days: 30, monthlyMultiplier: 1 },
	quarterly: { min: 75, max: 105, days: 91, monthlyMultiplier: 1 / 3 },
	yearly: { min: 330, max: 395, days: 365, monthlyMultiplier: 1 / 12 },
};

function round(value, decimals = 2) {
	const factor = 10 ** decimals;
	return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

function normalizeMerchant(value = '') {
	return String(value)
		.toLowerCase()
		.replace(/https?:\/\/|www\./g, '')
		.replace(/[^a-z0-9]+/g, ' ')
		.trim()
		.replace(/\s+/g, ' ');
}

function displayMerchant(transaction) {
	return String(
		transaction.merchant || transaction.merchantName || transaction.description || 'Unknown merchant',
	).trim();
}

function transactionDate(transaction) {
	const value = transaction.date || transaction.transactionDate || transaction.createdAt;
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeTransactions(transactions = []) {
	return transactions
		.map((transaction) => {
			const amount = Math.abs(Number(transaction.amount));
			const date = transactionDate(transaction);
			const type = String(transaction.type || transaction.transactionType || 'expense').toLowerCase();
			return {
				...transaction,
				amount,
				date,
				merchant: displayMerchant(transaction),
				merchantKey: normalizeMerchant(displayMerchant(transaction)),
				isExpense: !['income', 'credit', 'deposit', 'refund'].includes(type) && amount > 0,
			};
		})
		.filter((transaction) => transaction.isExpense && transaction.merchantKey && transaction.date);
}

function median(values) {
	const sorted = [...values].sort((a, b) => a - b);
	const middle = Math.floor(sorted.length / 2);
	return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}

function average(values) {
	return values.reduce((total, value) => total + value, 0) / values.length;
}

function cadenceFor(interval) {
	return Object.entries(CADENCES).find(([, cadence]) => interval >= cadence.min && interval <= cadence.max);
}

function confidenceFor(intervals, amounts, cadence) {
	const typicalInterval = cadence.days;
	const intervalVariance = average(intervals.map((value) => Math.abs(value - typicalInterval)));
	const frequencyScore = Math.max(0, 1 - intervalVariance / typicalInterval);
	const typicalAmount = median(amounts);
	const amountVariance = average(amounts.map((value) => Math.abs(value - typicalAmount))) / typicalAmount;
	const amountScore = Math.max(0, 1 - Math.min(amountVariance, 1));
	const historyScore = Math.min(1, amounts.length / 5);
	return Math.round((frequencyScore * 0.45 + amountScore * 0.35 + historyScore * 0.2) * 100);
}

function formatDate(date) {
	return date.toISOString().slice(0, 10);
}

function detectRecurringExpenses(transactions = []) {
	const groups = new Map();
	normalizeTransactions(transactions).forEach((transaction) => {
		if (!groups.has(transaction.merchantKey)) groups.set(transaction.merchantKey, []);
		groups.get(transaction.merchantKey).push(transaction);
	});

	const results = [];
	groups.forEach((items, merchantKey) => {
		const ordered = [...items].sort((a, b) => a.date - b.date);
		if (ordered.length < 2) return;

		const intervals = ordered.slice(1).map((item, index) =>
			Math.max(1, Math.round((item.date - ordered[index].date) / 86400000)),
		);
		const averageInterval = average(intervals);
		const matchedCadence = cadenceFor(averageInterval);
		if (!matchedCadence) return;

		const [cadence, cadenceDetails] = matchedCadence;
		const amounts = ordered.map((item) => item.amount);
		const averageAmount = average(amounts);
		const typicalAmount = median(amounts);
		const lastPayment = ordered[ordered.length - 1].date;
		const nextPayment = new Date(lastPayment);
		nextPayment.setDate(nextPayment.getDate() + cadenceDetails.days);
		const confidence = confidenceFor(intervals, amounts, cadenceDetails);

		results.push({
			id: `subscription-${merchantKey.replace(/\s+/g, '-')}`,
			merchant: ordered[ordered.length - 1].merchant,
			cadence,
			frequency: cadence,
			amount: round(typicalAmount),
			averageAmount: round(averageAmount),
			monthlyCost: round(typicalAmount * cadenceDetails.monthlyMultiplier),
			yearlyCost: round(typicalAmount * cadenceDetails.monthlyMultiplier * 12),
			confidence,
			transactionCount: ordered.length,
			lastPayment: formatDate(lastPayment),
			nextExpectedPayment: formatDate(nextPayment),
			averageIntervalDays: round(averageInterval, 1),
			transactions: ordered.map((item) => ({
				amount: round(item.amount),
				date: formatDate(item.date),
			})),
			likelySubscription: confidence >= 60 && ['monthly', 'quarterly', 'yearly'].includes(cadence),
		});
	});

	return results.sort((a, b) => b.monthlyCost - a.monthlyCost);
}

function summarizeSubscriptions(subscriptions = []) {
	return {
		totalSubscriptions: subscriptions.filter((item) => item.likelySubscription !== false).length,
		monthlyCost: round(subscriptions.reduce((total, item) => total + Number(item.monthlyCost || 0), 0)),
		yearlyCost: round(subscriptions.reduce((total, item) => total + Number(item.yearlyCost || 0), 0)),
		recurringExpenseCount: subscriptions.length,
	};
}

module.exports = {
	CADENCES,
	detectRecurringExpenses,
	normalizeTransactions,
	normalizeMerchant,
	summarizeSubscriptions,
};
