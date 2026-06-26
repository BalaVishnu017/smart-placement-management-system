const express = require('express');
const router = express.Router();
const { uploadResume, getResume, downloadResume, deleteResume } = require('../controllers/resumeController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', protect, authorize('student'), upload.single('resume'), uploadResume);
router.get('/:studentId', protect, getResume);
router.get('/:studentId/download', protect, downloadResume);
router.delete('/', protect, authorize('student'), deleteResume);

module.exports = router;
