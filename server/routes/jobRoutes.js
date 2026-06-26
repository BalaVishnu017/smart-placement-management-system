const express = require('express');
const router = express.Router();
const { getJobs, getJob, createJob, updateJob, deleteJob, checkEligibility } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getJobs);
router.get('/:id', protect, getJob);
router.get('/:id/eligibility', protect, checkEligibility);
router.post('/', protect, authorize('admin'), createJob);
router.put('/:id', protect, authorize('admin'), updateJob);
router.delete('/:id', protect, authorize('admin'), deleteJob);

module.exports = router;
