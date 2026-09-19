const { getSupabaseClient } = require('../config/db');

async function verifyAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Missing access token' });
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data || !data.user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    req.user = data.user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Authentication failed', details: err.message });
  }
}

module.exports = {
  verifyAuth,
};
