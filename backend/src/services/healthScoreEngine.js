/**
 * Financial Health Score Engine
 * Member C Module: FinPilot
 * 
 * Computes deterministic, transparent financial health score based on:
 * - Savings Rate (35%)
 * - Budget Adherence (30%)
 * - Recurring Expense Ratio / Subscription Load (20%)
 * - Spending Consistency (15%)
 */

const { getSupabaseClient } = require('../config/db');
const { getBudgetsWithSpend } = require('./budgetService');

/**
 * Returns YYYY-MM-DD start and end date strings for current and previous month
 */
function getMonthRanges() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Current Month range
  const currentStart = `${year}-${String(month + 1).padStart(2, '0')}-01`;
  const currentLastDay = new Date(year, month + 1, 0).getDate();
  const currentEndDay = `${year}-${String(month + 1).padStart(2, '0')}-${String(currentLastDay).padStart(2, '0')}`;
  const currentEnd = `${currentEndDay}T23:59:59.999Z`;

  // Previous Month range (handles Jan -> Dec year rollover cleanly)
  const prevDate = new Date(year, month - 1, 1);
  const prevYear = prevDate.getFullYear();
  const prevMonth = prevDate.getMonth();
  const prevStart = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-01`;
  const prevLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();
  const prevEndDay = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(prevLastDay).padStart(2, '0')}`;
  const prevEnd = `${prevEndDay}T23:59:59.999Z`;

  return { currentStart, currentEnd, currentEndDay, prevStart, prevEnd, prevEndDay };
}

/**
 * Computes health score for an authenticated user session token
 * @param {string} accessToken 
 * @returns {Promise<Object>} { score, grade, breakdown, insufficientData }
 */
async function computeHealthScore(accessToken) {
  if (!accessToken) {
    return {
      score: 0,
      grade: 'D',
      breakdown: { savingsRate: null, budgetAdherence: null, recurringRatio: null, consistency: null },
      insufficientData: true,
    };
  }

  const supabase = getSupabaseClient(accessToken);
  const { currentStart, currentEnd, prevStart, prevEnd } = getMonthRanges();

  // 1. Current Month Transactions (Income & Expenses)
  const { data: currentTxData, error: currentTxErr } = await supabase
    .from('transactions')
    .select('amount, type, date')
    .gte('date', currentStart)
    .lte('date', currentEnd);

  if (currentTxErr) {
    console.warn('HealthScore Engine - Error fetching currentTxData:', currentTxErr.message);
  }

  const currentTx = currentTxData || [];
  console.log('HealthScore Engine - Date range current month:', { currentStart, currentEnd }, 'Returned tx count:', currentTx.length);

  let currentIncome = 0;
  let currentExpense = 0;

  currentTx.forEach((tx) => {
    const amt = Number(tx.amount || 0);
    if (tx.type === 'income') {
      currentIncome += amt;
    } else if (tx.type === 'expense') {
      currentExpense += amt;
    }
  });

  // Calculate Savings Rate (0.35 weight)
  // Distinction: null (no data at all) vs 0 (income is 0 or spent all income)
  let savingsRate = null;
  if (currentTx.length > 0) {
    if (currentIncome > 0) {
      const rawRate = (currentIncome - currentExpense) / currentIncome;
      savingsRate = Math.min(1, Math.max(0, rawRate));
    } else {
      // Income is 0, but transactions exist in current month -> real computed 0%, not "No data"
      savingsRate = 0;
    }
  }

  // 2. Budget Adherence (0.30 weight)
  let budgetAdherence = null;
  let budgets = [];
  try {
    budgets = await getBudgetsWithSpend(accessToken, 'monthly');
  } catch (err) {
    console.warn('HealthScore Engine - Error fetching budgets with spend:', err.message);
    budgets = [];
  }

  if (budgets && budgets.length > 0) {
    const adheringCount = budgets.filter((b) => b.status !== 'exceeded').length;
    budgetAdherence = adheringCount / budgets.length;
  }

  // 3. Recurring Expense Ratio / Subscription Load (0.20 weight)
  let recurringRatio = null;
  const { data: subData, error: subErr } = await supabase
    .from('subscriptions')
    .select('monthly_cost, likely_subscription');

  if (subErr) {
    console.warn('HealthScore Engine - Error fetching subData:', subErr.message);
  }

  const subs = subData || [];
  const activeSubs = subs.filter((s) => s.likely_subscription !== false);
  const totalSubCost = activeSubs.reduce((sum, s) => sum + Number(s.monthly_cost || 0), 0);

  console.log('HealthScore Engine - Subscriptions raw array:', subs, 'Active subs count:', activeSubs.length, 'Total sub cost sum:', totalSubCost, 'Current month expense:', currentExpense);

  if (currentExpense > 0) {
    recurringRatio = Math.min(1, Math.max(0, totalSubCost / currentExpense));
  } else if (activeSubs.length > 0 && totalSubCost > 0) {
    // If user has active recurring subscriptions but currentExpense is 0 so far
    recurringRatio = 1.0;
  } else if (activeSubs.length === 0 && currentTx.length > 0) {
    // Has transactions but 0 subscriptions -> real computed 0% subscription load
    recurringRatio = 0;
  } else if (activeSubs.length === 0 && currentTx.length === 0) {
    // No transactions and no subscriptions -> null (no data)
    recurringRatio = null;
  }

  // 4. Spending Consistency (0.15 weight)
  let consistency = null;
  const { data: prevTxData, error: prevTxErr } = await supabase
    .from('transactions')
    .select('amount, type, date')
    .gte('date', prevStart)
    .lte('date', prevEnd);

  if (prevTxErr) {
    console.warn('HealthScore Engine - Error fetching prevTxData:', prevTxErr.message);
  }

  const prevTx = prevTxData || [];
  console.log('HealthScore Engine - Date range previous month:', { prevStart, prevEnd }, 'Returned prev tx count:', prevTx.length);

  if (prevTx.length > 0) {
    let prevExpense = 0;
    prevTx.forEach((tx) => {
      if (tx.type === 'expense') {
        prevExpense += Number(tx.amount || 0);
      }
    });

    const maxExp = Math.max(currentExpense, prevExpense, 1);
    const rawDiff = Math.abs(currentExpense - prevExpense) / maxExp;
    consistency = Math.min(1, Math.max(0, 1 - rawDiff));
  }

  // Calculate Weighted Composite Score & re-normalize weights for non-null components
  let weightedSum = 0;
  let activeWeights = 0;
  let nonNullCount = 0;

  if (savingsRate !== null) {
    weightedSum += savingsRate * 0.35;
    activeWeights += 0.35;
    nonNullCount++;
  }
  if (budgetAdherence !== null) {
    weightedSum += budgetAdherence * 0.30;
    activeWeights += 0.30;
    nonNullCount++;
  }
  if (recurringRatio !== null) {
    weightedSum += (1 - recurringRatio) * 0.20;
    activeWeights += 0.20;
    nonNullCount++;
  }
  if (consistency !== null) {
    weightedSum += consistency * 0.15;
    activeWeights += 0.15;
    nonNullCount++;
  }

  const insufficientData = nonNullCount < 2;
  const weightedAverage = activeWeights > 0 ? weightedSum / activeWeights : 0;
  const finalScore = Math.min(100, Math.max(0, Math.round(weightedAverage * 100)));

  let grade = 'D';
  if (finalScore >= 85) {
    grade = 'A';
  } else if (finalScore >= 70) {
    grade = 'B';
  } else if (finalScore >= 55) {
    grade = 'C';
  } else {
    grade = 'D';
  }

  const breakdownObj = {
    savingsRate: savingsRate !== null ? Number(savingsRate.toFixed(4)) : null,
    budgetAdherence: budgetAdherence !== null ? Number(budgetAdherence.toFixed(4)) : null,
    recurringRatio: recurringRatio !== null ? Number(recurringRatio.toFixed(4)) : null,
    consistency: consistency !== null ? Number(consistency.toFixed(4)) : null,
  };

  console.log('HealthScore Engine - Final Breakdown Object:', {
    score: finalScore,
    grade,
    breakdown: breakdownObj,
    insufficientData,
    nonNullCount,
  });

  return {
    score: finalScore,
    grade,
    breakdown: breakdownObj,
    insufficientData,
  };
}

class HealthScoreEngine {
  static async calculate(accessToken) {
    return computeHealthScore(accessToken);
  }
}

module.exports = {
  computeHealthScore,
  HealthScoreEngine,
};
