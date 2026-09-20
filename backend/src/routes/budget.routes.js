/**
 * Budget & Savings Goals Routes
 * Member C - AI-Personal-Finance-Coach
 */

const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../middleware/auth.middleware');
const {
  listBudgetsWithSpend,
  getBudgetSummary,
  getHealthScore,
  listBudgets,
  createBudget,
  updateBudget,
  deleteBudget,
  listSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  addSavingsProgress,
  deleteSavingsGoal,
} = require('../controllers/budgetController');

router.use(verifyAuth);

// Real category spend, summary, and health score routes (placed at top to prevent route collision)
router.get('/with-spend', listBudgetsWithSpend);
router.get('/summary', getBudgetSummary);
router.get('/health-score', getHealthScore);

// Savings Goals routes
router.get('/goals', listSavingsGoals);
router.post('/goals', createSavingsGoal);
router.put('/goals/:id', updateSavingsGoal);
router.patch('/goals/:id/progress', addSavingsProgress);
router.delete('/goals/:id', deleteSavingsGoal);

// Budget routes
router.get('/', listBudgets);
router.post('/', createBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

module.exports = router;
