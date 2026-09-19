/**
 * Budget & Savings Goals Express Router
 * Member C Module: FinPilot
 */

const express = require('express');
const router = express.Router();
const BudgetController = require('../controllers/budgetController');

// Financial Health Score route
router.get('/health-score', BudgetController.getHealthScore);

// Savings Goals routes (Declared before parameterized :id to prevent route hijacking)
router.get('/goals', BudgetController.getGoals);
router.post('/goals', BudgetController.createGoal);
router.put('/goals/:id', BudgetController.updateGoal);
router.delete('/goals/:id', BudgetController.deleteGoal);

// Category Budget routes
router.get('/', BudgetController.getBudgets);
router.post('/', BudgetController.createBudget);
router.get('/:id', BudgetController.getBudgetById);
router.put('/:id', BudgetController.updateBudget);
router.delete('/:id', BudgetController.deleteBudget);

module.exports = router;
