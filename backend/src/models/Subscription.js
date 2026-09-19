const { getSupabaseClient } = require('../config/db');

function createSubscription(data = {}) {
	return {
		id: data.id,
		merchant: data.merchant || 'Unknown merchant',
		cadence: data.cadence || data.frequency || 'monthly',
		amount: Number(data.amount || 0),
		monthlyCost: Number(data.monthlyCost || 0),
		yearlyCost: Number(data.yearlyCost || 0),
		confidence: Number(data.confidence || 0),
		lastPayment: data.lastPayment || null,
		nextExpectedPayment: data.nextExpectedPayment || null,
		transactionCount: Number(data.transactionCount || 0),
		likelySubscription: data.likelySubscription !== false,
	};
}

function subscriptionSummary(subscriptions = []) {
	return subscriptions.reduce(
		(summary, subscription) => ({
			totalSubscriptions: summary.totalSubscriptions + 1,
			monthlyCost: summary.monthlyCost + Number(subscription.monthlyCost || 0),
			yearlyCost: summary.yearlyCost + Number(subscription.yearlyCost || 0),
		}),
		{ totalSubscriptions: 0, monthlyCost: 0, yearlyCost: 0 },
	);
}

class SubscriptionModel {
	static async getUserSubscriptions(userId, token) {
		const { data, error } = await getSupabaseClient(token)
			.from('subscriptions')
			.select('*')
			.eq('user_id', userId);
		
		if (error) throw error;
		
		return (data || []).map(row => createSubscription({
			id: row.id,
			merchant: row.merchant,
			cadence: row.cadence,
			amount: row.amount,
			monthlyCost: row.monthly_cost,
			yearlyCost: row.yearly_cost,
			confidence: row.confidence,
			lastPayment: row.last_payment,
			nextExpectedPayment: row.next_expected_payment,
			transactionCount: row.transaction_count,
			likelySubscription: row.likely_subscription
		}));
	}

	static async addSubscription(subscriptionData, userId, token) {
		const payload = {
			user_id: userId,
			merchant: subscriptionData.merchant,
			merchant_key: subscriptionData.merchant.toLowerCase().replace(/[^a-z0-9]/g, ''),
			cadence: subscriptionData.cadence,
			amount: subscriptionData.amount,
			monthly_cost: subscriptionData.monthlyCost,
			yearly_cost: subscriptionData.yearlyCost,
			confidence: 100, // manual subscriptions are 100% confident
			likely_subscription: true,
			transaction_count: 0
		};

		const { data, error } = await getSupabaseClient(token)
			.from('subscriptions')
			.insert(payload)
			.select()
			.single();
			
		if (error) {
			if (error.code === '23505') { // unique constraint violation
				throw Object.assign(new Error(`A subscription for ${subscriptionData.merchant} already exists.`), { statusCode: 409 });
			}
			throw error;
		}

		return createSubscription({
			id: data.id,
			merchant: data.merchant,
			cadence: data.cadence,
			amount: data.amount,
			monthlyCost: data.monthly_cost,
			yearlyCost: data.yearly_cost,
			confidence: data.confidence,
			lastPayment: data.last_payment,
			nextExpectedPayment: data.next_expected_payment,
			transactionCount: data.transaction_count,
			likelySubscription: data.likely_subscription
		});
	}
}

module.exports = { createSubscription, subscriptionSummary, SubscriptionModel };
