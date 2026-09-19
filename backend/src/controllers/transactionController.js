/**
 * Transaction Controller
 * Member A - AI-Personal-Finance-Coach
 * 
 * Handles HTTP requests for transaction CRUD operations, input validation,
 * automatic categorization, and manual category overrides.
 */

const Transaction = require('../models/Transaction');
const categorizationService = require('../services/categorizationService');

/**
 * Extract user ID safely without introducing new auth middleware
 */
const getUserId = (req) => {
  return req.user?.id || req.headers['x-user-id'] || null;
};

/**
 * Validate ISO/YYYY-MM-DD date string
 */
const isValidDateString = (dateStr) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
};

/**
 * POST /api/transactions
 * Create a new income or expense transaction
 */
const createTransaction = async (req, res) => {
  try {
    const { amount, type, category, description, merchant, date } = req.body;

    // 1. Input Validations
    if (amount === undefined || amount === null || isNaN(amount) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: Amount must be a positive number greater than 0.'
      });
    }

    if (!type || (type.toLowerCase() !== 'income' && type.toLowerCase() !== 'expense')) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: Type must be either "income" or "expense".'
      });
    }

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: Description is required.'
      });
    }

    let transactionDate = date;
    if (date) {
      if (!isValidDateString(date)) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error: Date must be a valid date string (e.g. YYYY-MM-DD).'
        });
      }
      transactionDate = new Date(date).toISOString().split('T')[0];
    } else {
      transactionDate = new Date().toISOString().split('T')[0];
    }

    // 2. Resolve Category (Manual Selection strictly overrides Automatic Rule-Based Categorization)
    const normalizedType = type.toLowerCase();
    const finalCategory = categorizationService.categorizeTransaction({
      description: description.trim(),
      merchant: merchant ? merchant.trim() : '',
      type: normalizedType,
      manualCategory: category
    });

    const userId = getUserId(req);

    // 3. Persist via Transaction model
    const newTransaction = await Transaction.create({
      user_id: userId,
      amount: parseFloat(amount),
      type: normalizedType,
      category: finalCategory,
      description: description.trim(),
      merchant: merchant ? merchant.trim() : null,
      date: transactionDate
    }, req.authToken);

    return res.status(201).json({
      success: true,
      message: 'Transaction created successfully.',
      data: newTransaction
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error while creating transaction.'
    });
  }
};

/**
 * GET /api/transactions
 * Retrieve transactions with optional filters (type, category, search, date range)
 */
const getTransactions = async (req, res) => {
  try {
    const { type, category, startDate, endDate, search, limit, offset } = req.query;
    const userId = getUserId(req);

    if (type && type.toLowerCase() !== 'income' && type.toLowerCase() !== 'expense') {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: Query type filter must be either "income" or "expense".'
      });
    }

    if (startDate && !isValidDateString(startDate)) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: startDate must be a valid date.'
      });
    }

    if (endDate && !isValidDateString(endDate)) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: endDate must be a valid date.'
      });
    }

    const transactions = await Transaction.findAll({
      user_id: userId,
      type,
      category,
      startDate,
      endDate,
      search,
      limit,
      offset
    }, req.authToken);

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error while retrieving transactions.'
    });
  }
};

/**
 * GET /api/transactions/:id
 * Retrieve a single transaction by ID
 */
const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    if (!id || id.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: Transaction ID is required.'
      });
    }

    const transaction = await Transaction.findById(id, userId, req.authToken);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found.'
      });
    }

    return res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error while retrieving transaction.'
    });
  }
};

/**
 * PUT /api/transactions/:id
 * Update an existing transaction by ID
 */
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);
    const { amount, type, category, description, merchant, date } = req.body;

    if (!id || id.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: Transaction ID is required.'
      });
    }

    // Check existence
    const existing = await Transaction.findById(id, userId, req.authToken);
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found.'
      });
    }

    // Validations on update fields
    const updateData = {};

    if (amount !== undefined) {
      if (isNaN(amount) || parseFloat(amount) <= 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error: Amount must be a positive number greater than 0.'
        });
      }
      updateData.amount = parseFloat(amount);
    }

    if (type !== undefined) {
      if (type.toLowerCase() !== 'income' && type.toLowerCase() !== 'expense') {
        return res.status(400).json({
          success: false,
          error: 'Validation Error: Type must be either "income" or "expense".'
        });
      }
      updateData.type = type.toLowerCase();
    }

    if (description !== undefined) {
      if (typeof description !== 'string' || description.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error: Description cannot be empty.'
        });
      }
      updateData.description = description.trim();
    }

    if (merchant !== undefined) {
      updateData.merchant = merchant ? merchant.trim() : null;
    }

    if (date !== undefined) {
      if (!isValidDateString(date)) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error: Date must be a valid date.'
        });
      }
      updateData.date = new Date(date).toISOString().split('T')[0];
    }

    // Category handling
    if (category !== undefined && category !== null && category.trim().length > 0) {
      // Manual category override
      updateData.category = category.trim();
    } else if (category === '' && (updateData.description || updateData.type)) {
      // Re-evaluate category if description/type changed and category cleared
      const effectiveType = updateData.type || existing.type;
      const effectiveDesc = updateData.description || existing.description;
      const effectiveMerchant = updateData.merchant !== undefined ? updateData.merchant : existing.merchant;
      updateData.category = categorizationService.categorizeTransaction({
        description: effectiveDesc,
        merchant: effectiveMerchant,
        type: effectiveType
      });
    }

    const updated = await Transaction.update(id, userId, updateData, req.authToken);

    return res.status(200).json({
      success: true,
      message: 'Transaction updated successfully.',
      data: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error while updating transaction.'
    });
  }
};

/**
 * DELETE /api/transactions/:id
 * Delete a transaction by ID
 */
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = getUserId(req);

    if (!id || id.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error: Transaction ID is required.'
      });
    }

    const deleted = await Transaction.delete(id, userId, req.authToken);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully.',
      data: { id }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error while deleting transaction.'
    });
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction
};
