const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		headers: { 'Content-Type': 'application/json', ...options.headers },
		...options,
	});
	if (!response.ok) throw new Error(`Subscription API returned ${response.status}`);
	return response.json();
}

export function getSubscriptions() {
	return request('/subscriptions');
}

export function getRecurringExpenses() {
	return request('/subscriptions/recurring');
}

export function getSubscriptionLeaks() {
	return request('/subscriptions/leaks');
}

export function detectSubscriptions(transactions) {
	return request('/subscriptions/detect', {
		method: 'POST',
		body: JSON.stringify({ transactions }),
	});
}
