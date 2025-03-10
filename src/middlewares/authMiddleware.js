const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: false, error: { message: 'NOT_AUTHORIZED' } });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ status: false, error: { message: 'NOT_AUTHORIZED' } });
  }
};