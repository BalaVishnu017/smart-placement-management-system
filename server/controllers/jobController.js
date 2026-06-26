const Job = require('../models/Job');
const User = require('../models/User');
const Application = require('../models/Application');

// @desc    Get all jobs
// @route   GET /api/jobs
exports.getJobs = async (req, res) => {
  try {
    const { status, type, branch, drive, search } = req.query;
    let query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (drive) query.drive = drive;
    if (search) query.title = { $regex: search, $options: 'i' };
    if (branch) query['eligibility.branches'] = branch;

    const jobs = await Job.find(query)
      .populate('company', 'name industry website')
      .populate('drive', 'title driveDate status')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('company', 'name industry website description techStack avgPackage headquarters')
      .populate('drive', 'title driveDate status venue instructions');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create job (admin)
// @route   POST /api/jobs
exports.createJob = async (req, res) => {
  try {
    req.body.createdBy = req.user._id;
    const job = await Job.create(req.body);
    const populated = await job.populate('company', 'name industry website');
    res.status(201).json({ success: true, job: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update job (admin)
// @route   PUT /api/jobs/:id
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('company', 'name industry website');
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete job (admin)
// @route   DELETE /api/jobs/:id
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Check eligibility for a job
// @route   GET /api/jobs/:id/eligibility
exports.checkEligibility = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

    const student = await User.findById(req.user._id);
    if (!student || student.role !== 'student') {
      return res.status(400).json({ success: false, message: 'Only students can check eligibility' });
    }

    const reasons = [];
    let eligible = true;

    // Check branch
    if (job.eligibility.branches && job.eligibility.branches.length > 0) {
      if (!job.eligibility.branches.includes(student.branch)) {
        eligible = false;
        reasons.push(`Branch ${student.branch} is not eligible. Required: ${job.eligibility.branches.join(', ')}`);
      }
    }
    // Check CGPA
    if (job.eligibility.minCGPA && student.cgpa < job.eligibility.minCGPA) {
      eligible = false;
      reasons.push(`CGPA ${student.cgpa} is below minimum ${job.eligibility.minCGPA}`);
    }
    // Check backlogs
    if (job.eligibility.maxBacklogs !== undefined && student.backlogs > job.eligibility.maxBacklogs) {
      eligible = false;
      reasons.push(`${student.backlogs} backlogs exceeds maximum ${job.eligibility.maxBacklogs}`);
    }
    // Check graduation year
    if (job.eligibility.graduationYears && job.eligibility.graduationYears.length > 0) {
      if (!job.eligibility.graduationYears.includes(student.graduationYear)) {
        eligible = false;
        reasons.push(`Graduation year ${student.graduationYear} not eligible. Required: ${job.eligibility.graduationYears.join(', ')}`);
      }
    }
    // Check if already placed
    if (student.isPlaced) {
      eligible = false;
      reasons.push('Already placed in another company');
    }
    // Check deadline
    if (job.deadline && new Date(job.deadline) < new Date()) {
      eligible = false;
      reasons.push('Application deadline has passed');
    }
    // Check if already applied
    const existingApp = await Application.findOne({ student: student._id, job: job._id });
    const alreadyApplied = !!existingApp;

    res.json({ success: true, eligible, reasons, alreadyApplied });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
