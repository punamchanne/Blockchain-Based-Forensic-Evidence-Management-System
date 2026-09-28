const express = require('express');
const router = express.Router();
const { loginUser, registerAdmin, seedSuperAdmin, getAdmins, checkSetupStatus, setupSuperAdmin } = require('../controllers/authController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.post('/register-admin', protect, superAdmin, registerAdmin);
router.get('/admins', protect, superAdmin, getAdmins);
router.post('/seed-super-admin', seedSuperAdmin);

// First-Time Setup Routes
router.get('/setup-status', checkSetupStatus);
router.post('/setup', setupSuperAdmin);

module.exports = router;
