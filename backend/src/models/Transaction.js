/**
 * Transaction Model
 * Member A - AI-Personal-Finance-Coach
 * 
 * Follows standard SQL relational query conventions for the transactions table.
 * Designed to connect to the database client exported by Member D at backend/src/config/db.js.
 */

const { getSupabaseClient } = require('../config/db');

function client(accessToken) {
  return getSupabaseClient(accessToken);
}

class Transaction {
  /**
   * Set or override the database client (useful for dependency injection or testing)
   * @param {Object} client - Object with a query(text, params) function
   */
  static setDbClient() {}

  /**
   * Retrieve active database client or throw descriptive error
   * @returns {Object} dbClient with query method
   */
  static getDb(accessToken) { return client(accessToken); }

  /**
   * Create a new transaction record
   * @param {Object} data
   * @param {string} [data.id]
   * @param {string} data.user_id
   * @param {number} data.amount
   * @param {string} data.type - 'income' | 'expense'
   * @param {string} data.category
   * @param {string} data.description
   * @param {string} [data.merchant]
   * @param {string} [data.date]
   * @returns {Promise<Object>} Created transaction
   */
  static async create(data, accessToken) {
    const date = data.date || new Date().toISOString().split('T')[0];
    const merchant = data.merchant || null;
    const { data: row, error } = await client(accessToken).from('transactions').insert({
      user_id: data.user_id,
      amount: parseFloat(data.amount),
      type: data.type.toLowerCase(),
      category: data.category,
      description: data.description.trim(),
      merchant,
      date,
    }).select().single();
    if (error) throw error;
    return row;
  }

  /**
   * Find transactions matching filters
   * @param {Object} filters
   * @param {string} [filters.user_id]
   * @param {string} [filters.type]
   * @param {string} [filters.category]
   * @param {string} [filters.startDate]
   * @param {string} [filters.endDate]
   * @param {string} [filters.search]
   * @param {number} [filters.limit]
   * @param {number} [filters.offset]
   * @returns {Promise<Array>} List of transactions
   */
  static async findAll(filters = {}, accessToken) {
    let query = client(accessToken).from('transactions').select('*').eq('user_id', filters.user_id).order('date', { ascending: false }).order('created_at', { ascending: false });
    if (filters.type) query = query.eq('type', filters.type.toLowerCase());
    if (filters.category) query = query.ilike('category', filters.category.trim());
    if (filters.startDate) query = query.gte('date', filters.startDate);
    if (filters.endDate) query = query.lte('date', filters.endDate);
    if (filters.search) query = query.or(`description.ilike.%${filters.search.trim()}%,merchant.ilike.%${filters.search.trim()}%`);
    if (filters.limit) query = query.limit(parseInt(filters.limit, 10));
    if (filters.offset) query = query.range(parseInt(filters.offset, 10), parseInt(filters.offset, 10) + (parseInt(filters.limit, 10) || 1000) - 1);
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  }

  /**
   * Find a transaction by ID
   * @param {string} id 
   * @param {string} [userId]
   * @returns {Promise<Object|null>}
   */
  static async findById(id, userId, accessToken) {
    const { data, error } = await client(accessToken).from('transactions').select('*').eq('id', id).eq('user_id', userId).maybeSingle();
    if (error) throw error;
    return data;
  }

  /**
   * Update a transaction by ID
   * @param {string} id 
   * @param {string|null} userId 
   * @param {Object} updateData 
   * @returns {Promise<Object|null>} Updated transaction
   */
  static async update(id, userId, updateData = {}, accessToken) {
    const payload = { ...updateData };
    if (payload.amount !== undefined) payload.amount = parseFloat(payload.amount);
    if (payload.type) payload.type = payload.type.toLowerCase();
    if (payload.description) payload.description = payload.description.trim();
    const { data, error } = await client(accessToken).from('transactions').update(payload).eq('id', id).eq('user_id', userId).select().maybeSingle();
    if (error) throw error;
    return data;
  }

  /**
   * Delete a transaction by ID
   * @param {string} id 
   * @param {string|null} userId 
   * @returns {Promise<Object|null>} Deleted transaction
   */
  static async delete(id, userId, accessToken) {
    const { data, error } = await client(accessToken).from('transactions').delete().eq('id', id).eq('user_id', userId).select().maybeSingle();
    if (error) throw error;
    return data;
  }
}

module.exports = Transaction;
