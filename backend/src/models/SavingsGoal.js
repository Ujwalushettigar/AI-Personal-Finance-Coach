/**
 * Savings Goal Model
 * Member C - AI-Personal-Finance-Coach
 */

const { getSupabaseClient } = require('../config/db');

async function getSavingsGoals(userId, token) {
  const supabase = getSupabaseClient(token);
  const { data, error } = await supabase
    .from('savings_goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

async function getSavingsGoalById(userId, id, token) {
  const supabase = getSupabaseClient(token);
  const { data, error } = await supabase
    .from('savings_goals')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function createSavingsGoal(userId, data, token) {
  const supabase = getSupabaseClient(token);
  const { data: newGoal, error } = await supabase
    .from('savings_goals')
    .insert([
      {
        user_id: userId,
        title: data.title,
        target_amount: parseFloat(data.target_amount),
        current_amount: data.current_amount ? parseFloat(data.current_amount) : 0,
        target_date: data.target_date || null,
        category: data.category || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return newGoal;
}

async function updateSavingsGoal(userId, id, data, token) {
  const supabase = getSupabaseClient(token);
  const updatePayload = {
    ...data,
    updated_at: new Date().toISOString(),
  };
  delete updatePayload.user_id;
  delete updatePayload.id;

  if (updatePayload.target_amount !== undefined) {
    updatePayload.target_amount = parseFloat(updatePayload.target_amount);
  }
  if (updatePayload.current_amount !== undefined) {
    updatePayload.current_amount = parseFloat(updatePayload.current_amount);
  }

  const { data: updatedGoal, error } = await supabase
    .from('savings_goals')
    .update(updatePayload)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return updatedGoal;
}

async function updateProgress(userId, id, addedAmount, token) {
  const currentGoal = await getSavingsGoalById(userId, id, token);
  if (!currentGoal) return null;

  const newCurrentAmount = (parseFloat(currentGoal.current_amount) || 0) + parseFloat(addedAmount);

  const supabase = getSupabaseClient(token);
  const { data: updatedGoal, error } = await supabase
    .from('savings_goals')
    .update({
      current_amount: newCurrentAmount,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return updatedGoal;
}

async function deleteSavingsGoal(userId, id, token) {
  const supabase = getSupabaseClient(token);
  const { data, error } = await supabase
    .from('savings_goals')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

module.exports = {
  getSavingsGoals,
  getSavingsGoalById,
  createSavingsGoal,
  updateSavingsGoal,
  updateProgress,
  deleteSavingsGoal,
};
