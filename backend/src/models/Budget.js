/**
 * Budget & Savings Goal Data Model
 * Member C Module: FinPilot
 */

// In-memory transaction records to calculate dynamic spending when Member B's Transaction model is pending
let mockTransactions = [
  { id: 't-1', userId: 'user-1', category: 'Housing & Rent', amount: 1200, type: 'expense', date: '2026-09-02T10:00:00.000Z' },
  { id: 't-2', userId: 'user-1', category: 'Groceries & Food', amount: 250, type: 'expense', date: '2026-09-05T12:30:00.000Z' },
  { id: 't-3', userId: 'user-1', category: 'Groceries & Food', amount: 200, type: 'expense', date: '2026-09-12T15:10:00.000Z' },
  { id: 't-4', userId: 'user-1', category: 'Entertainment & Dining', amount: 185, type: 'expense', date: '2026-09-08T20:00:00.000Z' },
  { id: 't-5', userId: 'user-1', category: 'Entertainment & Dining', amount: 100, type: 'expense', date: '2026-09-15T21:45:00.000Z' },
  { id: 't-6', userId: 'user-1', category: 'Transportation', amount: 150, type: 'expense', date: '2026-09-03T08:30:00.000Z' },
  { id: 't-7', userId: 'user-1', category: 'Transportation', amount: 80, type: 'expense', date: '2026-09-14T09:00:00.000Z' },
  { id: 't-8', userId: 'user-1', category: 'Shopping & Apparel', amount: 110, type: 'expense', date: '2026-09-10T14:20:00.000Z' },
  { id: 't-9', userId: 'user-1', category: 'Salary & Income', amount: 4500, type: 'income', date: '2026-09-01T09:00:00.000Z' }
];

// Initial category budgets store
let budgetsStore = [
  {
    id: 'b-1',
    userId: 'user-1',
    category: 'Housing & Rent',
    amountLimit: 1500,
    period: 'monthly',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'b-2',
    userId: 'user-1',
    category: 'Groceries & Food',
    amountLimit: 600,
    period: 'monthly',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'b-3',
    userId: 'user-1',
    category: 'Entertainment & Dining',
    amountLimit: 300,
    period: 'monthly',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'b-4',
    userId: 'user-1',
    category: 'Transportation',
    amountLimit: 200,
    period: 'monthly',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'b-5',
    userId: 'user-1',
    category: 'Shopping & Apparel',
    amountLimit: 250,
    period: 'monthly',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

let savingsGoalsStore = [
  {
    id: 'g-1',
    userId: 'user-1',
    title: 'Emergency Fund',
    targetAmount: 5000,
    currentAmount: 3200,
    targetDate: '2026-12-31',
    category: 'Emergency',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'g-2',
    userId: 'user-1',
    title: 'Vacation Trip to Japan',
    targetAmount: 3000,
    currentAmount: 1800,
    targetDate: '2027-06-30',
    category: 'Travel',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'g-3',
    userId: 'user-1',
    title: 'New Laptop Purchase',
    targetAmount: 1500,
    currentAmount: 1200,
    targetDate: '2026-11-30',
    category: 'Tech',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

class BudgetModel {
  /**
   * Helper to dynamically calculate total spending for a category from transactions
   * Checks Member B's Transaction model if available, otherwise queries mock transactions.
   */
  static calculateCategorySpending(userId, category, period = 'monthly') {
    let transactions = [];

    // Attempt to read from Member B's Transaction module if defined
    try {
      const TransactionModel = require('./Transaction');
      if (typeof TransactionModel.getAll === 'function') {
        transactions = TransactionModel.getAll(userId);
      } else if (Array.isArray(TransactionModel.transactions)) {
        transactions = TransactionModel.transactions;
      }
    } catch (err) {
      // Member B's Transaction module not yet populated
    }

    if (!transactions || transactions.length === 0) {
      transactions = mockTransactions;
    }

    // Filter by user, category, and expense type
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const spentTotal = transactions
      .filter(t => {
        const isSameUser = (t.userId || t.user_id) === userId;
        const isCategory = (t.category || '').toLowerCase() === (category || '').toLowerCase();
        const isExpense = (t.type || 'expense').toLowerCase() === 'expense';
        
        let isInRange = true;
        if (t.date || t.createdAt) {
          const tDate = new Date(t.date || t.createdAt);
          isInRange = tDate >= startOfMonth && tDate <= endOfMonth;
        }

        return isSameUser && isCategory && isExpense && isInRange;
      })
      .reduce((sum, t) => sum + Number(t.amount || 0), 0);

    return Number(spentTotal.toFixed(2));
  }

  /**
   * Calculate budget usage percentage and status according to strict rules:
   * - NORMAL: usage < 70%
   * - WARNING: 70% <= usage < 90%
   * - CRITICAL: 90% <= usage <= 100%
   * - EXCEEDED: usage > 100%
   */
  static calculateStatus(spent, limit) {
    if (!limit || limit <= 0) {
      return { percentageUsed: 0, status: 'NORMAL' };
    }

    const percentageUsed = Number(((spent / limit) * 100).toFixed(1));
    
    let status = 'NORMAL';
    if (percentageUsed > 100) {
      status = 'EXCEEDED';
    } else if (percentageUsed >= 90) {
      status = 'CRITICAL';
    } else if (percentageUsed >= 70) {
      status = 'WARNING';
    } else {
      status = 'NORMAL';
    }

    return { percentageUsed, status };
  }

  /**
   * Format budget object with computed fields:
   * - spent (current spending calculated against transactions or stored override)
   * - remaining budget: Math.max(0, limit - spent)
   * - percentageUsed
   * - status
   */
  static formatBudget(budget) {
    const limit = Number(budget.amountLimit) || 0;
    
    // If budget has an explicit override for spent, use it; otherwise compute from transactions
    let spent = budget.spent !== undefined 
      ? Number(budget.spent) 
      : this.calculateCategorySpending(budget.userId, budget.category, budget.period);

    const { percentageUsed, status } = this.calculateStatus(spent, limit);
    const remaining = Math.max(0, Number((limit - spent).toFixed(2)));

    return {
      id: budget.id,
      userId: budget.userId,
      category: budget.category,
      amountLimit: limit,
      spent,
      remaining,
      percentageUsed,
      status,
      period: budget.period || 'monthly',
      createdAt: budget.createdAt,
      updatedAt: budget.updatedAt
    };
  }

  /**
   * Calculate savings goal progress, remaining amount, and required monthly contribution
   */
  static formatGoal(goal) {
    const targetAmount = Number(goal.targetAmount) || 0;
    const currentAmount = Number(goal.currentAmount) || 0;
    const remainingAmount = Math.max(0, Number((targetAmount - currentAmount).toFixed(2)));
    const progressPercentage = targetAmount > 0 
      ? Math.min(100, Number(((currentAmount / targetAmount) * 100).toFixed(1)))
      : 0;

    let requiredMonthlyContribution = 0;
    if (goal.targetDate && remainingAmount > 0) {
      const today = new Date();
      const target = new Date(goal.targetDate);
      const diffMonths = (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth());
      const monthsLeft = Math.max(1, diffMonths);
      requiredMonthlyContribution = Number((remainingAmount / monthsLeft).toFixed(2));
    }

    return {
      id: goal.id,
      userId: goal.userId,
      title: goal.title,
      targetAmount,
      currentAmount,
      remainingAmount,
      progressPercentage,
      requiredMonthlyContribution,
      targetDate: goal.targetDate,
      category: goal.category,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt
    };
  }

  // --- Budget Store Methods ---
  static getAllBudgets(userId = 'user-1') {
    return budgetsStore
      .filter(b => b.userId === userId)
      .map(b => this.formatBudget(b));
  }

  static getBudgetById(id, userId = 'user-1') {
    const budget = budgetsStore.find(b => b.id === id && b.userId === userId);
    return budget ? this.formatBudget(budget) : null;
  }

  static createBudget(data, userId = 'user-1') {
    const newBudget = {
      id: `b-${Date.now()}`,
      userId,
      category: data.category.trim(),
      amountLimit: Number(data.amountLimit),
      spent: data.spent !== undefined ? Number(data.spent) : undefined,
      period: data.period || 'monthly',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    budgetsStore.push(newBudget);
    return this.formatBudget(newBudget);
  }

  static updateBudget(id, data, userId = 'user-1') {
    const index = budgetsStore.findIndex(b => b.id === id && b.userId === userId);
    if (index === -1) return null;

    budgetsStore[index] = {
      ...budgetsStore[index],
      category: data.category !== undefined ? data.category.trim() : budgetsStore[index].category,
      amountLimit: data.amountLimit !== undefined ? Number(data.amountLimit) : budgetsStore[index].amountLimit,
      spent: data.spent !== undefined ? Number(data.spent) : budgetsStore[index].spent,
      period: data.period !== undefined ? data.period : budgetsStore[index].period,
      updatedAt: new Date().toISOString()
    };

    return this.formatBudget(budgetsStore[index]);
  }

  static deleteBudget(id, userId = 'user-1') {
    const index = budgetsStore.findIndex(b => b.id === id && b.userId === userId);
    if (index === -1) return false;
    budgetsStore.splice(index, 1);
    return true;
  }

  // --- Savings Goal Store Methods ---
  static getAllGoals(userId = 'user-1') {
    return savingsGoalsStore
      .filter(g => g.userId === userId)
      .map(g => this.formatGoal(g));
  }

  static getGoalById(id, userId = 'user-1') {
    const goal = savingsGoalsStore.find(g => g.id === id && g.userId === userId);
    return goal ? this.formatGoal(goal) : null;
  }

  static createGoal(data, userId = 'user-1') {
    const newGoal = {
      id: `g-${Date.now()}`,
      userId,
      title: data.title || 'New Savings Goal',
      targetAmount: Number(data.targetAmount) || 0,
      currentAmount: Number(data.currentAmount) || 0,
      targetDate: data.targetDate || null,
      category: data.category || 'General',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    savingsGoalsStore.push(newGoal);
    return this.formatGoal(newGoal);
  }

  static updateGoal(id, data, userId = 'user-1') {
    const index = savingsGoalsStore.findIndex(g => g.id === id && g.userId === userId);
    if (index === -1) return null;

    savingsGoalsStore[index] = {
      ...savingsGoalsStore[index],
      title: data.title !== undefined ? data.title : savingsGoalsStore[index].title,
      targetAmount: data.targetAmount !== undefined ? Number(data.targetAmount) : savingsGoalsStore[index].targetAmount,
      currentAmount: data.currentAmount !== undefined ? Number(data.currentAmount) : savingsGoalsStore[index].currentAmount,
      targetDate: data.targetDate !== undefined ? data.targetDate : savingsGoalsStore[index].targetDate,
      category: data.category !== undefined ? data.category : savingsGoalsStore[index].category,
      updatedAt: new Date().toISOString()
    };

    return this.formatGoal(savingsGoalsStore[index]);
  }

  static deleteGoal(id, userId = 'user-1') {
    const index = savingsGoalsStore.findIndex(g => g.id === id && g.userId === userId);
    if (index === -1) return false;
    savingsGoalsStore.splice(index, 1);
    return true;
  }
}

module.exports = BudgetModel;
