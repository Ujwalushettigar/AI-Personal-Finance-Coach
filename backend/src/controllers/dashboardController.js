/**
 * Dashboard Controller
 * Connects /api/dashboard endpoint to insightEngine services.
 */

const { getDashboardSummary: fetchDashboardSummary } = require('../services/insightEngine');
const { computeHealthScore } = require('../services/healthScoreEngine');

async function getDashboardSummary(req, res) {
  try {
    const token = req.token || req.authToken;
    const result = await fetchDashboardSummary(token);
    try {
      const healthScore = await computeHealthScore(token);
      result.healthScore = healthScore;
    } catch (hErr) {
      console.warn('Failed to compute health score for dashboard summary:', hErr.message);
      result.healthScore = null;
    }
    return res.json(result);
  } catch (err) {
    console.error('Error in getDashboardSummary controller:', err);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getDashboardSummary,
};
