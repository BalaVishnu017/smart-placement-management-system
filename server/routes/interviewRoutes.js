const express = require('express');
const router = express.Router();
const { getMyInterviews, getInterviews, createInterview, updateInterview, deleteInterview } = require('../controllers/interviewController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my', protect, getMyInterviews);
router.get('/', protect, authorize('admin'), getInterviews);
router.post('/', protect, authorize('admin'), createInterview);
router.put('/:id', protect, authorize('admin'), updateInterview);
router.delete('/:id', protect, authorize('admin'), deleteInterview);

module.exports = router;
