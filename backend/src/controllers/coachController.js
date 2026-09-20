const { askCoach: askCoachService } = require('../services/coachService');
const { getSupabaseClient } = require('../config/db');

async function getCompactUserContext(req) {
  const userId = req.user?.id || req.user?.sub;
  if (!userId || !req.authToken) return {};

  const { data, error } = await getSupabaseClient(req.authToken)
    .from('transactions')
    .select('amount, type, category, merchant, date')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(30);

  if (error) throw error;

  const transactions = data || [];
  const summary = transactions.reduce((result, transaction) => {
    const amount = Number(transaction.amount || 0);
    const type = transaction.type === 'income' ? 'income' : 'expense';
    result[type] += amount;
    if (type === 'expense') {
      result.categories[transaction.category || 'Uncategorized'] =
        (result.categories[transaction.category || 'Uncategorized'] || 0) + amount;
    }
    return result;
  }, { income: 0, expense: 0, categories: {} });

  const topCategories = Object.entries(summary.categories)
    .sort(([, first], [, second]) => second - first)
    .slice(0, 5)
    .reduce((result, [category, amount]) => ({ ...result, [category]: Number(amount.toFixed(2)) }), {});

  return {
    transactionCount: transactions.length,
    income: Number(summary.income.toFixed(2)),
    expense: Number(summary.expense.toFixed(2)),
    topExpenseCategories: topCategories,
    recentTransactions: transactions.slice(0, 8).map(({ amount, type, category, merchant, date }) => ({
      amount: Number(amount), type, category, merchant, date,
    })),
  };
}

async function askCoach(req, res) {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required and must be a non-empty string' });
    }

    if (message.trim().length > 1000) {
      return res.status(400).json({ error: 'Message must be 1000 characters or fewer' });
    }

    const userContext = await getCompactUserContext(req);
    const reply = await askCoachService(message.trim(), userContext);

    return res.json({ reply });
  } catch (error) {
    console.error('Error in coachController.askCoach:', {
      message: error?.message,
      responseData: error?.response?.data,
      stack: error?.stack,
      rawError: error,
    });
    return res.status(500).json({
      error: 'Failed to process coach request',
      details: error.message,
      debug: error.message,
    });
  }
}

module.exports = {
  askCoach,
};
