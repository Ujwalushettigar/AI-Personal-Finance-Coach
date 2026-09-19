const {
	detectRecurringExpenses,
	summarizeSubscriptions,
} = require('../services/recurringDetection');
const { detectPotentialLeaks } = require('../services/subscriptionLeakDetector');

const DEMO_TRANSACTIONS = [
	{ merchant: 'StreamFlix', amount: 15.99, date: '2026-05-05' },
	{ merchant: 'StreamFlix', amount: 15.99, date: '2026-06-05' },
	{ merchant: 'StreamFlix', amount: 15.99, date: '2026-07-05' },
	{ merchant: 'StreamFlix', amount: 15.99, date: '2026-08-05' },
	{ merchant: 'CloudBox Pro', amount: 49.99, date: '2026-05-12' },
	{ merchant: 'CloudBox Pro', amount: 49.99, date: '2026-06-12' },
	{ merchant: 'CloudBox Pro', amount: 49.99, date: '2026-07-12' },
	{ merchant: 'CloudBox Pro', amount: 49.99, date: '2026-08-12' },
	{ merchant: 'Fit Studio', amount: 29, date: '2026-05-01' },
	{ merchant: 'Fit Studio', amount: 29, date: '2026-06-01' },
	{ merchant: 'Fit Studio', amount: 31, date: '2026-07-01' },
	{ merchant: 'Fit Studio', amount: 29, date: '2026-08-01' },
	{ merchant: 'Design Annual', amount: 199, date: '2025-08-20' },
	{ merchant: 'Design Annual', amount: 199, date: '2026-08-20' },
	{ merchant: 'Grocery Market', amount: 72, date: '2026-08-18' },
];

function transactionsFromRequest(req) {
	if (Array.isArray(req.body?.transactions)) return req.body.transactions;
	if (Array.isArray(req.app?.locals?.transactions)) return req.app.locals.transactions;
	if (req.query?.transactions) {
		try {
			const parsed = JSON.parse(req.query.transactions);
			if (Array.isArray(parsed)) return parsed;
		} catch (error) {
			// Ignore malformed optional query data and use the configured source.
		}
	}
	return DEMO_TRANSACTIONS;
}

function analyze(req) {
	const recurringExpenses = detectRecurringExpenses(transactionsFromRequest(req));
	const subscriptions = recurringExpenses.filter((item) => item.likelySubscription);
	const rarelyUsedIds = Array.isArray(req.body?.rarelyUsedIds) ? req.body.rarelyUsedIds : [];
	const leaks = detectPotentialLeaks(subscriptions, { rarelyUsedIds });
	return { recurringExpenses, subscriptions, leaks };
}

function sendError(res, error) {
	return res.status(500).json({ error: 'Unable to analyze subscriptions', details: error.message });
}

function getSubscriptions(req, res) {
	try {
		const { recurringExpenses, subscriptions, leaks } = analyze(req);
		return res.json({ recurringExpenses, subscriptions, leaks, summary: summarizeSubscriptions(subscriptions) });
	} catch (error) {
		return sendError(res, error);
	}
}

function getRecurring(req, res) {
	try {
		const { recurringExpenses } = analyze(req);
		return res.json({ recurringExpenses, count: recurringExpenses.length });
	} catch (error) {
		return sendError(res, error);
	}
}

function getLeaks(req, res) {
	try {
		const { leaks } = analyze(req);
		return res.json({
			leaks,
			count: leaks.length,
			totalPotentialMonthlySavings: leaks.reduce((total, leak) => total + leak.potentialMonthlySavings, 0),
		});
	} catch (error) {
		return sendError(res, error);
	}
}

function detect(req, res) {
	try {
		const result = analyze(req);
		return res.status(200).json({ ...result, summary: summarizeSubscriptions(result.subscriptions) });
	} catch (error) {
		return sendError(res, error);
	}
}

module.exports = { getSubscriptions, getRecurring, getLeaks, detect };
