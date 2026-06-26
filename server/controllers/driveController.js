const PlacementDrive = require('../models/PlacementDrive');

// @desc    Get all drives
// @route   GET /api/drives
exports.getDrives = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};
    if (status) query.status = status;
    if (search) query.title = { $regex: search, $options: 'i' };
    const drives = await PlacementDrive.find(query)
      .populate('company', 'name industry website')
      .populate('createdBy', 'name')
      .sort({ driveDate: -1 });
    res.json({ success: true, count: drives.length, drives });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single drive
// @route   GET /api/drives/:id
exports.getDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.findById(req.params.id)
      .populate('company', 'name industry website description techStack avgPackage')
      .populate('createdBy', 'name');
    if (!drive) return res.status(404).json({ success: false, message: 'Drive not found' });
    res.json({ success: true, drive });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create drive (admin)
// @route   POST /api/drives
exports.createDrive = async (req, res) => {
  try {
    req.body.createdBy = req.user._id;
    const drive = await PlacementDrive.create(req.body);
    const populated = await drive.populate('company', 'name industry website');
    res.status(201).json({ success: true, drive: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update drive (admin)
// @route   PUT /api/drives/:id
exports.updateDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('company', 'name industry website');
    if (!drive) return res.status(404).json({ success: false, message: 'Drive not found' });
    res.json({ success: true, drive });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete drive (admin)
// @route   DELETE /api/drives/:id
exports.deleteDrive = async (req, res) => {
  try {
    const drive = await PlacementDrive.findByIdAndDelete(req.params.id);
    if (!drive) return res.status(404).json({ success: false, message: 'Drive not found' });
    res.json({ success: true, message: 'Drive deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
