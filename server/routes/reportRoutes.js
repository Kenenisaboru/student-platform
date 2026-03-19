const express = require('express');
const router = express.Router();
const { createReport, getReports, updateReportStatus } = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validate, createReportRules, paginationRules } = require('../middleware/validation');

router.post('/', protect, createReportRules, validate, createReport);
router.get('/', protect, admin, paginationRules, validate, getReports);
router.put('/:id', protect, admin, updateReportStatus);

module.exports = router;
