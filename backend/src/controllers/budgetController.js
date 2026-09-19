/**
 * Budget & Savings Goals Controller
 * Member C Module: FinPilot
 */

const BudgetService = require('../services/budgetService');

class BudgetController {
  // Helper to extract authenticated user without inventing new auth
  static getUserId(req) {
    return req.user?.id || req.headers['x-user-id'] || 'user-1';
  }

  // GET /api/budgets
  static getBudgets(req, res) {
    try {
      const userId = BudgetController.getUserId(req);
      const result = BudgetService.getBudgets(userId);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/budgets/:id
  static getBudgetById(req, res) {
    try {
      const userId = BudgetController.getUserId(req);
      const budget = BudgetService.getBudgetById(req.params.id, userId);
      return res.status(200).json({
        success: true,
        data: budget
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /api/budgets
  static createBudget(req, res) {
    try {
      const userId = BudgetController.getUserId(req);
      const newBudget = BudgetService.createBudget(req.body, userId);
      return res.status(201).json({
        success: true,
        message: 'Budget created successfully',
        data: newBudget
      });
    } catch (error) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /api/budgets/:id
  static updateBudget(req, res) {
    try {
      const userId = BudgetController.getUserId(req);
      const updatedBudget = BudgetService.updateBudget(req.params.id, req.body, userId);
      return res.status(200).json({
        success: true,
        message: 'Budget updated successfully',
        data: updatedBudget
      });
    } catch (error) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /api/budgets/:id
  static deleteBudget(req, res) {
    try {
      const userId = BudgetController.getUserId(req);
      const result = BudgetService.deleteBudget(req.params.id, userId);
      return res.status(200).json({
        success: true,
        message: 'Budget deleted successfully',
        data: result
      });
    } catch (error) {
      return res.status(error.statusCode || 404).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/budgets/goals
  static getGoals(req, res) {
    try {
      const userId = BudgetController.getUserId(req);
      const result = BudgetService.getGoals(userId);
      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /api/budgets/goals
  static createGoal(req, res) {
    try {
      const userId = BudgetController.getUserId(req);
      const newGoal = BudgetService.createGoal(req.body, userId);
      return res.status(201).json({
        success: true,
        message: 'Savings goal created successfully',
        data: newGoal
      });
    } catch (error) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message
      });
    }
  }

  // PUT /api/budgets/goals/:id
  static updateGoal(req, res) {
    try {
      const userId = BudgetController.getUserId(req);
      const updatedGoal = BudgetService.updateGoal(req.params.id, req.body, userId);
      return res.status(200).json({
        success: true,
        message: 'Savings goal updated successfully',
        data: updatedGoal
      });
    } catch (error) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message
      });
    }
  }

  // DELETE /api/budgets/goals/:id
  static deleteGoal(req, res) {
    try {
      const userId = BudgetController.getUserId(req);
      const result = BudgetService.deleteGoal(req.params.id, userId);
      return res.status(200).json({
        success: true,
        message: 'Savings goal deleted successfully',
        data: result
      });
    } catch (error) {
      return res.status(error.statusCode || 404).json({
        success: false,
        message: error.message
      });
    }
  }

  // GET /api/budgets/health-score
  static getHealthScore(req, res) {
    try {
      const userId = BudgetController.getUserId(req);
      const healthScore = BudgetService.getFinancialHealthScore(userId);
      return res.status(200).json({
        success: true,
        data: healthScore
      });
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = BudgetController;
