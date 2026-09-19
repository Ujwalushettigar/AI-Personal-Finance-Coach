const { getSupabaseClient } = require('../config/db');

async function verifyAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'No token provided. Please log in first.',
      });
    }

    const token = authHeader.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        error: 'No token provided. Please log in first.',
      });
    }

    const supabase = getSupabaseClient(token);

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data || !data.user) {
      return res.status(401).json({
        error: 'Invalid or expired token',
      });
    }

    req.user = data.user;
    req.authToken = token;

    return next();
  } catch (err) {
    console.error('Authentication error:', err);

    return res.status(401).json({
      error: 'Invalid or expired token',
    });
  }
}

module.exports = {
  verifyAuth,
};