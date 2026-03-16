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
const { upload } = require('../config/cloudinary');

router.get('/search', protect, searchUsers);
router.get('/all', protect, admin, getAllUsers);
router.get('/:id', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/upload-profile', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ url: req.file.path });
});
router.delete('/:id', protect, admin, deleteUser);

module.exports = router;
