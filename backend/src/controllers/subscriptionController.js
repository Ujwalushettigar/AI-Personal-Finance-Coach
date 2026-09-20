/**
 * Subscription Controller
 * Member B - AI-Personal-Finance-Coach
 */

const { getSupabaseClient } = require('../config/db');
const {
  getSubscriptions,
  getSubscriptionById,
  deleteSubscription: deleteSubscriptionModel,
  markRarelyUsed,
  upsertSubscription,
} = require('../models/Subscription');

// Note: upsertSubscription will be called internally by subscriptionLeakDetector.js once that service is built.

async function listSubscriptions(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const filters = {
      likelyOnly: req.query.likelyOnly === 'true',
      rarelyUsedOnly: req.query.rarelyUsedOnly === 'true',
    };
    const subscriptions = await getSubscriptions(userId, filters);
    return res.json(subscriptions);
  } catch (err) {
    console.error('Error in listSubscriptions:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function getSubscription(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const { id } = req.params;
    const subscription = await getSubscriptionById(userId, id);
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found or access denied' });
    }
    return res.json(subscription);
  } catch (err) {
    console.error('Error in getSubscription:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function deleteSubscription(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const { id } = req.params;
    const deleted = await deleteSubscriptionModel(userId, id);
    if (!deleted) {
      return res.status(404).json({ error: 'Subscription not found or access denied' });
    }
    return res.json({ message: 'Subscription deleted successfully', subscription: deleted });
  } catch (err) {
    console.error('Error in deleteSubscription:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function toggleRarelyUsed(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;
    const { id } = req.params;
    const value = req.body.rarely_used !== undefined
      ? req.body.rarely_used
      : (req.body.value !== undefined ? req.body.value : true);

    const updated = await markRarelyUsed(userId, id, value);
    if (!updated) {
      return res.status(404).json({ error: 'Subscription not found or access denied' });
    }
    return res.json(updated);
  } catch (err) {
    console.error('Error in toggleRarelyUsed:', err);
    return res.status(500).json({ error: err.message });
  }
}

module.exports = {
  listSubscriptions,
  getSubscription,
  deleteSubscription,
  toggleRarelyUsed,
};
