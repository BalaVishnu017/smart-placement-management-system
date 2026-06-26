const Resume = require('../models/Resume');
const path = require('path');
const fs = require('fs');

// @desc    Upload resume (student)
// @route   POST /api/resumes/upload
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file (PDF or DOCX)' });
    }

    // Delete old resume if exists
    const oldResume = await Resume.findOne({ student: req.user._id });
    if (oldResume) {
      const oldPath = path.join(__dirname, '..', oldResume.filePath);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      await Resume.findByIdAndDelete(oldResume._id);
    }

    const resume = await Resume.create({
      student: req.user._id,
      fileName: req.file.originalname,
      filePath: `uploads/${req.file.filename}`,
      fileType: req.file.mimetype,
      fileSize: req.file.size
    });

    res.status(201).json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student's resume
// @route   GET /api/resumes/:studentId
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ student: req.params.studentId });
    if (!resume) return res.status(404).json({ success: false, message: 'No resume found' });
    res.json({ success: true, resume });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Download resume file
// @route   GET /api/resumes/:studentId/download
exports.downloadResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ student: req.params.studentId });
    if (!resume) return res.status(404).json({ success: false, message: 'No resume found' });
    const filePath = path.join(__dirname, '..', resume.filePath);
    if (!fs.existsSync(filePath)) return res.status(404).json({ success: false, message: 'File not found on server' });
    res.download(filePath, resume.fileName);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete resume (student)
// @route   DELETE /api/resumes
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ student: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'No resume found' });
    const filePath = path.join(__dirname, '..', resume.filePath);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await Resume.findByIdAndDelete(resume._id);
    res.json({ success: true, message: 'Resume deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
