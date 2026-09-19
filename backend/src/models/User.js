const { getSupabaseClient } = require('../config/db');

async function getUserById(userId) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('users')
    .select('id, email, full_name, created_at')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

async function createUserProfile(userId, data) {
  const supabase = getSupabaseClient();
  const { data: newUser, error } = await supabase
    .from('users')
    .insert([
      {
        id: userId,
        email: data.email,
        full_name: data.full_name,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return newUser;
}

async function updateUserProfile(userId, data) {
  const supabase = getSupabaseClient();
  const { data: updatedUser, error } = await supabase
    .from('users')
    .update({
      email: data.email,
      full_name: data.full_name,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return updatedUser;
}

module.exports = {
  getUserById,
  createUserProfile,
  updateUserProfile,
};
