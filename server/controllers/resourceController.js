const CompanyResource = require('../models/CompanyResource');

// @desc    Get resources (optionally by company)
// @route   GET /api/resources
exports.getResources = async (req, res) => {
  try {
    const { company, type, search } = req.query;
    let query = {};
    if (company) query.company = company;
    if (type) query.type = type;
    if (search) query.title = { $regex: search, $options: 'i' };

    const resources = await CompanyResource.find(query)
      .populate('company', 'name')
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: resources.length, resources });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create resource (admin)
// @route   POST /api/resources
exports.createResource = async (req, res) => {
  try {
    req.body.uploadedBy = req.user._id;
    const resource = await CompanyResource.create(req.body);
    const populated = await resource.populate('company', 'name');
    res.status(201).json({ success: true, resource: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update resource (admin)
// @route   PUT /api/resources/:id
exports.updateResource = async (req, res) => {
  try {
    const resource = await CompanyResource.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('company', 'name');
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.json({ success: true, resource });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete resource (admin)
// @route   DELETE /api/resources/:id
exports.deleteResource = async (req, res) => {
  try {
    const resource = await CompanyResource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
    res.json({ success: true, message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
