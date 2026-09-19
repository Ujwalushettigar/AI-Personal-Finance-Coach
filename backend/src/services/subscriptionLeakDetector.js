function round(value) {
	return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function detectPotentialLeaks(subscriptions = [], options = {}) {
	const expensiveMonthlyCost = Number(options.expensiveMonthlyCost || 30);
	const lowConfidence = Number(options.lowConfidence || 70);

	return subscriptions
		.map((subscription) => {
			const reasons = [];
			const monthlyCost = Number(subscription.monthlyCost || 0);
			const confidence = Number(subscription.confidence || 0);
			if (monthlyCost >= expensiveMonthlyCost) reasons.push('High recurring cost');
			if (confidence < lowConfidence) reasons.push('Pattern needs review');
			if (subscription.cadence === 'yearly') reasons.push('Annual renewal can be easy to miss');

			if (!reasons.length) return null;
			const severity = monthlyCost >= expensiveMonthlyCost * 2 || confidence < 50 ? 'high' : 'medium';
			return {
				id: `leak-${subscription.id}`,
				subscriptionId: subscription.id,
				merchant: subscription.merchant,
				monthlyCost: round(monthlyCost),
				yearlyCost: round(Number(subscription.yearlyCost || monthlyCost * 12)),
				potentialMonthlySavings: round(monthlyCost * (severity === 'high' ? 0.75 : 0.5)),
				confidence,
				severity,
				reasons,
				recommendation: 'Review recent usage and cancel or downgrade if it no longer provides value.',
			};
		})
		.filter(Boolean)
		.sort((a, b) => b.potentialMonthlySavings - a.potentialMonthlySavings);
}

module.exports = { detectPotentialLeaks };
