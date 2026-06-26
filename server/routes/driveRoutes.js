const express = require('express');
const router = express.Router();
const { getDrives, getDrive, createDrive, updateDrive, deleteDrive } = require('../controllers/driveController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getDrives);
router.get('/:id', protect, getDrive);
router.post('/', protect, authorize('admin'), createDrive);
router.put('/:id', protect, authorize('admin'), updateDrive);
router.delete('/:id', protect, authorize('admin'), deleteDrive);

module.exports = router;
