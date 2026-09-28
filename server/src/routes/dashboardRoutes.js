const express = require('express');
const router = express.Router();
const { getDashboardStats, getAdminHistory } = require('../controllers/dashboardController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

router.get('/stats', protect, superAdmin, getDashboardStats);
router.get('/history', protect, getAdminHistory);

module.exports = router;
