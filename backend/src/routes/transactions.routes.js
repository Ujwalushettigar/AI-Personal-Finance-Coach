/**
 * Transactions Routes
 * Member A - AI-Personal-Finance-Coach
 *
 * Maps HTTP routes for transaction management to transactionController.
 */

const express = require('express');
const router = express.Router();

const transactionController = require('../controllers/transactionController');

// Transaction CRUD Endpoints
router.post('/', transactionController.createTransaction);
router.get('/', transactionController.getTransactions);
router.get('/:id', transactionController.getTransactionById);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;