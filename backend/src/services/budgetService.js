const BudgetModel = require('../models/Budget');

class BudgetService {
  static async getBudgets(userId, token) {
    const budgets = await BudgetModel.getAllBudgets(userId, token);
    const totalLimit = Number(budgets.reduce((sum, item) => sum + item.amountLimit, 0).toFixed(2));
    const totalSpent = Number(budgets.reduce((sum, item) => sum + item.spent, 0).toFixed(2));
    const overallPercentageUsed = totalLimit ? Number(((totalSpent / totalLimit) * 100).toFixed(1)) : 0;
    return { summary: { totalLimit, totalSpent, totalRemaining: Math.max(0, Number((totalLimit - totalSpent).toFixed(2))), overallPercentageUsed, overallStatus: overallPercentageUsed > 100 ? 'EXCEEDED' : overallPercentageUsed >= 90 ? 'CRITICAL' : overallPercentageUsed >= 70 ? 'WARNING' : 'NORMAL', categoryCount: budgets.length }, budgets };
  }

  static async getBudgetById(id, userId, token) {
    const budget = await BudgetModel.getBudgetById(id, userId, token);
    if (!budget) throw Object.assign(new Error(`Budget with ID '${id}' not found`), { statusCode: 404 });
    return budget;
  }

  static async createBudget(data, userId, token) {
    if (!data.category?.trim()) throw Object.assign(new Error('Category name is required and must be a non-empty string'), { statusCode: 400 });
    if (!Number.isFinite(Number(data.amountLimit)) || Number(data.amountLimit) <= 0) throw Object.assign(new Error('amountLimit must be a positive number greater than 0'), { statusCode: 400 });
    return BudgetModel.createBudget(data, userId, token);
  }

  static async updateBudget(id, data, userId, token) {
    if (data.amountLimit !== undefined && (!Number.isFinite(Number(data.amountLimit)) || Number(data.amountLimit) <= 0)) throw Object.assign(new Error('amountLimit must be a positive number greater than 0'), { statusCode: 400 });
    if (data.category !== undefined && !data.category?.trim()) throw Object.assign(new Error('Category name cannot be empty'), { statusCode: 400 });
    const budget = await BudgetModel.updateBudget(id, data, userId, token);
    if (!budget) throw Object.assign(new Error(`Budget with ID '${id}' not found`), { statusCode: 404 });
    return budget;
  }

  static async deleteBudget(id, userId, token) {
    if (!await BudgetModel.deleteBudget(id, userId, token)) throw Object.assign(new Error(`Budget with ID '${id}' not found`), { statusCode: 404 });
    return { success: true, id };
  }

  static async getGoals(userId, token) {
    const goals = await BudgetModel.getAllGoals(userId, token);
    const totalTarget = Number(goals.reduce((sum, item) => sum + item.targetAmount, 0).toFixed(2));
    const totalSaved = Number(goals.reduce((sum, item) => sum + item.currentAmount, 0).toFixed(2));
    return { summary: { totalTarget, totalSaved, totalRemaining: Math.max(0, Number((totalTarget - totalSaved).toFixed(2))), overallProgress: totalTarget ? Number(((totalSaved / totalTarget) * 100).toFixed(1)) : 0, goalsCount: goals.length }, goals };
  }

  static async getGoalById(id, userId, token) {
    const goal = await BudgetModel.getGoalById(id, userId, token);
    if (!goal) throw Object.assign(new Error(`Savings Goal with ID '${id}' not found`), { statusCode: 404 });
    return goal;
  }

  static async createGoal(data, userId, token) {
    if (!data.title?.trim()) throw Object.assign(new Error('Goal title is required and cannot be empty'), { statusCode: 400 });
    if (!Number.isFinite(Number(data.targetAmount)) || Number(data.targetAmount) <= 0) throw Object.assign(new Error('targetAmount must be a positive number greater than 0'), { statusCode: 400 });
    return BudgetModel.createGoal(data, userId, token);
  }

  static async updateGoal(id, data, userId, token) {
    const goal = await BudgetModel.updateGoal(id, data, userId, token);
    if (!goal) throw Object.assign(new Error(`Savings Goal with ID '${id}' not found`), { statusCode: 404 });
    return goal;
  }

  static async deleteGoal(id, userId, token) {
    if (!await BudgetModel.deleteGoal(id, userId, token)) throw Object.assign(new Error(`Savings Goal with ID '${id}' not found`), { statusCode: 404 });
    return { success: true, id };
  }

  static async getFinancialHealthScore(userId, token) {
    return BudgetModel.getFinancialHealthScore(userId, token);
  }
}

module.exports = BudgetService;
