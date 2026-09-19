/**
 * Transaction Model
 * Member A - AI-Personal-Finance-Coach
 * 
 * Follows standard SQL relational query conventions for the transactions table.
 * Designed to connect to the database client exported by Member D at backend/src/config/db.js.
 */

const crypto = require('crypto');

// Attempt to load database client from backend/src/config/db.js if configured by Member D
let dbClient = null;
try {
  dbClient = require('../config/db');
} catch (err) {
  // DB client has not yet been implemented by Member D
  dbClient = null;
}

class Transaction {
  /**
   * Set or override the database client (useful for dependency injection or testing)
   * @param {Object} client - Object with a query(text, params) function
   */
  static setDbClient(client) {
    dbClient = client;
  }

  /**
   * Retrieve active database client or throw descriptive error
   * @returns {Object} dbClient with query method
   */
  static getDb() {
    if (dbClient && typeof dbClient.query === 'function') {
      return dbClient;
    }
    throw new Error(
      'Database connection not configured. Awaiting Member D to provide database connection in backend/src/config/db.js'
    );
  }

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
  static async create(data) {
    const db = Transaction.getDb();
    const id = data.id || crypto.randomUUID();
    const date = data.date || new Date().toISOString().split('T')[0];
    const merchant = data.merchant || null;
    const userId = data.user_id || 'default-user';

    const sql = `
      INSERT INTO transactions (
        id, user_id, amount, type, category, description, merchant, date, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *;
    `;
    const params = [
      id,
      userId,
      parseFloat(data.amount),
      data.type.toLowerCase(),
      data.category,
      data.description.trim(),
      merchant,
      date
    ];

    const result = await db.query(sql, params);
    return result.rows ? result.rows[0] : result[0];
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
  static async findAll(filters = {}) {
    const db = Transaction.getDb();
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (filters.user_id) {
      conditions.push(`user_id = $${paramIndex++}`);
      params.push(filters.user_id);
    }

    if (filters.type) {
      conditions.push(`type = $${paramIndex++}`);
      params.push(filters.type.toLowerCase());
    }

    if (filters.category) {
      conditions.push(`LOWER(category) = LOWER($${paramIndex++})`);
      params.push(filters.category.trim());
    }

    if (filters.startDate) {
      conditions.push(`date >= $${paramIndex++}`);
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      conditions.push(`date <= $${paramIndex++}`);
      params.push(filters.endDate);
    }

    if (filters.search) {
      conditions.push(`(
        LOWER(description) LIKE $${paramIndex} OR
        LOWER(merchant) LIKE $${paramIndex}
      )`);
      params.push(`%${filters.search.trim().toLowerCase()}%`);
      paramIndex++;
    }

    let sql = 'SELECT * FROM transactions';
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY date DESC, created_at DESC';

    if (filters.limit) {
      sql += ` LIMIT $${paramIndex++}`;
      params.push(parseInt(filters.limit, 10));
    }

    if (filters.offset) {
      sql += ` OFFSET $${paramIndex++}`;
      params.push(parseInt(filters.offset, 10));
    }

    const result = await db.query(sql, params);
    return result.rows || result || [];
  }

  /**
   * Find a transaction by ID
   * @param {string} id 
   * @param {string} [userId]
   * @returns {Promise<Object|null>}
   */
  static async findById(id, userId = null) {
    const db = Transaction.getDb();
    let sql = 'SELECT * FROM transactions WHERE id = $1';
    const params = [id];

    if (userId) {
      sql += ' AND user_id = $2';
      params.push(userId);
    }

    const result = await db.query(sql, params);
    const rows = result.rows || result;
    return rows && rows.length > 0 ? rows[0] : null;
  }

  /**
   * Update a transaction by ID
   * @param {string} id 
   * @param {string|null} userId 
   * @param {Object} updateData 
   * @returns {Promise<Object|null>} Updated transaction
   */
  static async update(id, userId = null, updateData = {}) {
    const db = Transaction.getDb();
    const setClauses = [];
    const params = [];
    let paramIndex = 1;

    const allowedFields = ['amount', 'type', 'category', 'description', 'merchant', 'date'];
    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        if (field === 'amount') {
          setClauses.push(`amount = $${paramIndex++}`);
          params.push(parseFloat(updateData.amount));
        } else if (field === 'type') {
          setClauses.push(`type = $${paramIndex++}`);
          params.push(updateData.type.toLowerCase());
        } else if (field === 'description') {
          setClauses.push(`description = $${paramIndex++}`);
          params.push(updateData.description.trim());
        } else {
          setClauses.push(`${field} = $${paramIndex++}`);
          params.push(updateData[field]);
        }
      }
    }

    if (setClauses.length === 0) {
      return Transaction.findById(id, userId);
    }

    setClauses.push('updated_at = CURRENT_TIMESTAMP');

    params.push(id);
    let whereClause = `WHERE id = $${paramIndex++}`;

    if (userId) {
      params.push(userId);
      whereClause += ` AND user_id = $${paramIndex++}`;
    }

    const sql = `
      UPDATE transactions
      SET ${setClauses.join(', ')}
      ${whereClause}
      RETURNING *;
    `;

    const result = await db.query(sql, params);
    const rows = result.rows || result;
    return rows && rows.length > 0 ? rows[0] : null;
  }

  /**
   * Delete a transaction by ID
   * @param {string} id 
   * @param {string|null} userId 
   * @returns {Promise<Object|null>} Deleted transaction
   */
  static async delete(id, userId = null) {
    const db = Transaction.getDb();
    let sql = 'DELETE FROM transactions WHERE id = $1';
    const params = [id];

    if (userId) {
      sql += ' AND user_id = $2';
      params.push(userId);
    }
    sql += ' RETURNING *;';

    const result = await db.query(sql, params);
    const rows = result.rows || result;
    return rows && rows.length > 0 ? rows[0] : null;
  }
}

module.exports = Transaction;
