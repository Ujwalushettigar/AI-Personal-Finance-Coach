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
  previewImportTransactionsFromCsv,
  importTransactionsFromCsv,
  uploadCsvMiddleware,
} = require('../controllers/transactionController');

router.use(verifyAuth);

router.post('/preview-import', (req, res, next) => {
  uploadCsvMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'CSV file upload error' });
    }
    next();
  });
}, previewImportTransactionsFromCsv);

router.post('/import', (req, res, next) => {
  uploadCsvMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'CSV file upload error' });
    }
    next();
  });
}, importTransactionsFromCsv);

router.get('/', listTransactions);
router.get('/:id', getTransaction);
router.post('/', createTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', deleteTransaction);

module.exports = router;
