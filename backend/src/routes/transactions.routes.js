/**
 * Transactions Routes
 * Member A - AI-Personal-Finance-Coach
 */

const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../middleware/auth.middleware');
const {
  listTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require('../controllers/transactionController');

router.use(verifyAuth);

router.get('/', listTransactions);
router.get('/:id', getTransaction);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
