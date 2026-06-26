const jwt = require('jsonwebtoken');
const User = require('../models/User');
const SystemConfig = require('../models/SystemConfig');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Register a student
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, rollNo, branch, department, cgpa, tenthPercent, twelfthPercent, backlogs, phone, skills } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Retrieve active graduation year to enforce 4th year batch only
    let config = await SystemConfig.findOne();
    if (!config) {
      config = await SystemConfig.create({ activeGraduationYear: 2026 });
    }

    const user = await User.create({
      name, email, password, role: 'student',
      rollNo, branch, department, graduationYear: config.activeGraduationYear,
      cgpa, tenthPercent, twelfthPercent, backlogs, phone,
      skills: skills || []
    });

    const token = generateToken(user._id);
    res.status(201).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, branch: user.branch }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user (student or admin)
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.isArchived) {
      return res.status(403).json({ success: false, message: 'Your account has been archived (graduated batch). Access denied.' });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, branch: user.branch }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update password (when logged in)
// @route   PUT /api/auth/update-password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Find user (we need the password field which is normally excluded)
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Incorrect current password' });
    }
    
    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();
    
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot password / recovery (public)
// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email, rollNo, phone, masterKey, newPassword } = req.body;
    
    let user;
    if (rollNo && phone) {
      // Student recovery by matching Email + Roll Number + Phone
      user = await User.findOne({ email, rollNo, phone, role: 'student' });
    } else if (masterKey) {
      // Admin recovery by matching Email + JWT Secret Key/Master Key
      if (masterKey !== process.env.JWT_SECRET) {
        return res.status(400).json({ success: false, message: 'Invalid Admin master recovery key' });
      }
      user = await User.findOne({ email, role: 'admin' });
    }
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Verification details do not match any registered user.' });
    }
    
    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    await user.save();
    
    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
