const express = require('express');
const router = express.Router();
const { verifyFace, enrollFace } = require('../controllers/faceAuthController');
const { protect, superAdmin } = require('../middleware/authMiddleware');

router.post('/verify', verifyFace);
router.post('/enroll', protect, superAdmin, enrollFace); // Only Super Admin can enroll themselves

module.exports = router;
