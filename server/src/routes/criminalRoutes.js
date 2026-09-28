const express = require('express');
const router = express.Router();
const { createCriminal, matchSketch, getCriminals, matchAttributes, getCriminalById } = require('../controllers/criminalController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, createCriminal);
router.post('/match', protect, admin, matchSketch);
router.post('/match-attributes', protect, admin, matchAttributes);
router.get('/', protect, getCriminals);
router.get('/:id', protect, getCriminalById);

module.exports = router;
