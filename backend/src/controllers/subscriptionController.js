/**
 * Subscription Controller
 * Member B - AI-Personal-Finance-Coach
 */

const { getSupabaseClient } = require('../config/db');
const {
  syncDetectedSubscriptions,
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
    await syncDetectedSubscriptions(userId, token);
    const subscriptions = await getSubscriptions(userId, filters, token);
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
    const subscription = await getSubscriptionById(userId, id, token);
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
    const deleted = await deleteSubscriptionModel(userId, id, token);
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
    const body = req.body || {};
    const value = body.rarely_used !== undefined
      ? body.rarely_used
      : (body.value !== undefined ? body.value : true);

    const updated = await markRarelyUsed(userId, id, value, token);
    if (!updated) {
      return res.status(404).json({ error: 'Subscription not found or access denied' });
    }
    return res.json(updated);
  } catch (err) {
    console.error('Error in toggleRarelyUsed:', err);
    return res.status(500).json({ error: err.message });
  }
}

async function addSubscription(req, res) {
  try {
    const token = req.token || req.authToken;
    getSupabaseClient(token);
    const userId = req.user.sub || req.user.id;

    const { merchant, cadence, amount } = req.body || {};
    const supportedCadences = new Set(['weekly', 'biweekly', 'monthly', 'quarterly', 'yearly']);
    const numericAmount = Number(amount);

    if (!String(merchant || '').trim() || !supportedCadences.has(cadence) || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: 'Missing required fields: merchant, cadence, amount' });
    }

    // Calculate costs
    let monthlyCost = 0;
    let yearlyCost = 0;
    switch(cadence) {
      case 'weekly': monthlyCost = numericAmount * 4.33; yearlyCost = numericAmount * 52; break;
      case 'biweekly': monthlyCost = numericAmount * 2.16; yearlyCost = numericAmount * 26; break;
      case 'monthly': monthlyCost = numericAmount; yearlyCost = numericAmount * 12; break;
      case 'quarterly': monthlyCost = numericAmount / 3; yearlyCost = numericAmount * 4; break;
      case 'yearly': monthlyCost = numericAmount / 12; yearlyCost = numericAmount; break;
      default: monthlyCost = numericAmount; yearlyCost = numericAmount * 12; break;
    }

    const { addManualSubscription } = require('../models/Subscription');
    const newSub = await addManualSubscription(userId, {
      merchant: merchant.trim(),
      cadence,
      amount: numericAmount,
      monthly_cost: monthlyCost,
      yearly_cost: yearlyCost
    }, token);

    return res.status(201).json({ success: true, subscription: newSub });
  } catch (err) {
    console.error('Error in addSubscription:', err);
    return res.status(err.statusCode || 500).json({ error: err.message });
  }
}

module.exports = {
  listSubscriptions,
  getSubscription,
  deleteSubscription,
  toggleRarelyUsed,
  addSubscription,
};
