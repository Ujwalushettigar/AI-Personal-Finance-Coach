/**
 * Budget & Savings Goal Service
 * Member C Module: FinPilot
 */

const BudgetModel = require('../models/Budget');
const HealthScoreEngine = require('./healthScoreEngine');

class BudgetService {
  // --- Category Budget Operations ---

  /**
   * Get all budgets for the authenticated user with aggregated summary
   */
  static getBudgets(userId = 'user-1') {
    const budgets = BudgetModel.getAllBudgets(userId);
    const totalLimit = Number(budgets.reduce((sum, b) => sum + (b.amountLimit || 0), 0).toFixed(2));
    const totalSpent = Number(budgets.reduce((sum, b) => sum + (b.spent || 0), 0).toFixed(2));
    const totalRemaining = Math.max(0, Number((totalLimit - totalSpent).toFixed(2)));
    const overallPercentageUsed = totalLimit > 0 
      ? Number(((totalSpent / totalLimit) * 100).toFixed(1)) 
      : 0;

    let overallStatus = 'NORMAL';
    if (overallPercentageUsed > 100) overallStatus = 'EXCEEDED';
    else if (overallPercentageUsed >= 90) overallStatus = 'CRITICAL';
    else if (overallPercentageUsed >= 70) overallStatus = 'WARNING';

    return {
      summary: {
        totalLimit,
        totalSpent,
        totalRemaining,
        overallPercentageUsed,
        overallStatus,
        categoryCount: budgets.length
      },
      budgets
    };
  }

  /**
   * Get a specific budget by ID for the authenticated user
   */
  static getBudgetById(id, userId = 'user-1') {
    const budget = BudgetModel.getBudgetById(id, userId);
    if (!budget) {
      const error = new Error(`Budget with ID '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }
    return budget;
  }

  /**
   * Create a new category budget
   */
  static createBudget(data, userId = 'user-1') {
    if (!data.category || typeof data.category !== 'string' || !data.category.trim()) {
      const error = new Error('Category name is required and must be a non-empty string');
      error.statusCode = 400;
      throw error;
    }

    const limit = Number(data.amountLimit);
    if (isNaN(limit) || limit <= 0) {
      const error = new Error('amountLimit must be a positive number greater than 0');
      error.statusCode = 400;
      throw error;
    }

    return BudgetModel.createBudget(data, userId);
  }

  /**
   * Update an existing budget by ID
   */
  static updateBudget(id, data, userId = 'user-1') {
    if (data.amountLimit !== undefined) {
      const limit = Number(data.amountLimit);
      if (isNaN(limit) || limit <= 0) {
        const error = new Error('amountLimit must be a positive number greater than 0');
        error.statusCode = 400;
        throw error;
      }
    }

    if (data.category !== undefined && (!data.category || !data.category.trim())) {
      const error = new Error('Category name cannot be empty');
      error.statusCode = 400;
      throw error;
    }

    const updated = BudgetModel.updateBudget(id, data, userId);
    if (!updated) {
      const error = new Error(`Budget with ID '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }
    return updated;
  }

  /**
   * Delete a budget by ID
   */
  static deleteBudget(id, userId = 'user-1') {
    const deleted = BudgetModel.deleteBudget(id, userId);
    if (!deleted) {
      const error = new Error(`Budget with ID '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }
    return { success: true, id };
  }

  // --- Savings Goal Operations ---

  static getGoals(userId = 'user-1') {
    const goals = BudgetModel.getAllGoals(userId);
    const totalTarget = Number(goals.reduce((sum, g) => sum + (g.targetAmount || 0), 0).toFixed(2));
    const totalSaved = Number(goals.reduce((sum, g) => sum + (g.currentAmount || 0), 0).toFixed(2));
    const totalRemaining = Math.max(0, Number((totalTarget - totalSaved).toFixed(2)));
    const overallProgress = totalTarget > 0 
      ? Number(((totalSaved / totalTarget) * 100).toFixed(1)) 
      : 0;

    return {
      summary: {
        totalTarget,
        totalSaved,
        totalRemaining,
        overallProgress,
        goalsCount: goals.length
      },
      goals
    };
  }

  static getGoalById(id, userId = 'user-1') {
    const goal = BudgetModel.getGoalById(id, userId);
    if (!goal) {
      const error = new Error(`Savings Goal with ID '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }
    return goal;
  }

  static createGoal(data, userId = 'user-1') {
    if (!data.title || typeof data.title !== 'string' || !data.title.trim()) {
      const error = new Error('Goal title is required and cannot be empty');
      error.statusCode = 400;
      throw error;
    }
    const target = Number(data.targetAmount);
    if (isNaN(target) || target <= 0) {
      const error = new Error('targetAmount must be a positive number greater than 0');
      error.statusCode = 400;
      throw error;
    }
    return BudgetModel.createGoal(data, userId);
  }

  static updateGoal(id, data, userId = 'user-1') {
    const updated = BudgetModel.updateGoal(id, data, userId);
    if (!updated) {
      const error = new Error(`Savings Goal with ID '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }
    return updated;
  }

  static deleteGoal(id, userId = 'user-1') {
    const deleted = BudgetModel.deleteGoal(id, userId);
    if (!deleted) {
      const error = new Error(`Savings Goal with ID '${id}' not found`);
      error.statusCode = 404;
      throw error;
    }
    return { success: true, id };
  }

  // --- Financial Health Score ---
  static getFinancialHealthScore(userId = 'user-1') {
    const budgets = BudgetModel.getAllBudgets(userId);
    const goals = BudgetModel.getAllGoals(userId);
    return HealthScoreEngine.calculate(budgets, goals);
  }
}

module.exports = BudgetService;
