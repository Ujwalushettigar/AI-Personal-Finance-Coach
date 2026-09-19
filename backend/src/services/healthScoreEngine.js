/**
 * Financial Health Score Engine
 * Member C Module: FinPilot
 * 
 * 100% Deterministic, Explainable, and Reproducible Financial Health Scoring Engine.
 * Does NOT use an LLM for numerical scoring.
 * 
 * Transparent Weighted Scoring Architecture (0 - 100 scale):
 * - Savings Rate: 30% (Max 30 points)
 * - Budget Adherence: 30% (Max 30 points)
 * - Spending Consistency: 20% (Max 20 points)
 * - Goal Progress: 20% (Max 20 points)
 */

class HealthScoreEngine {
  /**
   * Deterministically calculates the financial health score
   * Supports both object syntax { budgets, goals, transactions, income }
   * and positional arguments (budgets, goals, transactions, income).
   * 
   * @param {Array|Object} budgetsOrData - List of budgets or data bundle
   * @param {Array} [goalsArg] - List of savings goals
   * @param {Array} [transactionsArg] - List of transactions
   * @param {number} [incomeArg] - Total monthly income
   * @returns {Object} { score, grade, breakdown, strengths, warnings, recommendations }
   */
  static calculate(budgetsOrData = [], goalsArg = [], transactionsArg = [], incomeArg = null) {
    let budgets = [];
    let goals = [];
    let transactions = [];
    let income = null;

    if (budgetsOrData && !Array.isArray(budgetsOrData) && typeof budgetsOrData === 'object') {
      budgets = Array.isArray(budgetsOrData.budgets) ? budgetsOrData.budgets : [];
      goals = Array.isArray(budgetsOrData.goals) ? budgetsOrData.goals : [];
      transactions = Array.isArray(budgetsOrData.transactions) ? budgetsOrData.transactions : [];
      income = budgetsOrData.income !== undefined ? Number(budgetsOrData.income) : null;
    } else {
      budgets = Array.isArray(budgetsOrData) ? budgetsOrData : [];
      goals = Array.isArray(goalsArg) ? goalsArg : [];
      transactions = Array.isArray(transactionsArg) ? transactionsArg : [];
      income = incomeArg !== null ? Number(incomeArg) : null;
    }

    const strengths = [];
    const warnings = [];
    const recommendations = [];

    // Aggregate core metrics
    const totalBudgetLimit = budgets.reduce((sum, b) => sum + Number(b.amountLimit || 0), 0);
    const totalSpent = budgets.reduce((sum, b) => sum + Number(b.spent || 0), 0);

    // Derive or detect income
    if (income === null || isNaN(income) || income <= 0) {
      // Check transactions for explicit income
      const incomeFromTx = transactions
        .filter(t => (t.type || '').toLowerCase() === 'income')
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);

      if (incomeFromTx > 0) {
        income = incomeFromTx;
      } else if (totalBudgetLimit > 0) {
        // Assume standard 80/20 baseline budgeting if income not explicitly provided
        income = Number((totalBudgetLimit / 0.8).toFixed(2));
      } else {
        income = totalSpent > 0 ? Number((totalSpent * 1.25).toFixed(2)) : 3000;
      }
    }

    // -------------------------------------------------------------
    // 1. Savings Rate Score (Max 30 Points)
    // -------------------------------------------------------------
    const netSavings = Math.max(0, income - totalSpent);
    const savingsRate = income > 0 ? Number(((netSavings / income) * 100).toFixed(1)) : 0;

    let savingsPoints = 0;
    if (savingsRate >= 25) {
      savingsPoints = 30;
      strengths.push(`Exceptional savings rate of ${savingsRate}%, well above the 20% benchmark.`);
    } else if (savingsRate >= 20) {
      savingsPoints = 26;
      strengths.push(`Healthy savings rate of ${savingsRate}%, meeting the 50/30/20 standard.`);
    } else if (savingsRate >= 15) {
      savingsPoints = 21;
      recommendations.push(`Savings rate is ${savingsRate}%. Aim for 20% by trimming non-essential subscriptions.`);
    } else if (savingsRate >= 10) {
      savingsPoints = 15;
      warnings.push(`Moderate savings rate of ${savingsRate}%; leaves a tight buffer for unexpected expenses.`);
      recommendations.push('Try the 50/30/20 budgeting rule to increase your monthly savings rate to 20%.');
    } else if (savingsRate >= 5) {
      savingsPoints = 9;
      warnings.push(`Low savings rate of ${savingsRate}%. Most income is consumed by expenses.`);
      recommendations.push('Audit recurring expenses to boost your monthly savings buffer.');
    } else {
      savingsPoints = 2;
      warnings.push(`Critically low or zero savings rate (${savingsRate}%). Spending matches or exceeds income.`);
      recommendations.push('Create a strict emergency savings allocation before discretionary spending.');
    }

    // -------------------------------------------------------------
    // 2. Budget Adherence Score (Max 30 Points)
    // -------------------------------------------------------------
    let budgetPoints = 30;
    let normalCount = 0;
    let warningCount = 0;
    let criticalCount = 0;
    let exceededCount = 0;
    const exceededCategories = [];

    if (budgets.length > 0) {
      budgets.forEach(b => {
        const spent = Number(b.spent || 0);
        const limit = Number(b.amountLimit || 1);
        const usage = (spent / limit) * 100;

        if (usage > 100) {
          exceededCount++;
          exceededCategories.push(b.category);
        } else if (usage >= 90) {
          criticalCount++;
        } else if (usage >= 70) {
          warningCount++;
        } else {
          normalCount++;
        }
      });

      // Weighted deductions: Warning (-2.5), Critical (-6), Exceeded (-10)
      const penalty = (warningCount * 2.5) + (criticalCount * 6) + (exceededCount * 10);
      budgetPoints = Math.max(0, Math.round(30 - penalty));

      // Check overall usage ratio
      const overallUsage = totalBudgetLimit > 0 ? (totalSpent / totalBudgetLimit) * 100 : 0;
      if (overallUsage > 100) {
        budgetPoints = Math.max(0, budgetPoints - 4);
      }

      if (exceededCount === 0 && criticalCount === 0) {
        strengths.push(`High budget discipline: all ${budgets.length} category budgets are within limits.`);
      } else {
        if (exceededCount > 0) {
          warnings.push(`${exceededCount} category budget(s) exceeded: ${exceededCategories.join(', ')}.`);
          recommendations.push(`Pause discretionary spend in: ${exceededCategories.join(', ')} until next cycle.`);
        }
        if (criticalCount > 0) {
          warnings.push(`${criticalCount} category budget(s) are in the CRITICAL zone (>90% usage).`);
        }
      }
    } else {
      budgetPoints = 15;
      recommendations.push('Set up category budgets to take full advantage of budget adherence scoring.');
    }

    // -------------------------------------------------------------
    // 3. Spending Consistency Score (Max 20 Points)
    // -------------------------------------------------------------
    let spendingPoints = 20;

    if (budgets.length > 0) {
      // Calculate category utilization dispersion (Standard Deviation of usage %)
      const utilizations = budgets.map(b => {
        const limit = Number(b.amountLimit || 1);
        return (Number(b.spent || 0) / limit) * 100;
      });

      const avgUtil = utilizations.reduce((a, b) => a + b, 0) / utilizations.length;
      const variance = utilizations.reduce((sum, u) => sum + Math.pow(u - avgUtil, 2), 0) / utilizations.length;
      const stdDev = Math.sqrt(variance);

      // Assess consistency based on utilization standard deviation and spike outliers
      if (stdDev <= 15 && exceededCount === 0) {
        spendingPoints = 20;
        strengths.push('Steady, predictable spending distribution across all active categories.');
      } else if (stdDev <= 25 && exceededCount === 0) {
        spendingPoints = 17;
      } else if (stdDev <= 40) {
        spendingPoints = 13;
        warnings.push('Moderate spending volatility detected across category limits.');
      } else {
        spendingPoints = Math.max(4, Math.round(20 - (stdDev / 3)));
        warnings.push('High spending volatility: some categories are heavily depleted while others are untouched.');
        recommendations.push('Rebalance monthly category allocations to reflect your true spending patterns.');
      }
    } else {
      spendingPoints = 10;
    }

    // -------------------------------------------------------------
    // 4. Goal Progress Score (Max 20 Points)
    // -------------------------------------------------------------
    let goalPoints = 0;
    let avgGoalProgress = 0;

    if (goals.length > 0) {
      const totalProgress = goals.reduce((sum, g) => {
        const target = Number(g.targetAmount || 1);
        const current = Number(g.currentAmount || 0);
        const progress = Math.min(100, (current / target) * 100);
        return sum + progress;
      }, 0);

      avgGoalProgress = Number((totalProgress / goals.length).toFixed(1));
      goalPoints = Math.min(20, Math.max(0, Math.round((avgGoalProgress / 100) * 20)));

      if (avgGoalProgress >= 75) {
        strengths.push(`Strong progress on savings goals (average: ${avgGoalProgress}% achieved).`);
      } else if (avgGoalProgress >= 40) {
        recommendations.push(`Goals are ${avgGoalProgress}% funded on average. Keep up recurring contributions.`);
      } else {
        warnings.push(`Savings goals are in early stages (average: ${avgGoalProgress}% complete).`);
        recommendations.push('Set up automated deposits toward your highest priority savings goal.');
      }
    } else {
      goalPoints = 6;
      recommendations.push('Create at least one savings goal (e.g. Emergency Fund) to earn full goal progress points.');
    }

    // -------------------------------------------------------------
    // Final Composite Score & Grade (0 - 100)
    // -------------------------------------------------------------
    const finalScore = Math.min(100, Math.max(0, Math.round(
      savingsPoints + budgetPoints + spendingPoints + goalPoints
    )));

    let grade = 'Fair';
    if (finalScore >= 85) {
      grade = 'Excellent';
    } else if (finalScore >= 70) {
      grade = 'Good';
    } else if (finalScore >= 50) {
      grade = 'Fair';
    } else {
      grade = 'Needs Attention';
    }

    return {
      score: finalScore,
      grade,
      breakdown: {
        savings: savingsPoints,
        budget: budgetPoints,
        spending: spendingPoints,
        goals: goalPoints
      },
      strengths,
      warnings,
      recommendations
    };
  }
}

module.exports = HealthScoreEngine;
