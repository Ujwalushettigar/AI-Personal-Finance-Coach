/**
 * Budget & Savings Goal Controller
 * Member C - AI-Personal-Finance-Coach
 */

const { getSupabaseClient } = require('../config/db');
const {
  getBudgetsWithSpend: fetchBudgetsWithSpend,
  getBudgetSummary: fetchBudgetSummary,
} = require('../services/budgetService');

const {
  getBudgets,
  getBudgetById,
  createBudget: createBudgetModel,
  updateBudget: updateBudgetModel,
  deleteBudget: deleteBudgetModel,
} = require('../models/Budget');

const {
  getSavingsGoals,
  getSavingsGoalById,
  createSavingsGoal: createSavingsGoalModel,
  updateSavingsGoal: updateSavingsGoalModel,
  updateProgress,
  deleteSavingsGoal: deleteSavingsGoalModel,
} = require('../models/SavingsGoal');

// --- Budgets with Real Spend & Summary Handlers ---

async function listBudgetsWithSpend(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const period = req.query.period || 'monthly';
    const result = await fetchBudgetsWithSpend(token, period);
    return res.json(result);
  } catch (err) {
    console.error('Error in listBudgetsWithSpend:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function getBudgetSummary(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const period = req.query.period || 'monthly';
    const result = await fetchBudgetSummary(token, period);
    return res.json(result);
  } catch (err) {
    console.error('Error in getBudgetSummary:', err);
    return res.status(500).json({ error: err.message });
  }
}

// --- Budgets Handlers ---

async function listBudgets(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const budgets = await getBudgets(userId, token);
    return res.json(budgets);
  } catch (err) {
    console.error('Error in listBudgets:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function createBudget(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const { category, amount_limit, period } = req.body;

    if (!category || amount_limit === undefined || amount_limit === null || amount_limit === '' || !period) {
      return res.status(400).json({ error: 'Missing required fields: category, amount_limit, and period are required.' });
    }

    const newBudget = await createBudgetModel(userId, { category, amount_limit, period }, token);
    return res.status(201).json(newBudget);
  } catch (err) {
    console.error('Error in createBudget:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function updateBudget(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const { id } = req.params;
    const updated = await updateBudgetModel(userId, id, req.body, token);
    if (!updated) {
      return res.status(404).json({ error: 'Budget not found or access denied' });
    }
    return res.json(updated);
  } catch (err) {
    console.error('Error in updateBudget:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function deleteBudget(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const { id } = req.params;
    const deleted = await deleteBudgetModel(userId, id, token);
    if (!deleted) {
      return res.status(404).json({ error: 'Budget not found or access denied' });
    }
    return res.json({ message: 'Budget deleted successfully', budget: deleted });
  } catch (err) {
    console.error('Error in deleteBudget:', err);
    return res.status(500).json({ error: err.message });
  }
}

// --- Savings Goals Handlers ---

async function listSavingsGoals(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const goals = await getSavingsGoals(userId, token);
    return res.json(goals);
  } catch (err) {
    console.error('Error in listSavingsGoals:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function createSavingsGoal(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const { title, target_amount, current_amount, target_date, category } = req.body;

    if (!title || target_amount === undefined || target_amount === null || target_amount === '') {
      return res.status(400).json({ error: 'Missing required fields: title and target_amount are required.' });
    }

    const newGoal = await createSavingsGoalModel(userId, {
      title,
      target_amount,
      current_amount,
      target_date,
      category,
    }, token);
    return res.status(201).json(newGoal);
  } catch (err) {
    console.error('Error in createSavingsGoal:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function updateSavingsGoal(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const { id } = req.params;
    const updated = await updateSavingsGoalModel(userId, id, req.body, token);
    if (!updated) {
      return res.status(404).json({ error: 'Savings goal not found or access denied' });
    }
    return res.json(updated);
  } catch (err) {
    console.error('Error in updateSavingsGoal:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function addSavingsProgress(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const { id } = req.params;
    const addedAmount = req.body.addedAmount !== undefined ? req.body.addedAmount : req.body.amount;

    if (addedAmount === undefined || addedAmount === null || isNaN(Number(addedAmount))) {
      return res.status(400).json({ error: 'Valid addedAmount numeric value is required.' });
    }

    const updated = await updateProgress(userId, id, Number(addedAmount), token);
    if (!updated) {
      return res.status(404).json({ error: 'Savings goal not found or access denied' });
    }
    return res.json(updated);
  } catch (err) {
    console.error('Error in addSavingsProgress:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function deleteSavingsGoal(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const { id } = req.params;
    const deleted = await deleteSavingsGoalModel(userId, id, token);
    if (!deleted) {
      return res.status(404).json({ error: 'Savings goal not found or access denied' });
    }
    return res.json({ message: 'Savings goal deleted successfully', goal: deleted });
  } catch (err) {
    console.error('Error in deleteSavingsGoal:', err);
    return res.status(500).json({ error: err.message });
  }
}

const { computeHealthScore } = require('../services/healthScoreEngine');

async function getHealthScore(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const result = await computeHealthScore(token);
    return res.json(result);
  } catch (err) {
    console.error('Error in getHealthScore:', err);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  listBudgetsWithSpend,
  getBudgetSummary,
  listBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  listSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  addSavingsProgress,
  deleteSavingsGoal,
  getHealthScore,
};
