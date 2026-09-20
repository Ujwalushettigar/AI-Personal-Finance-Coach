/**
 * Transaction Model
 * Member A - AI-Personal-Finance-Coach
 */

const { getSupabaseClient } = require('../config/db');

async function getTransactions(userId, filters = {}) {
  const supabase = getSupabaseClient();
  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.type) {
    query = query.eq('type', filters.type);
  }
  if (filters.startDate) {
    query = query.gte('date', filters.startDate);
  }
  if (filters.endDate) {
    query = query.lte('date', filters.endDate);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async function getTransactionById(userId, id) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function createTransaction(userId, data) {
  const supabase = getSupabaseClient();
  const { data: newRow, error } = await supabase
    .from('transactions')
    .insert([
      {
        user_id: userId,
        amount: parseFloat(data.amount),
        type: data.type,
        category: data.category || null,
        description: data.description || null,
        merchant: data.merchant || null,
        date: data.date,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return newRow;
}

async function updateTransaction(userId, id, data) {
  const supabase = getSupabaseClient();
  const updatePayload = {
    ...data,
    updated_at: new Date().toISOString(),
  };
  delete updatePayload.user_id;
  delete updatePayload.id;

  if (updatePayload.amount !== undefined) {
    updatePayload.amount = parseFloat(updatePayload.amount);
  }

  const { data: updatedRow, error } = await supabase
    .from('transactions')
    .update(updatePayload)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return updatedRow;
}

async function deleteTransaction(userId, id) {
  const supabase = getSupabaseClient();
  const { data: deletedRow, error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .maybeSingle();

  if (error) throw error;
  return deletedRow;
}

module.exports = {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};
