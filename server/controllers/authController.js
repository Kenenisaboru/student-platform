const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const isEmailConfigured = sendEmail.isEmailConfigured;

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.NODE_ENV === 'production' ? '7d' : '30d',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, university, department } = req.body;

    const emailLower = email.toLowerCase();
    const userExists = await User.findOne({ email: emailLower });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Admin emails from environment variable
    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim().toLowerCase());
    const role = adminEmails.includes(email.toLowerCase()) ? 'admin' : 'student';

    // Bypass email verification
    const shouldAutoVerify = true;
    
    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      university,
      department,
      role,
      isVerified: shouldAutoVerify,
    });

    // Generate verification token only if email is configured and user is not admin
    const verificationToken = shouldAutoVerify ? null : user.createVerificationToken();
    await user.save();

    if (verificationToken) {
      const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
      try {
        await sendEmail({
        to: user.email,
        subject: 'Verify your email - Communication Platform',
        html: `
          <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3b82f6; font-size: 24px;">Communication Platform</h1>
            </div>
            <h2 style="color: #1e293b;">Welcome, ${user.name}! 🎉</h2>
            <p style="color: #475569; line-height: 1.6;">
              Thank you for registering. Please verify your email address by clicking the button below:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; display: inline-block;">
                Verify Email
              </a>
            </div>
            <p style="color: #94a3b8; font-size: 13px;">
              This link expires in 24 hours. If you didn't create an account, please ignore this email.
            </p>
          </div>
        `
      });
      } catch (emailErr) {
        console.error('Email sending failed:', emailErr.message);
      }
    }

    if (user) {
      let message;
      if (role === 'admin') {
        message = 'Admin account created. You can log in now.';
      } else if (!isEmailConfigured()) {
        message = 'Registration successful! You can log in now.';
      } else if (user.isVerified) {
        message = 'Registration successful! You can log in now.';
      } else {
        message = 'Registration successful! Please check your email to verify your account before logging in.';
      }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        department: user.department,
        role: user.role,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
        message,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailLower = email.toLowerCase();
    const user = await User.findOne({ email: emailLower });

    if (user && (await user.comparePassword(password))) {


      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        department: user.department,
        role: user.role,
        isVerified: user.isVerified,
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    res.json({
      message: 'Email verified successfully! You can now fully use the platform.',
      token: generateToken(user._id),
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Resend verification email
exports.resendVerification = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    const verificationToken = user.createVerificationToken();
    await user.save({ validateBeforeSave: false });

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    await sendEmail({
      to: user.email,
      subject: 'Verify your email - Communication Platform',
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <h2 style="color: #1e293b;">Verify Your Email</h2>
          <p style="color: #475569;">Click the button below to verify your email address:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #3b82f6, #6366f1); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; display: inline-block;">
              Verify Email
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 13px;">This link expires in 24 hours.</p>
        </div>
      `
    });

    res.json({ message: 'Verification email sent!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: 'No user found with that email' });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Password Reset - Communication Platform',
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #3b82f6; font-size: 24px;">Communication Platform</h1>
          </div>
          <h2 style="color: #1e293b;">Reset Your Password</h2>
          <p style="color: #475569; line-height: 1.6;">
            You requested a password reset. Click the button below to set a new password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: linear-gradient(135deg, #ef4444, #f97316); color: white; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 13px;">
            This link expires in 1 hour. If you didn't request this, please ignore this email.
          </p>
        </div>
      `
    });

    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    // Clear reset token on error
    if (error) {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save({ validateBeforeSave: false });
      }
    }
    res.status(500).json({ message: 'Error sending email. Please try again later.' });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successful! You can now login with your new password.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
