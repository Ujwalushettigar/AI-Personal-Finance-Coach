/**
 * Budget Model
 * Member C - AI-Personal-Finance-Coach
 */

const { getSupabaseClient } = require('../config/db');

async function getBudgets(userId) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

async function getBudgetById(userId, id) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function createBudget(userId, data) {
  const supabase = getSupabaseClient();
  const { data: newBudget, error } = await supabase
    .from('budgets')
    .insert([
      {
        user_id: userId,
        category: data.category,
        amount_limit: parseFloat(data.amount_limit),
        period: data.period || 'monthly',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return newBudget;
}

async function updateBudget(userId, id, data) {
  const supabase = getSupabaseClient();
  const updatePayload = {
    ...data,
    updated_at: new Date().toISOString(),
  };
  delete updatePayload.user_id;
  delete updatePayload.id;

  if (updatePayload.amount_limit !== undefined) {
    updatePayload.amount_limit = parseFloat(updatePayload.amount_limit);
  }

  const { data: updatedBudget, error } = await supabase
    .from('budgets')
    .update(updatePayload)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return updatedBudget;
}

async function deleteBudget(userId, id) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('budgets')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
}

module.exports = {
  getBudgets,
  getBudgetById,
  createBudget,
  updateBudget,
  deleteBudget,
};
