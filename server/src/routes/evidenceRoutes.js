const express = require('express');
const router = express.Router();
const { uploadEvidence, saveEvidence, getEvidenceByCase } = require('../controllers/evidenceController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', protect, upload.single('file'), uploadEvidence);
router.post('/save', protect, saveEvidence);
router.get('/:caseId', protect, getEvidenceByCase);

module.exports = router;
