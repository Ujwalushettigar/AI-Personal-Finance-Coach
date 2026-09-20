/**
 * Insight Engine Service
 * Generates financial telemetry & dashboard summaries using authenticated Supabase queries.
 */

const { getSupabaseClient } = require('../config/db');

async function getDashboardSummary(accessToken) {
  const supabase = getSupabaseClient(accessToken);

  // 1. Fetch transactions to compute total income and total expense
  const { data: txData, error: txError } = await supabase
    .from('transactions')
    .select('*');

  if (txError) {
    throw new Error(`Failed to fetch transactions for dashboard summary: ${txError.message}`);
  }

  const transactions = txData || [];
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((tx) => {
    const amount = Number(tx.amount || 0);
    if (tx.type === 'income') {
      totalIncome += amount;
    } else if (tx.type === 'expense') {
      totalExpense += amount;
    }
  });

  // 2. Fetch 5 most recent transactions ordered by date descending
  const { data: recentData, error: recentError } = await supabase
    .from('transactions')
    .select('*')
    .order('date', { ascending: false })
    .limit(5);

  if (recentError) {
    throw new Error(`Failed to fetch recent transactions: ${recentError.message}`);
  }

  // 3. Fetch active subscriptions ordered by monthly_cost descending
  const { data: subData, error: subError } = await supabase
    .from('subscriptions')
    .select('*')
    .order('monthly_cost', { ascending: false });

  if (subError) {
    throw new Error(`Failed to fetch active subscriptions: ${subError.message}`);
  }

  return {
    totalIncome: Number(totalIncome.toFixed(2)),
    totalExpense: Number(totalExpense.toFixed(2)),
    healthScore: null,
    recentTransactions: recentData || [],
    activeSubscriptions: subData || [],
  };
}

module.exports = {
  getDashboardSummary,
};
