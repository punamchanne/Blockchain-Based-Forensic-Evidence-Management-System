const express = require('express');
const router = express.Router();
const { createCase, getCases, getCaseById, updateCaseStatus } = require('../controllers/caseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createCase).get(protect, getCases);
router.route('/:id').get(protect, getCaseById);
router.route('/:id/status').put(protect, updateCaseStatus);

module.exports = router;
