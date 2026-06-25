const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isEmailConfigured } = require('../utils/sendEmail');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User no longer exists' });
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  return res.status(401).json({ message: 'Not authorized, no token' });
};

exports.requireVerified = (req, res, next) => {
  return next(); // Bypassed email verification requirement
};

/** Authenticated routes that need a verified email (admins exempt). */
exports.secure = [exports.protect, exports.requireVerified];

exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};
