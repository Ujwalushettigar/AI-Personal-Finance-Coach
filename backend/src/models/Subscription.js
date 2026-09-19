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

module.exports = { createSubscription, subscriptionSummary };
