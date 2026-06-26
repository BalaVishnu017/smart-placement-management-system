const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const Notification = require('../models/Notification');
const Resume = require('../models/Resume');

// @desc    Apply to a job (student)
// @route   POST /api/applications
exports.applyToJob = async (req, res) => {
  try {
    const { jobId, driveId } = req.body;
    const studentId = req.user._id;

    // Check if already applied
    const existing = await Application.findOne({ student: studentId, job: jobId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already applied to this job' });
    }

    // Get job for eligibility check
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    if (job.status === 'closed') return res.status(400).json({ success: false, message: 'Job is closed' });

    const student = await User.findById(studentId);

    // Quick eligibility check
    if (student.isPlaced) {
      return res.status(400).json({ success: false, message: 'Already placed' });
    }
    if (job.eligibility.branches?.length && !job.eligibility.branches.includes(student.branch)) {
      return res.status(400).json({ success: false, message: 'Branch not eligible' });
    }
    if (job.eligibility.minCGPA && student.cgpa < job.eligibility.minCGPA) {
      return res.status(400).json({ success: false, message: 'CGPA below minimum requirement' });
    }

    const application = await Application.create({
      student: studentId,
      job: jobId,
      drive: driveId || job.drive,
      status: 'applied'
    });

    // Send notification to student
    await Notification.create({
      recipient: studentId,
      title: 'Application Submitted',
      message: `You have successfully applied for ${job.title}`,
      type: 'info'
    });

    res.status(201).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student's applications
// @route   GET /api/applications/my
// @desc    Get student's applications
// @route   GET /api/applications/my
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id })
      .populate({ path: 'job', populate: { path: 'company', select: 'name' } })
      .populate('drive', 'title')
      .sort({ appliedAt: -1 });
    res.json({ success: true, count: applications.length, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all applications (admin)
// @route   GET /api/applications
exports.getApplications = async (req, res) => {
  try {
    const { job, drive, status } = req.query;
    let query = {};
    if (job) query.job = job;
    if (drive) query.drive = drive;
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate('student', 'name email rollNo branch cgpa phone')
      .populate({ path: 'job', populate: { path: 'company', select: 'name' } })
      .populate('drive', 'title')
      .sort({ appliedAt: -1 })
      .lean();

    // Fetch resumes for these students
    const studentIds = applications.map(a => a.student?._id).filter(Boolean);
    const resumes = await Resume.find({ student: { $in: studentIds } });
    const resumeMap = {};
    resumes.forEach(r => {
      resumeMap[r.student.toString()] = r;
    });

    const applicationsWithResumes = applications.map(a => {
      if (a.student) {
        a.student.hasResume = !!resumeMap[a.student._id.toString()];
        a.student.resumeFile = resumeMap[a.student._id.toString()] ? resumeMap[a.student._id.toString()].fileName : null;
      }
      return a;
    });

    res.json({ success: true, count: applicationsWithResumes.length, applications: applicationsWithResumes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update application status (admin)
// @route   PUT /api/applications/:id/status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    application.status = status;
    if (remarks) application.remarks = remarks;
    application.updatedAt = Date.now();
    await application.save();

    // If selected, update student placement status
    if (status === 'selected') {
      const job = await Job.findById(application.job).populate('company', 'name');
      await User.findByIdAndUpdate(application.student, {
        isPlaced: true,
        placedCompany: job.company.name,
        placedPackage: job.packageLPA
      });
    }

    // Send notification to student
    const statusMessages = {
      shortlisted: 'Congratulations! You have been shortlisted',
      interview: 'You have been scheduled for an interview',
      selected: 'Congratulations! You have been selected!',
      rejected: 'Unfortunately, your application was not selected'
    };
    if (statusMessages[status]) {
      await Notification.create({
        recipient: application.student,
        title: `Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: statusMessages[status],
        type: status === 'selected' ? 'success' : status === 'rejected' ? 'warning' : 'info'
      });
    }

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
