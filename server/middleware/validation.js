const { body, param, query, validationResult } = require('express-validator');

// Middleware to check validation results
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: errors.array()[0].msg,
      errors: errors.array() 
    });
  }
  next();
};

// Auth validations
const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('university').trim().notEmpty().withMessage('University is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Post validations
const createPostRules = [
  body('title').trim().notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  body('content').trim().notEmpty().withMessage('Content is required')
    .isLength({ min: 10, max: 10000 }).withMessage('Content must be 10-10,000 characters'),
  body('tags').optional().isArray({ max: 10 }).withMessage('Maximum 10 tags allowed'),
];

const updatePostRules = [
  body('title').optional().trim()
    .isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  body('content').optional().trim()
    .isLength({ min: 10, max: 10000 }).withMessage('Content must be 10-10,000 characters'),
  body('tags').optional().isArray({ max: 10 }).withMessage('Maximum 10 tags allowed'),
];

// Comment validations
const createCommentRules = [
  body('content').trim().notEmpty().withMessage('Comment content is required')
    .isLength({ min: 1, max: 2000 }).withMessage('Comment must be 1-2,000 characters'),
  body('parentComment').optional().isMongoId().withMessage('Invalid parent comment ID'),
];

// Message validations
const sendMessageRules = [
  body('content').trim().notEmpty().withMessage('Message cannot be empty')
    .isLength({ max: 5000 }).withMessage('Message must be under 5,000 characters'),
];

// Profile validations
const updateProfileRules = [
  body('name').optional().trim()
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('bio').optional().trim()
    .isLength({ max: 500 }).withMessage('Bio must be under 500 characters'),
  body('university').optional().trim()
    .isLength({ max: 100 }).withMessage('University name too long'),
  body('department').optional().trim()
    .isLength({ max: 100 }).withMessage('Department name too long'),
  body('password').optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Password reset validations
const forgotPasswordRules = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
];

const resetPasswordRules = [
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/\d/).withMessage('Password must contain at least one number'),
];

// Report validations
const createReportRules = [
  body('reason').trim().notEmpty().withMessage('Reason is required')
    .isIn(['spam', 'harassment', 'inappropriate', 'misinformation', 'other'])
    .withMessage('Invalid report reason'),
  body('description').optional().trim()
    .isLength({ max: 500 }).withMessage('Description must be under 500 characters'),
  body('targetType').trim().notEmpty()
    .isIn(['post', 'comment', 'user']).withMessage('Invalid target type'),
  body('targetId').isMongoId().withMessage('Invalid target ID'),
];

// Poll validations
const createPollRules = [
  body('poll.question').optional().trim()
    .isLength({ min: 5, max: 200 }).withMessage('Poll question must be 5-200 characters'),
  body('poll.options').optional().isArray({ min: 2, max: 6 })
    .withMessage('Poll must have 2-6 options'),
];

// Search validation
const searchRules = [
  query('search').optional().trim()
    .isLength({ max: 100 }).withMessage('Search query too long'),
];

// Pagination validation
const paginationRules = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be 1-50'),
];

module.exports = {
  validate,
  registerRules,
  loginRules,
  createPostRules,
  updatePostRules,
  createCommentRules,
  sendMessageRules,
  updateProfileRules,
  forgotPasswordRules,
  resetPasswordRules,
  createReportRules,
  createPollRules,
  searchRules,
  paginationRules,
};
