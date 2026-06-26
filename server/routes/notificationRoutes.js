const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllRead, sendNotification } = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', protect, getNotifications);
router.put('/read-all', protect, markAllRead);
router.put('/:id/read', protect, markAsRead);
router.post('/', protect, authorize('admin'), sendNotification);

module.exports = router;
