const { createClient } = require('@supabase/supabase-js');
const { AsyncLocalStorage } = require('async_hooks');

const asyncLocalStorage = new AsyncLocalStorage();
let supabaseInstance = null;

function getSupabaseClient(accessToken) {
  const token = accessToken || asyncLocalStorage.getStore()?.token;
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.');
  }

  if (token) {
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    });
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
}

function runWithToken(token, callback) {
  return asyncLocalStorage.run({ token }, callback);
}

module.exports = {
  getSupabaseClient,
  runWithToken,
};
