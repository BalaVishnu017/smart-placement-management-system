const Interview = require('../models/Interview');
const Notification = require('../models/Notification');

// @desc    Get interviews for student
// @route   GET /api/interviews/my
exports.getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ student: req.user._id })
      .populate({ path: 'job', populate: { path: 'company', select: 'name' } })
      .populate('drive', 'title')
      .sort({ date: 1 });
    res.json({ success: true, count: interviews.length, interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all interviews (admin)
// @route   GET /api/interviews
exports.getInterviews = async (req, res) => {
  try {
    const { job, drive, status } = req.query;
    let query = {};
    if (job) query.job = job;
    if (drive) query.drive = drive;
    if (status) query.status = status;

    const interviews = await Interview.find(query)
      .populate('student', 'name email rollNo branch')
      .populate({ path: 'job', populate: { path: 'company', select: 'name' } })
      .populate('drive', 'title')
      .sort({ date: 1 });
    res.json({ success: true, count: interviews.length, interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Schedule interview (admin)
// @route   POST /api/interviews
exports.createInterview = async (req, res) => {
  try {
    req.body.scheduledBy = req.user._id;
    const interview = await Interview.create(req.body);

    // Notify student
    await Notification.create({
      recipient: interview.student,
      title: 'Interview Scheduled',
      message: `Interview scheduled on ${new Date(interview.date).toLocaleDateString()} at ${interview.time}`,
      type: 'interview'
    });

    const populated = await interview.populate([
      { path: 'student', select: 'name email rollNo branch' },
      { path: 'job', populate: { path: 'company', select: 'name' } }
    ]);
    res.status(201).json({ success: true, interview: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update interview (admin)
// @route   PUT /api/interviews/:id
exports.updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('student', 'name email rollNo branch')
      .populate({ path: 'job', populate: { path: 'company', select: 'name' } });
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    res.json({ success: true, interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete interview (admin)
// @route   DELETE /api/interviews/:id
exports.deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    res.json({ success: true, message: 'Interview deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
