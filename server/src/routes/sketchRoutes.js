const express = require('express');
const router = express.Router();
const { generateSketch } = require('../controllers/sketchController');
const { protect } = require('../middleware/authMiddleware');
const { roleCheck } = require('../middleware/roleMiddleware');

// @route   POST /api/sketch/generate
// @desc    Generate a forensic sketch (Admin only)
// @access  Private (Admin)
router.post('/generate', protect, roleCheck(['admin']), generateSketch);

module.exports = router;
