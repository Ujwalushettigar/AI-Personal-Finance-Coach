import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
	const { data: { session } } = await supabase.auth.getSession();
	const response = await fetch(`${API_BASE_URL}${path}`, {
		headers: {
			'Content-Type': 'application/json',
			...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
			...options.headers,
		},
		...options,
	});
	if (!response.ok) {
		const payload = await response.json().catch(() => ({}));
		throw new Error(payload.error || `Subscription API returned ${response.status}`);
	}
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

export function detectSubscriptions(transactions, rarelyUsedIds = []) {
	return request('/subscriptions/detect', {
		method: 'POST',
		body: JSON.stringify({ transactions, rarelyUsedIds }),
	});
}
