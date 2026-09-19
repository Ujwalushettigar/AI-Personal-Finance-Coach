/**
 * Frontend Budget & Savings Goals API Service
 * Member C Module: FinPilot
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Generic fetch wrapper with fallback mock handling for standalone development
 */
async function fetchApi(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(errorData.message || 'API Request Failed');
    }

    return await res.json();
  } catch (err) {
    console.warn(`[Budget API Fallback] Error connecting to backend (${endpoint}):`, err.message);
    throw err;
  }
}

export const budgetApi = {
  // --- Budgets ---
  async getBudgets() {
    return fetchApi('/budgets');
  },

  async createBudget(data) {
    return fetchApi('/budgets', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateBudget(id, data) {
    return fetchApi(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteBudget(id) {
    return fetchApi(`/budgets/${id}`, {
      method: 'DELETE'
    });
  },

  // --- Savings Goals ---
  async getGoals() {
    return fetchApi('/budgets/goals');
  },

  async createGoal(data) {
    return fetchApi('/budgets/goals', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async updateGoal(id, data) {
    return fetchApi(`/budgets/goals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  async deleteGoal(id) {
    return fetchApi(`/budgets/goals/${id}`, {
      method: 'DELETE'
    });
  },

  // --- Financial Health Score ---
  async getHealthScore() {
    return fetchApi('/budgets/health-score');
  }
};

export default budgetApi;
