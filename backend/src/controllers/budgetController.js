const BudgetService = require('../services/budgetService');

const userId = (req) => req.user?.id || req.user?.sub;
const handle = (operation) => async (req, res) => {
  try {
    const result = await operation(req, userId(req), req.authToken);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

const BudgetController = {
  getBudgets: handle((req, id, token) => BudgetService.getBudgets(id, token)),
  getBudgetById: handle((req, id, token) => BudgetService.getBudgetById(req.params.id, id, token)),
  createBudget: async (req, res) => {
    try { const data = await BudgetService.createBudget(req.body, userId(req), req.authToken); return res.status(201).json({ success: true, message: 'Budget created successfully', data }); }
    catch (error) { return res.status(error.statusCode || 400).json({ success: false, message: error.message }); }
  },
  updateBudget: handle((req, id, token) => BudgetService.updateBudget(req.params.id, req.body, id, token)),
  deleteBudget: handle((req, id, token) => BudgetService.deleteBudget(req.params.id, id, token)),
  getGoals: handle((req, id, token) => BudgetService.getGoals(id, token)),
  getGoalById: handle((req, id, token) => BudgetService.getGoalById(req.params.id, id, token)),
  createGoal: async (req, res) => {
    try { const data = await BudgetService.createGoal(req.body, userId(req), req.authToken); return res.status(201).json({ success: true, message: 'Savings goal created successfully', data }); }
    catch (error) { return res.status(error.statusCode || 400).json({ success: false, message: error.message }); }
  },
  updateGoal: handle((req, id, token) => BudgetService.updateGoal(req.params.id, req.body, id, token)),
  deleteGoal: handle((req, id, token) => BudgetService.deleteGoal(req.params.id, id, token)),
  getHealthScore: handle((req, id, token) => BudgetService.getFinancialHealthScore(id, token)),
};

module.exports = BudgetController;
