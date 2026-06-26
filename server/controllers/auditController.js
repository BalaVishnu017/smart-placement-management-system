const AuditLog = require('../models/AuditLog');

// @desc    Get all audit logs (admin only)
// @route   GET /api/logs
exports.getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('user', 'name email role')
      .sort({ timestamp: -1 })
      .limit(200);
    res.json({ success: true, count: logs.length, logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Helper function to log activities
exports.logActivity = async (userId, userName, action, details, ip) => {
  try {
    await AuditLog.create({
      user: userId,
      userName,
      action,
      details,
      ipAddress: ip || '127.0.0.1'
    });
  } catch (error) {
    console.error('Audit Logging Error:', error.message);
  }
};
