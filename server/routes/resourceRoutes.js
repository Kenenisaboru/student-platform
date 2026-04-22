const express = require('express');
const router = express.Router();
const { getResources, uploadResource, deleteResource } = require('../controllers/resourceController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getResources);
router.post('/', protect, uploadResource);
router.delete('/:id', protect, deleteResource);

module.exports = router;
