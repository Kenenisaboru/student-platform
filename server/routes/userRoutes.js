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
const { protect, admin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const { validate, updateProfileRules, searchRules, paginationRules } = require('../middleware/validation');

// Public routes (auth-protected but not admin)
router.get('/active', protect, getActiveUsers);
router.get('/search', protect, searchRules, paginationRules, validate, searchUsers);
router.get('/saved', protect, getSavedPosts);
router.get('/leaderboard', protect, getDepartmentLeaderboard);

// Follow/Unfollow & Saved Posts
router.post('/:id/follow', protect, followUser);
router.post('/save/:postId', protect, toggleSavePost);

// Admin only
router.get('/all', protect, admin, paginationRules, validate, getAllUsers);

// User profile
router.get('/:id', protect, getProfile);
router.put('/profile', protect, updateProfileRules, validate, updateProfile);
router.post('/upload-profile', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ url: req.file.path });
});
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
