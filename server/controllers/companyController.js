const Company = require('../models/Company');

// @desc    Get all companies
// @route   GET /api/companies
exports.getCompanies = async (req, res) => {
  try {
    const { search, industry } = req.query;
    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (industry) query.industry = industry;
    const companies = await Company.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: companies.length, companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    res.json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create company (admin)
// @route   POST /api/companies
exports.createCompany = async (req, res) => {
  try {
    req.body.addedBy = req.user._id;
    const company = await Company.create(req.body);
    res.status(201).json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update company (admin)
// @route   PUT /api/companies/:id
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    res.json({ success: true, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete company (admin)
// @route   DELETE /api/companies/:id
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: 'Company not found' });
    res.json({ success: true, message: 'Company deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
