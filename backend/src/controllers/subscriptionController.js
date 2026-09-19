const {
	detectRecurringExpenses,
	summarizeSubscriptions,
} = require('../services/recurringDetection');
const { detectPotentialLeaks } = require('../services/subscriptionLeakDetector');
const { getSupabaseClient } = require('../config/db');
const { SubscriptionModel } = require('../models/Subscription');

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
	const userId = req.user?.sub || req.user?.id;
	const recurringExpenses = detectRecurringExpenses(await transactionsForUser(req));
	
	// Auto-detected subscriptions
	const autoSubscriptions = recurringExpenses.filter((item) => item.likelySubscription);
	
	// Fetch manually added subscriptions from DB
	let dbSubscriptions = [];
	try {
		if (userId) {
			dbSubscriptions = await SubscriptionModel.getUserSubscriptions(userId, req.authToken);
		}
	} catch (err) {
		console.error("Failed to fetch DB subscriptions:", err);
	}

	// Merge subscriptions, prioritizing DB (manual) ones
	const dbMerchants = new Set(dbSubscriptions.map(s => s.merchant.toLowerCase()));
	const mergedSubscriptions = [
		...dbSubscriptions,
		...autoSubscriptions.filter(s => !dbMerchants.has(s.merchant.toLowerCase()))
	];

	const rarelyUsedIds = Array.isArray(req.body?.rarelyUsedIds) ? req.body.rarelyUsedIds : [];
	const leaks = detectPotentialLeaks(mergedSubscriptions, { rarelyUsedIds });
	
	return { recurringExpenses, subscriptions: mergedSubscriptions, leaks };
}

function sendError(res, error) {
	return res.status(error.statusCode || 500).json({ error: 'Unable to process subscriptions', details: error.message });
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

async function addSubscription(req, res) {
	try {
		const userId = req.user?.sub || req.user?.id;
		if (!userId) {
			const error = new Error('Authenticated user ID is missing from the access token.');
			error.statusCode = 401;
			throw error;
		}

		const { merchant, cadence, amount } = req.body;
		if (!merchant || !cadence || amount === undefined) {
			const error = new Error('Missing required fields: merchant, cadence, amount');
			error.statusCode = 400;
			throw error;
		}

		// Calculate costs based on cadence
		const numericAmount = Number(amount);
		let monthlyCost = 0;
		let yearlyCost = 0;
		switch(cadence) {
			case 'weekly': monthlyCost = numericAmount * 4.33; yearlyCost = numericAmount * 52; break;
			case 'biweekly': monthlyCost = numericAmount * 2.16; yearlyCost = numericAmount * 26; break;
			case 'monthly': monthlyCost = numericAmount; yearlyCost = numericAmount * 12; break;
			case 'quarterly': monthlyCost = numericAmount / 3; yearlyCost = numericAmount * 4; break;
			case 'yearly': monthlyCost = numericAmount / 12; yearlyCost = numericAmount; break;
			default: monthlyCost = numericAmount; yearlyCost = numericAmount * 12; break;
		}

		const newSub = await SubscriptionModel.addSubscription({
			merchant,
			cadence,
			amount: numericAmount,
			monthlyCost,
			yearlyCost
		}, userId, req.authToken);

		return res.status(201).json({ success: true, subscription: newSub });
	} catch (error) {
		return sendError(res, error);
	}
}

module.exports = { getSubscriptions, getRecurring, getLeaks, detect, addSubscription };
