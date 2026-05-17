const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { isEmailConfigured } = require('../utils/sendEmail');

async function socketAuth(socket, next) {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('_id isVerified role');

    if (!user) {
      return next(new Error('User not found'));
    }

    if (isEmailConfigured() && user.role !== 'admin' && !user.isVerified) {
      return next(new Error('Email not verified'));
    }

    socket.userId = user._id.toString();
    next();
  } catch {
    next(new Error('Invalid token'));
  }
}

module.exports = socketAuth;
