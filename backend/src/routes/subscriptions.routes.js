/**
 * Subscriptions Routes
 * Member B - AI-Personal-Finance-Coach
 */

const express = require('express');
const router = express.Router();
const { verifyAuth } = require('../middleware/auth.middleware');
const {
  listSubscriptions,
  getSubscription,
  deleteSubscription,
  toggleRarelyUsed,
  addSubscription,
} = require('../controllers/subscriptionController');

router.use(verifyAuth);

router.post('/', addSubscription);
router.get('/', listSubscriptions);
router.get('/:id', getSubscription);
router.delete('/:id', deleteSubscription);
router.patch('/:id/rarely-used', toggleRarelyUsed);

module.exports = router;
