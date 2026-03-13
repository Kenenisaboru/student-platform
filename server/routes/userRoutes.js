const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  updateProfile, 
  searchUsers, 
  getAllUsers,
  deleteUser
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/search', protect, searchUsers);
router.get('/all', protect, admin, getAllUsers);
router.get('/:id', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
