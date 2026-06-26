const express = require('express');
const router = express.Router();
const { 
  getStudents, 
  getStudent, 
  updateStudent,
  getSystemConfig,
  updateSystemConfig,
  resetBatch
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

// Public route to fetch graduation year configuration for registration
router.get('/config', getSystemConfig);

// Admin-only system configurations and batch resets
router.put('/config', protect, authorize('admin'), updateSystemConfig);
router.post('/reset-batch', protect, authorize('admin'), resetBatch);

router.get('/', protect, authorize('admin'), getStudents);
router.get('/:id', protect, getStudent);
router.put('/:id', protect, updateStudent);

module.exports = router;
