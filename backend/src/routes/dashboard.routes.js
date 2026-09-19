const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../middleware/auth.middleware');
const { getDashboardSummary } = require('../controllers/dashboardController');

router.get('/summary', verifyAuth, getDashboardSummary);

module.exports = router;
