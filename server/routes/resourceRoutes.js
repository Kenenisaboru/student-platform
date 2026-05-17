const express = require('express');
const router = express.Router();
const { getResources, uploadResource, deleteResource } = require('../controllers/resourceController');
const { secure } = require('../middleware/authMiddleware');

router.get('/', getResources);
router.post('/', secure, uploadResource);
router.delete('/:id', secure, deleteResource);

module.exports = router;
