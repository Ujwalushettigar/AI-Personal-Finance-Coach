/**
 * Subscriptions API Service Client
 * Member B - AI-Personal-Finance-Coach
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'}/subscriptions`;

async function getAuthHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token
    ? { Authorization: `Bearer ${session.access_token}` }
    : {};
}

async function handleResponse(res) {
  let data;
  try {
    data = await res.json();
  } catch (err) {
    throw new Error(`HTTP ${res.status}: Failed to parse server response`);
  }

  if (!res.ok) {
    const errorMessage = data?.error || data?.message || `Request failed with status ${res.status}`;
    throw new Error(errorMessage);
  }

  return data;
}

export async function getSubscriptions(filters = {}) {
  const queryParams = new URLSearchParams();
  if (filters.likelyOnly) queryParams.append('likelyOnly', 'true');
  if (filters.rarelyUsedOnly) queryParams.append('rarelyUsedOnly', 'true');
  const queryString = queryParams.toString();
  const url = queryString ? `${API_BASE_URL}?${queryString}` : API_BASE_URL;

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
  });

  return handleResponse(res);
}

export async function getSubscription(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
  });

  return handleResponse(res);
}

export async function deleteSubscription(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
  });

  return handleResponse(res);
}

export async function markRarelyUsed(id, value = true) {
  const res = await fetch(`${API_BASE_URL}/${id}/rarely-used`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify({ rarely_used: value }),
  });

  return handleResponse(res);
}

export default {
  getSubscriptions,
  getSubscription,
  deleteSubscription,
  markRarelyUsed,
};
