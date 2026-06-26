const express = require('express');
const router = express.Router();
const { applyToJob, getMyApplications, getApplications, updateApplicationStatus } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('student'), applyToJob);
router.get('/my', protect, getMyApplications);
router.get('/', protect, authorize('admin'), getApplications);
router.put('/:id/status', protect, authorize('admin'), updateApplicationStatus);

module.exports = router;
