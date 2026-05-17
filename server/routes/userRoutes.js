const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  updateProfile, 
  searchUsers, 
  getAllUsers,
  getActiveUsers,
  followUser,
  deleteUser,
  getSavedPosts,
  toggleSavePost,
  getDepartmentLeaderboard
} = require('../controllers/userController');
const { secure, protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const { validate, updateProfileRules, searchRules, paginationRules } = require('../middleware/validation');

// Public routes (auth-protected but not admin)
router.get('/active', secure, getActiveUsers);
router.get('/search', secure, searchRules, paginationRules, validate, searchUsers);
router.get('/saved', secure, getSavedPosts);
router.get('/leaderboard', secure, getDepartmentLeaderboard);

// Follow/Unfollow & Saved Posts
router.post('/:id/follow', secure, followUser);
router.post('/save/:postId', secure, toggleSavePost);

// Admin only
router.get('/all', protect, admin, paginationRules, validate, getAllUsers);

// User profile
router.get('/:id', secure, getProfile);
router.put('/profile', secure, updateProfileRules, validate, updateProfile);
router.post('/upload-profile', secure, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ url: req.file.path });
});
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
