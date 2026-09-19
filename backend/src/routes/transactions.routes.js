/**
 * Transactions Routes
 * Member A - AI-Personal-Finance-Coach
 * 
 * Maps HTTP routes for transaction management to transactionController.
 * When mounted in backend/src/app.js (e.g. app.use('/api/transactions', transactionRoutes)),
 * exposes:
 *   POST   /api/transactions
 *   GET    /api/transactions
 *   GET    /api/transactions/:id
 *   PUT    /api/transactions/:id
 *   DELETE /api/transactions/:id
 */

let router;
try {
  const express = require('express');
  router = express.Router();
} catch (err) {
  // Graceful fallback if express is not yet installed in node_modules
  router = {
    _routes: [],
    get(path, ...handlers) { this._routes.push({ method: 'GET', path, handlers }); return this; },
    post(path, ...handlers) { this._routes.push({ method: 'POST', path, handlers }); return this; },
    put(path, ...handlers) { this._routes.push({ method: 'PUT', path, handlers }); return this; },
    delete(path, ...handlers) { this._routes.push({ method: 'DELETE', path, handlers }); return this; }
  };
}

const transactionController = require('../controllers/transactionController');

// Transaction CRUD Endpoints
router.post('/', transactionController.createTransaction);
router.get('/', transactionController.getTransactions);
router.get('/:id', transactionController.getTransactionById);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
