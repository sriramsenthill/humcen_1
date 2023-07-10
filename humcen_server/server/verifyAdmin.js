const jwt = require('jsonwebtoken');

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.email = decoded.email;
    next();
  } catch (error) {
    console.error('Failed to verify token:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = verifyAdmin;
