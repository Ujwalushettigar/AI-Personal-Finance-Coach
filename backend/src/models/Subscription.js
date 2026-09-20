/**
 * Subscription Model
 * Member B - AI-Personal-Finance-Coach
 */

const { getSupabaseClient } = require('../config/db');

async function getSubscriptions(userId, filters = {}) {
  const supabase = getSupabaseClient();
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

async function getSubscriptionById(userId, id) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function upsertSubscription(userId, merchantKey, data) {
  const supabase = getSupabaseClient();
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

async function deleteSubscription(userId, id) {
  const supabase = getSupabaseClient();
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

async function markRarelyUsed(userId, id, value) {
  const supabase = getSupabaseClient();
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

module.exports = {
  getSubscriptions,
  getSubscriptionById,
  upsertSubscription,
  deleteSubscription,
  markRarelyUsed,
};
