/**
 * Transaction Controller
 * Member A - AI-Personal-Finance-Coach
 */

const { getSupabaseClient } = require('../config/db');
const {
  getTransactions,
  getTransactionById,
  createTransaction: createTransactionModel,
  updateTransaction: updateTransactionModel,
  deleteTransaction: deleteTransactionModel,
} = require('../models/Transaction');

async function listTransactions(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const filters = {
      category: req.query.category,
      type: req.query.type,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
    };
    const transactions = await getTransactions(userId, filters);
    return res.json(transactions);
  } catch (err) {
    console.error('Error in listTransactions:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function getTransaction(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const { id } = req.params;
    const transaction = await getTransactionById(userId, id);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found or access denied' });
    }
    return res.json(transaction);
  } catch (err) {
    console.error('Error in getTransaction:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function createTransaction(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const { amount, type, date, category, description, merchant } = req.body;

    if (amount === undefined || amount === null || amount === '' || !type || !date) {
      return res.status(400).json({ error: 'Missing required fields: amount, type, and date are required.' });
    }

    const newTransaction = await createTransactionModel(userId, {
      amount,
      type,
      date,
      category,
      description,
      merchant,
    });

    return res.status(201).json(newTransaction);
  } catch (err) {
    console.error('Error in createTransaction:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function updateTransaction(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const { id } = req.params;
    const updatedTransaction = await updateTransactionModel(userId, id, req.body);
    if (!updatedTransaction) {
      return res.status(404).json({ error: 'Transaction not found or access denied' });
    }
    return res.json(updatedTransaction);
  } catch (err) {
    console.error('Error in updateTransaction:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function deleteTransaction(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const { id } = req.params;
    const deletedTransaction = await deleteTransactionModel(userId, id);
    if (!deletedTransaction) {
      return res.status(404).json({ error: 'Transaction not found or access denied' });
    }
    return res.json({ message: 'Transaction deleted successfully', transaction: deletedTransaction });
  } catch (err) {
    console.error('Error in deleteTransaction:', err);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  listTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
