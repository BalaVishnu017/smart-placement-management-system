const User = require('../models/User');
const SystemConfig = require('../models/SystemConfig');
const Resume = require('../models/Resume');
const Application = require('../models/Application');
const Interview = require('../models/Interview');
const Notification = require('../models/Notification');
const fs = require('fs');
const path = require('path');
const { logActivity } = require('./auditController');

// @desc    Get all students (admin only)
// @route   GET /api/students
exports.getStudents = async (req, res) => {
  try {
    const { branch, search, placed } = req.query;
    let query = { role: 'student' };
    if (branch) query.branch = branch;
    if (placed === 'true') query.isPlaced = true;
    if (placed === 'false') query.isPlaced = false;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } }
      ];
    }
    const students = await User.find(query).sort({ createdAt: -1 }).lean();
    
    // Fetch resumes for these students
    const studentIds = students.map(s => s._id);
    const resumes = await Resume.find({ student: { $in: studentIds } });
    const resumeMap = {};
    resumes.forEach(r => {
      resumeMap[r.student.toString()] = r;
    });

    const studentsWithResumes = students.map(s => ({
      ...s,
      hasResume: !!resumeMap[s._id.toString()],
      resumeFile: resumeMap[s._id.toString()] ? resumeMap[s._id.toString()].fileName : null
    }));

    res.json({ success: true, count: studentsWithResumes.length, students: studentsWithResumes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
exports.getStudent = async (req, res) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update student profile
// @route   PUT /api/students/:id
exports.updateStudent = async (req, res) => {
  try {
    // Students can only update their own profile
    if (req.user.role === 'student' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const allowedFields = [
      'name', 'phone', 'skills', 'cgpa', 'tenthPercent', 'twelfthPercent', 
      'backlogs', 'branch', 'department', 'graduationYear', 'rollNo',
      'isPlaced', 'placedCompany', 'placedPackage'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const oldStudent = await User.findById(req.params.id);
    if (!oldStudent) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const student = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    // Log the change
    if (oldStudent.isPlaced !== student.isPlaced || oldStudent.placedCompany !== student.placedCompany || oldStudent.placedPackage !== student.placedPackage) {
      await logActivity(
        req.user._id,
        req.user.name,
        'Update Placement Status',
        `Updated student ${student.name} (${student.rollNo || student.email}) placement status to: ${student.isPlaced ? `Placed at ${student.placedCompany} (${student.placedPackage} LPA)` : 'Not Placed'}.`,
        req.ip
      );
    } else {
      await logActivity(
        req.user._id,
        req.user.name,
        'Update Student Profile',
        `Updated profile details for student ${student.name} (${student.rollNo || student.email}).`,
        req.ip
      );
    }

    res.json({ success: true, student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get system configurations
// @route   GET /api/students/config
exports.getSystemConfig = async (req, res) => {
  try {
    let config = await SystemConfig.findOne();
    if (!config) {
      config = await SystemConfig.create({ activeGraduationYear: 2026 });
    }
    res.json({ success: true, activeGraduationYear: config.activeGraduationYear });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update system configurations
// @route   PUT /api/students/config
exports.updateSystemConfig = async (req, res) => {
  try {
    const { activeGraduationYear } = req.body;
    let config = await SystemConfig.findOne();
    if (!config) {
      config = new SystemConfig();
    }
    config.activeGraduationYear = Number(activeGraduationYear);
    await config.save();
    res.json({ success: true, activeGraduationYear: config.activeGraduationYear });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset batch (delete older students and increment academic year)
// @route   POST /api/students/reset-batch
exports.resetBatch = async (req, res) => {
  try {
    let config = await SystemConfig.findOne();
    if (!config) {
      config = await SystemConfig.create({ activeGraduationYear: 2026 });
    }
    
    const targetYear = config.activeGraduationYear;

    // 1. Find all students of the active graduation year or older
    const students = await User.find({ 
      role: 'student', 
      graduationYear: { $lte: targetYear } 
    });
    
    const placedStudents = students.filter(s => s.isPlaced);
    const unplacedStudents = students.filter(s => !s.isPlaced);
    
    const placedStudentIds = placedStudents.map(s => s._id);
    const unplacedStudentIds = unplacedStudents.map(s => s._id);

    // 2. Delete resumes of unplaced students and unlink files (keep placed ones)
    const resumesToDelete = await Resume.find({ student: { $in: unplacedStudentIds } });
    for (const resume of resumesToDelete) {
      const filePath = path.join(__dirname, '..', resume.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      await Resume.findByIdAndDelete(resume._id);
    }

    // 3. Delete applications & interviews for all graduating students to free space
    const allIds = [...placedStudentIds, ...unplacedStudentIds];
    await Application.deleteMany({ student: { $in: allIds } });
    await Interview.deleteMany({ student: { $in: allIds } });
    await Notification.deleteMany({ recipient: { $in: allIds } });

    // 4. Permanently delete unplaced student accounts
    await User.deleteMany({ _id: { $in: unplacedStudentIds } });

    // 5. Archive placed student accounts (disable login, mark isArchived: true)
    await User.updateMany(
      { _id: { $in: placedStudentIds } },
      { $set: { isArchived: true } }
    );

    // 6. Increment active graduation year in config
    config.activeGraduationYear = targetYear + 1;
    await config.save();

    // 7. Log this transition action
    await logActivity(
      req.user._id,
      req.user.name,
      'Academic Year Transition',
      `Advanced active batch from ${targetYear} to ${config.activeGraduationYear}. Deleted ${unplacedStudentIds.length} unplaced students and archived ${placedStudentIds.length} placed students.`,
      req.ip
    );

    res.json({ 
      success: true, 
      message: `Successfully processed batch of ${targetYear}. Placed students archived for statistics. Unplaced students deleted. Active batch advanced to ${config.activeGraduationYear}.`,
      deletedCount: unplacedStudentIds.length,
      archivedCount: placedStudentIds.length,
      activeGraduationYear: config.activeGraduationYear
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
