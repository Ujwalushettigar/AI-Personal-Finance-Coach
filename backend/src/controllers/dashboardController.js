const { getSupabaseClient } = require('../config/db');
const { detectRecurringExpenses } = require('../services/recurringDetection');

async function getDashboardSummary(req, res) {
  try {
    const userId = req.user?.id || req.user?.sub;
    const { data: transactions, error } = await getSupabaseClient(req.authToken)
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    if (error) throw error;

    const rows = transactions || [];
    const totalIncome = rows.filter((row) => row.type === 'income').reduce((sum, row) => sum + Number(row.amount || 0), 0);
    const totalExpense = rows.filter((row) => row.type === 'expense').reduce((sum, row) => sum + Number(row.amount || 0), 0);
    const activeSubscriptions = detectRecurringExpenses(rows).filter((item) => item.likelySubscription);

    const summary = {
      totalIncome: Number(totalIncome.toFixed(2)),
      totalExpense: Number(totalExpense.toFixed(2)),
      healthScore: null,
      recentTransactions: rows.slice(0, 5),
      activeSubscriptions,
    };
    return res.json(summary);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch dashboard summary', details: error.message });
  }
}

module.exports = {
  getDashboardSummary,
};
