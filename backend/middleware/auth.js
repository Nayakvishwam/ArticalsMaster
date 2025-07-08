const jwt = require('jsonwebtoken');
const { models } = require('../config/dbConnection');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required', status: 'error' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await models.users.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token', status: 'error' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token', status: 'error' });
  }
};

module.exports = { authenticateToken };