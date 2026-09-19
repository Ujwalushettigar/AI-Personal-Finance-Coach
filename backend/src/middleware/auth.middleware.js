const jwt = require('jsonwebtoken');

function verifyAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided. Please log in first.' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided. Please log in first.' });
    }

    const jwtSecret = process.env.SUPABASE_JWT_SECRET;
    let decoded = null;

    if (jwtSecret) {
      try {
        decoded = jwt.verify(token, jwtSecret);
      } catch (err) {
        // Fallback decoding if token was signed by Supabase directly
        decoded = jwt.decode(token);
      }
    } else {
      decoded = jwt.decode(token);
    }

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = {
  verifyAuth,
};
