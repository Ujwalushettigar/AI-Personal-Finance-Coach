/**
 * Transactions API Service Client
 * Member A - AI-Personal-Finance-Coach
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'}/transactions`;

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

export async function getTransactions(filters = {}) {
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      queryParams.append(key, val);
    }
  });
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

export async function getTransaction(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
  });

  return handleResponse(res);
}

export const getTransactionById = getTransaction;

export async function createTransaction(transactionData) {
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(transactionData),
  });

  return handleResponse(res);
}

export async function updateTransaction(id, updateData) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(updateData),
  });

  return handleResponse(res);
}

export async function deleteTransaction(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
  });

  return handleResponse(res);
}

export async function previewImportCsv(file) {
  const formData = new FormData();
  formData.append('file', file);

  const authHeaders = await getAuthHeaders();

  const res = await fetch(`${API_BASE_URL}/preview-import`, {
    method: 'POST',
    headers: {
      ...authHeaders,
    },
    body: formData,
  });

  return handleResponse(res);
}

export async function importTransactionsCsv(file, mapping = {}) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('mapping', typeof mapping === 'object' ? JSON.stringify(mapping) : mapping);

  const authHeaders = await getAuthHeaders();

  const res = await fetch(`${API_BASE_URL}/import`, {
    method: 'POST',
    headers: {
      ...authHeaders,
    },
    body: formData,
  });

  return handleResponse(res);
}

export default {
  getTransactions,
  getTransaction,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  previewImportCsv,
  importTransactionsCsv,
};
