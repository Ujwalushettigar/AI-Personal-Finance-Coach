const {
	detectRecurringExpenses,
	summarizeSubscriptions,
} = require('../services/recurringDetection');
const { detectPotentialLeaks } = require('../services/subscriptionLeakDetector');
const { getSupabaseClient } = require('../config/db');

async function transactionsForUser(req) {
	const userId = req.user?.sub || req.user?.id;
	if (!userId) {
		const error = new Error('Authenticated user ID is missing from the access token.');
		error.statusCode = 401;
		throw error;
	}

	const { data, error } = await getSupabaseClient(req.authToken).from('transactions')
		.select('*')
		.eq('user_id', userId)
		.order('date', { ascending: true });

	if (error) throw error;
	return data || [];
}

async function analyze(req) {
	const recurringExpenses = detectRecurringExpenses(await transactionsForUser(req));
	const subscriptions = recurringExpenses.filter((item) => item.likelySubscription);
	const rarelyUsedIds = Array.isArray(req.body?.rarelyUsedIds) ? req.body.rarelyUsedIds : [];
	const leaks = detectPotentialLeaks(subscriptions, { rarelyUsedIds });
	return { recurringExpenses, subscriptions, leaks };
}

function sendError(res, error) {
	return res.status(error.statusCode || 500).json({ error: 'Unable to analyze subscriptions', details: error.message });
}

async function getSubscriptions(req, res) {
	try {
		const { recurringExpenses, subscriptions, leaks } = await analyze(req);
		return res.json({ recurringExpenses, subscriptions, leaks, summary: summarizeSubscriptions(subscriptions) });
	} catch (error) {
		return sendError(res, error);
	}
}

async function getRecurring(req, res) {
	try {
		const { recurringExpenses } = await analyze(req);
		return res.json({ recurringExpenses, count: recurringExpenses.length });
	} catch (error) {
		return sendError(res, error);
	}
}

async function getLeaks(req, res) {
	try {
		const { leaks } = await analyze(req);
		return res.json({
			leaks,
			count: leaks.length,
			totalPotentialMonthlySavings: leaks.reduce((total, leak) => total + leak.potentialMonthlySavings, 0),
		});
	} catch (error) {
		return sendError(res, error);
	}
}

async function detect(req, res) {
	try {
		const result = await analyze(req);
		return res.status(200).json({ ...result, summary: summarizeSubscriptions(result.subscriptions) });
	} catch (error) {
		return sendError(res, error);
	}
}

module.exports = { getSubscriptions, getRecurring, getLeaks, detect };
