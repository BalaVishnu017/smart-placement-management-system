const User = require('../models/User');
const Company = require('../models/Company');
const PlacementDrive = require('../models/PlacementDrive');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get dashboard statistics (admin)
// @route   GET /api/stats/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalCompanies = await Company.countDocuments();
    const totalDrives = await PlacementDrive.countDocuments();
    const activeDrives = await PlacementDrive.countDocuments({ status: { $in: ['upcoming', 'ongoing'] } });
    const totalJobs = await Job.countDocuments();
    const openJobs = await Job.countDocuments({ status: 'open' });
    const totalApplications = await Application.countDocuments();
    const studentsPlaced = await User.countDocuments({ role: 'student', isPlaced: true });

    // Placement percentage
    const placementPercent = totalStudents > 0 ? ((studentsPlaced / totalStudents) * 100).toFixed(1) : 0;

    // Highest and average package
    const packageStats = await User.aggregate([
      { $match: { role: 'student', isPlaced: true, placedPackage: { $exists: true, $gt: 0 } } },
      { $group: { _id: null, highest: { $max: '$placedPackage' }, average: { $avg: '$placedPackage' }, total: { $sum: 1 } } }
    ]);
    const highestPackage = packageStats.length ? packageStats[0].highest : 0;
    const averagePackage = packageStats.length ? Math.round(packageStats[0].average * 100) / 100 : 0;

    // Branch-wise placement
    const branchWise = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: {
        _id: '$branch',
        total: { $sum: 1 },
        placed: { $sum: { $cond: ['$isPlaced', 1, 0] } }
      }},
      { $sort: { _id: 1 } }
    ]);

    // Company-wise placements
    const companyWise = await User.aggregate([
      { $match: { role: 'student', isPlaced: true, placedCompany: { $exists: true } } },
      { $group: { _id: '$placedCompany', count: { $sum: 1 }, avgPackage: { $avg: '$placedPackage' } } },
      { $sort: { count: -1 } }
    ]);

    // Recent applications
    const recentApplications = await Application.find()
      .populate('student', 'name branch')
      .populate({ path: 'job', populate: { path: 'company', select: 'name' } })
      .sort({ appliedAt: -1 })
      .limit(10);

    res.json({
      success: true,
      stats: {
        totalStudents, totalCompanies, totalDrives, activeDrives,
        totalJobs, openJobs, totalApplications, studentsPlaced,
        placementPercent, highestPackage, averagePackage,
        branchWise, companyWise, recentApplications
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
