/**
 * Subscription Model
 * Member B - AI-Personal-Finance-Coach
 */

const { getSupabaseClient } = require('../config/db');
const { detectRecurringExpenses, normalizeMerchant } = require('../services/recurringDetection');

async function syncDetectedSubscriptions(userId, token) {
  const supabase = getSupabaseClient(token);
  const { data: transactions, error: transactionError } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });

  if (transactionError) throw transactionError;

  const detectedSubscriptions = detectRecurringExpenses(transactions || []);
  const { data: existingSubscriptions, error: existingError } = await supabase
    .from('subscriptions')
    .select('merchant_key, merchant, cadence, amount, average_amount, monthly_cost, yearly_cost, confidence, transaction_count, last_payment, next_expected_payment, average_interval_days, likely_subscription, transactions')
    .eq('user_id', userId);

  if (existingError) throw existingError;

  const existingByKey = new Map(
    (existingSubscriptions || []).map((subscription) => [subscription.merchant_key, subscription]),
  );

  for (const subscription of detectedSubscriptions) {
    const merchantKey = normalizeMerchant(subscription.merchant).replace(/\s+/g, '');
    const payload = {
      user_id: userId,
      merchant: subscription.merchant,
      merchant_key: merchantKey,
      cadence: subscription.cadence,
      amount: subscription.amount,
      average_amount: subscription.averageAmount,
      monthly_cost: subscription.monthlyCost,
      yearly_cost: subscription.yearlyCost,
      confidence: subscription.confidence,
      transaction_count: subscription.transactionCount,
      last_payment: subscription.lastPayment,
      next_expected_payment: subscription.nextExpectedPayment,
      average_interval_days: subscription.averageIntervalDays,
      likely_subscription: subscription.likelySubscription,
      transactions: subscription.transactions,
      updated_at: new Date().toISOString(),
    };

    const existing = existingByKey.get(merchantKey);
    const hasChanges = !existing || [
      'merchant',
      'cadence',
      'amount',
      'average_amount',
      'monthly_cost',
      'yearly_cost',
      'confidence',
      'transaction_count',
      'last_payment',
      'next_expected_payment',
      'average_interval_days',
      'likely_subscription',
      'transactions',
    ].some((field) => JSON.stringify(existing[field]) !== JSON.stringify(payload[field]));

    if (!hasChanges) continue;

    const { error: upsertError } = await supabase
      .from('subscriptions')
      .upsert(payload, { onConflict: 'user_id,merchant_key' });

    if (upsertError) throw upsertError;
  }

  return detectedSubscriptions;
}

async function getSubscriptions(userId, filters = {}, token) {
  const supabase = getSupabaseClient(token);
  let query = supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('monthly_cost', { ascending: false });

  if (filters.likelyOnly) {
    query = query.eq('likely_subscription', true);
  }
  if (filters.rarelyUsedOnly) {
    query = query.eq('rarely_used', true);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async function getSubscriptionById(userId, id, token) {
  const supabase = getSupabaseClient(token);
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function upsertSubscription(userId, merchantKey, data, token) {
  const supabase = getSupabaseClient(token);
  const payload = {
    ...data,
    user_id: userId,
    merchant_key: merchantKey,
    updated_at: new Date().toISOString(),
  };

  const { data: upsertedRow, error } = await supabase
    .from('subscriptions')
    .upsert(payload, { onConflict: 'user_id,merchant_key' })
    .select()
    .single();

  if (error) throw error;
  return upsertedRow;
}

async function deleteSubscription(userId, id, token) {
  const supabase = getSupabaseClient(token);
  const { data, error } = await supabase
    .from('subscriptions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function markRarelyUsed(userId, id, value, token) {
  const supabase = getSupabaseClient(token);
  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      rarely_used: Boolean(value),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function addManualSubscription(userId, data, token) {
  const supabase = getSupabaseClient(token);
  const merchantKey = data.merchant.toLowerCase().replace(/[^a-z0-9]/g, '');
  const payload = {
    ...data,
    user_id: userId,
    merchant_key: merchantKey,
    likely_subscription: true,
    confidence: 100,
    updated_at: new Date().toISOString(),
  };

  const { data: insertedRow, error } = await supabase
    .from('subscriptions')
    .insert(payload)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') { // unique constraint violation
      throw Object.assign(new Error(`A subscription for ${data.merchant} already exists.`), { statusCode: 409 });
    }
    throw error;
  }
  return insertedRow;
}

module.exports = {
  syncDetectedSubscriptions,
  getSubscriptions,
  getSubscriptionById,
  upsertSubscription,
  deleteSubscription,
  markRarelyUsed,
  addManualSubscription,
};
