/**
 * Transactions API Service Client
 * Member A - AI-Personal-Finance-Coach
 * 
 * Provides client-side methods to interact with /api/transactions REST endpoints.
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'}/transactions`;
  }
  return 'http://localhost:5000/api/transactions';
};

const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token
    ? { Authorization: `Bearer ${session.access_token}` }
    : {};
};

const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch (err) {
    throw new Error(`HTTP ${response.status}: Failed to parse server response`);
  }

  if (!response.ok) {
    const errorMessage = data?.error || data?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return data;
};

/**
 * Fetch all transactions with optional filters
 */
export const getTransactions = async (filters = {}) => {
  const baseUrl = getApiBaseUrl();
  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });

  const queryString = queryParams.toString();
  const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    }
  });

  return handleResponse(response);
};

/**
 * Get transaction by ID
 */
export const getTransactionById = async (id) => {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    }
  });

  return handleResponse(response);
};

/**
 * Create a new transaction
 */
export const createTransaction = async (transactionData) => {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(baseUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(transactionData)
  });

  return handleResponse(response);
};

/**
 * Update transaction by ID
 */
export const updateTransaction = async (id, updateData) => {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(updateData)
  });

  return handleResponse(response);
};

/**
 * Delete transaction by ID
 */
export const deleteTransaction = async (id) => {
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    }
  });

  return handleResponse(response);
};

export default {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
};
