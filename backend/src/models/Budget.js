const { getSupabaseClient } = require('../config/db');
const HealthScoreEngine = require('../services/healthScoreEngine');

const db = (token) => getSupabaseClient(token);

function formatBudget(row, transactions = []) {
  const spent = transactions
    .filter((tx) => tx.type === 'expense' && tx.category?.toLowerCase() === row.category.toLowerCase())
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0);
  const amountLimit = Number(row.amount_limit || 0);
  const percentageUsed = amountLimit ? Number(((spent / amountLimit) * 100).toFixed(1)) : 0;
  const status = percentageUsed > 100 ? 'EXCEEDED' : percentageUsed >= 90 ? 'CRITICAL' : percentageUsed >= 70 ? 'WARNING' : 'NORMAL';
  return { id: row.id, userId: row.user_id, category: row.category, amountLimit, spent: Number(spent.toFixed(2)), remaining: Math.max(0, Number((amountLimit - spent).toFixed(2))), percentageUsed, status, period: row.period, createdAt: row.created_at, updatedAt: row.updated_at };
}

function formatGoal(row) {
  const targetAmount = Number(row.target_amount || 0);
  const currentAmount = Number(row.current_amount || 0);
  const remainingAmount = Math.max(0, Number((targetAmount - currentAmount).toFixed(2)));
  const progressPercentage = targetAmount ? Math.min(100, Number(((currentAmount / targetAmount) * 100).toFixed(1))) : 0;
  const target = row.target_date ? new Date(row.target_date) : null;
  const today = new Date();
  const monthsLeft = target ? Math.max(1, (target.getFullYear() - today.getFullYear()) * 12 + target.getMonth() - today.getMonth()) : 0;
  return { id: row.id, userId: row.user_id, title: row.title, targetAmount, currentAmount, remainingAmount, progressPercentage, requiredMonthlyContribution: monthsLeft ? Number((remainingAmount / monthsLeft).toFixed(2)) : 0, targetDate: row.target_date, category: row.category, createdAt: row.created_at, updatedAt: row.updated_at };
}

class BudgetModel {
  static async getAllBudgets(userId, token) {
    const [{ data: rows, error }, { data: transactions, error: txError }] = await Promise.all([
      db(token).from('budgets').select('*').eq('user_id', userId).order('category'),
      db(token).from('transactions').select('amount,type,category,date').eq('user_id', userId),
    ]);
    if (error) throw error;
    if (txError) throw txError;
    return (rows || []).map((row) => formatBudget(row, transactions || []));
  }

  static async getBudgetById(id, userId, token) {
    const { data, error } = await db(token).from('budgets').select('*').eq('id', id).eq('user_id', userId).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    const { data: transactions, error: txError } = await db(token).from('transactions').select('amount,type,category,date').eq('user_id', userId);
    if (txError) throw txError;
    return formatBudget(data, transactions || []);
  }

  static async createBudget(data, userId, token) {
    const { data: row, error } = await db(token).from('budgets').insert({ user_id: userId, category: data.category.trim(), amount_limit: Number(data.amountLimit), period: data.period || 'monthly' }).select().single();
    if (error) throw error;
    return this.getBudgetById(row.id, userId, token);
  }

  static async updateBudget(id, data, userId, token) {
    const payload = {};
    if (data.category !== undefined) payload.category = data.category.trim();
    if (data.amountLimit !== undefined) payload.amount_limit = Number(data.amountLimit);
    if (data.period !== undefined) payload.period = data.period;
    const { data: row, error } = await db(token).from('budgets').update(payload).eq('id', id).eq('user_id', userId).select().maybeSingle();
    if (error) throw error;
    return row ? this.getBudgetById(row.id, userId, token) : null;
  }

  static async deleteBudget(id, userId, token) {
    const { data, error } = await db(token).from('budgets').delete().eq('id', id).eq('user_id', userId).select().maybeSingle();
    if (error) throw error;
    return Boolean(data);
  }

  static async getAllGoals(userId, token) {
    const { data, error } = await db(token).from('savings_goals').select('*').eq('user_id', userId).order('target_date');
    if (error) throw error;
    return (data || []).map(formatGoal);
  }

  static async getGoalById(id, userId, token) {
    const { data, error } = await db(token).from('savings_goals').select('*').eq('id', id).eq('user_id', userId).maybeSingle();
    if (error) throw error;
    return data ? formatGoal(data) : null;
  }

  static async createGoal(data, userId, token) {
    const { data: row, error } = await db(token).from('savings_goals').insert({ user_id: userId, title: data.title.trim(), target_amount: Number(data.targetAmount), current_amount: Number(data.currentAmount || 0), target_date: data.targetDate || null, category: data.category || 'General' }).select().single();
    if (error) throw error;
    return formatGoal(row);
  }

  static async updateGoal(id, data, userId, token) {
    const payload = {};
    if (data.title !== undefined) payload.title = data.title;
    if (data.targetAmount !== undefined) payload.target_amount = Number(data.targetAmount);
    if (data.currentAmount !== undefined) payload.current_amount = Number(data.currentAmount);
    if (data.targetDate !== undefined) payload.target_date = data.targetDate;
    if (data.category !== undefined) payload.category = data.category;
    const { data: row, error } = await db(token).from('savings_goals').update(payload).eq('id', id).eq('user_id', userId).select().maybeSingle();
    if (error) throw error;
    return row ? formatGoal(row) : null;
  }

  static async deleteGoal(id, userId, token) {
    const { data, error } = await db(token).from('savings_goals').delete().eq('id', id).eq('user_id', userId).select().maybeSingle();
    if (error) throw error;
    return Boolean(data);
  }

  static async getFinancialHealthScore(userId, token) {
    const [budgets, goals, transactionsResult] = await Promise.all([
      this.getAllBudgets(userId, token),
      this.getAllGoals(userId, token),
      db(token).from('transactions').select('*').eq('user_id', userId),
    ]);
    if (transactionsResult.error) throw transactionsResult.error;
    return HealthScoreEngine.calculate(budgets, goals, transactionsResult.data || []);
  }
}

module.exports = BudgetModel;
