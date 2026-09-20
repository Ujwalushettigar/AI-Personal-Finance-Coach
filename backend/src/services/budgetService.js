/**
 * Budget & Savings Goals Service
 * Member C - AI-Personal-Finance-Coach
 * Computes real category spend from transactions and budget summary metrics.
 */

const { getSupabaseClient } = require('../config/db');

/**
 * Get date range for period (monthly, weekly, yearly)
 */
function getDateRangeForPeriod(period = 'monthly') {
  const now = new Date();
  const periodLower = (period || 'monthly').toLowerCase();

  let startDate;
  let endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

  if (periodLower === 'weekly') {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
    const monday = new Date(now.setDate(diff));
    startDate = monday.toISOString().split('T')[0];
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    endDate = sunday.toISOString().split('T')[0];
  } else if (periodLower === 'yearly') {
    startDate = `${now.getFullYear()}-01-01`;
    endDate = `${now.getFullYear()}-12-31`;
  } else {
    // monthly default
    startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  }

  return { startDate, endDate };
}

/**
 * Fetches all budgets for period with real calculated expense spend per category
 */
async function getBudgetsWithSpend(accessToken, period = 'monthly') {
  const supabase = getSupabaseClient(accessToken);
  const targetPeriod = (period || 'monthly').toLowerCase();

  // 1. Fetch budgets for the period
  const { data: budgetsData, error: budgetErr } = await supabase
    .from('budgets')
    .select('*')
    .eq('period', targetPeriod)
    .order('created_at', { ascending: false });

  if (budgetErr) {
    throw new Error(`Failed to fetch budgets: ${budgetErr.message}`);
  }

  const budgets = budgetsData || [];
  if (budgets.length === 0) {
    return [];
  }

  // 2. Fetch expenses for the date range
  const { startDate, endDate } = getDateRangeForPeriod(targetPeriod);
  const { data: txData, error: txErr } = await supabase
    .from('transactions')
    .select('category, amount, type, date')
    .eq('type', 'expense')
    .gte('date', startDate)
    .lte('date', endDate);

  if (txErr) {
    throw new Error(`Failed to fetch expense transactions for spend calculation: ${txErr.message}`);
  }

  const expenses = txData || [];

  // Map category to total spent
  const spendByCategory = {};
  expenses.forEach((tx) => {
    const cat = (tx.category || '').trim();
    const val = Number(tx.amount || 0);
    spendByCategory[cat] = (spendByCategory[cat] || 0) + val;
  });

  // 3. Compute budget spend, remaining, utilization, and status
  return budgets.map((b) => {
    const amountLimit = Number(b.amount_limit || 0);
    const categoryName = (b.category || '').trim();
    const spent = spendByCategory[categoryName] || 0;
    const remaining = amountLimit - spent;
    const utilization = amountLimit > 0 ? spent / amountLimit : 0;

    let status = 'safe';
    if (spent > amountLimit) {
      status = 'exceeded';
    } else if (utilization >= 0.9) {
      status = 'critical';
    } else if (utilization >= 0.7) {
      status = 'warning';
    }

    return {
      id: b.id,
      category: b.category,
      amount_limit: amountLimit,
      period: b.period,
      spent: Number(spent.toFixed(2)),
      remaining: Number(remaining.toFixed(2)),
      utilization: Number(utilization.toFixed(4)),
      status,
      created_at: b.created_at,
      updated_at: b.updated_at,
    };
  });
}

/**
 * Returns aggregate budget summary metrics across all budgets
 */
async function getBudgetSummary(accessToken, period = 'monthly') {
  const budgetsWithSpend = await getBudgetsWithSpend(accessToken, period);

  let totalAllocated = 0;
  let currentOutflow = 0;

  budgetsWithSpend.forEach((b) => {
    totalAllocated += Number(b.amount_limit || 0);
    currentOutflow += Number(b.spent || 0);
  });

  const remainingReserve = totalAllocated - currentOutflow;
  const capUtilization = totalAllocated > 0 ? currentOutflow / totalAllocated : 0;

  return {
    totalAllocated: Number(totalAllocated.toFixed(2)),
    currentOutflow: Number(currentOutflow.toFixed(2)),
    remainingReserve: Number(remainingReserve.toFixed(2)),
    capUtilization: Number(capUtilization.toFixed(4)),
  };
}

module.exports = {
  getBudgetsWithSpend,
  getBudgetSummary,
};
