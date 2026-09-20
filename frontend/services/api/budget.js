/**
 * Frontend Budget & Savings Goals API Service
 * Member C - AI-Personal-Finance-Coach
 */

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const API_BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api'}/budget`;

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

// --- Budgets with Real Spend & Summary ---

export async function getBudgetsWithSpend(period = 'monthly') {
  const res = await fetch(`${API_BASE_URL}/with-spend?period=${period}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
  });

  return handleResponse(res);
}

export async function getBudgetSummary(period = 'monthly') {
  const res = await fetch(`${API_BASE_URL}/summary?period=${period}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
  });

  return handleResponse(res);
}

// --- Budgets CRUD ---

export async function getBudgets() {
  const res = await fetch(API_BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
  });

  return handleResponse(res);
}

export async function createBudget(data) {
  const payload = {
    category: data.category,
    amount_limit: Number(data.amount_limit ?? data.amountLimit ?? 0),
    period: data.period || 'monthly',
  };

  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

export async function updateBudget(id, data) {
  const payload = {
    category: data.category,
    amount_limit: Number(data.amount_limit ?? data.amountLimit ?? 0),
    period: data.period || 'monthly',
  };

  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

export async function deleteBudget(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
  });

  return handleResponse(res);
}

// --- Savings Goals ---

export async function getSavingsGoals() {
  const res = await fetch(`${API_BASE_URL}/goals`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
  });

  return handleResponse(res);
}

export const getGoals = getSavingsGoals;

export async function createSavingsGoal(data) {
  const res = await fetch(`${API_BASE_URL}/goals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export const createGoal = createSavingsGoal;

export async function updateSavingsGoal(id, data) {
  const res = await fetch(`${API_BASE_URL}/goals/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export const updateGoal = updateSavingsGoal;

export async function addSavingsProgress(id, addedAmount) {
  const res = await fetch(`${API_BASE_URL}/goals/${id}/progress`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
    body: JSON.stringify({ addedAmount }),
  });

  return handleResponse(res);
}

export async function deleteSavingsGoal(id) {
  const res = await fetch(`${API_BASE_URL}/goals/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(await getAuthHeaders()),
    },
  });

  return handleResponse(res);
}

export const deleteGoal = deleteSavingsGoal;

// --- Financial Health Score ---

export async function getHealthScore() {
  try {
    const res = await fetch(`${API_BASE_URL}/health-score`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(await getAuthHeaders()),
      },
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (err) {
    return null;
  }
}

export const budgetApi = {
  getBudgetsWithSpend,
  getBudgetSummary,
  getBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  getSavingsGoals,
  getGoals,
  createSavingsGoal,
  createGoal,
  updateSavingsGoal,
  updateGoal,
  addSavingsProgress,
  deleteSavingsGoal,
  deleteGoal,
  getHealthScore,
};

export default budgetApi;
