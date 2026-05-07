const Drive = require('../models/Drive.model');
const Application = require('../models/Application.model');
const Student = require('../models/Student.model');
const Notification = require('../models/Notification.model');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Get TPO dashboard statistics
 */
exports.getTPODashboard = async (req, res, next) => {
  try {
    const activeDrives = await Drive.countDocuments({ status: 'active' });
    const totalApplicants = await Application.countDocuments({ isActive: true });
    
    const shortlistedCount = await Application.countDocuments({ 
      status: { $in: ['shortlisted', 'forwarded_to_tpo', 'tpo_approved', 'final_selected'] },
      isActive: true 
    });

    const studentsCount = await Student.countDocuments();
    const placedCount = await Student.countDocuments({ placementStatus: 'placed' });
    const placementRate = studentsCount > 0 ? Math.round((placedCount / studentsCount) * 100) : 0;

    const forwardedStudents = await Application.find({ status: 'forwarded_to_tpo' })
      .populate('student')
      .populate('drive', 'company role')
      .sort({ updatedAt: -1 })
      .limit(5);

    const recentDrives = await Drive.find()
      .sort({ createdAt: -1 })
      .limit(5);

    return successResponse(res, 200, 'TPO dashboard stats fetched', {
      activeDrives,
      totalApplicants,
      totalShortlisted: shortlistedCount,
      placementRate,
      monthlyGrowth: 12.5, // Mock
      avgPackage: "9.2 LPA",
      highestPackage: "45 LPA",
      recentDrives,
      forwardedStudents,
      topCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta']
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all applicants across all drives
 */
exports.getAllApplicants = async (req, res, next) => {
  try {
    const { status, drive, branch } = req.query;
    let query = { isActive: true };

    if (status) query.status = status;
    if (drive) query.drive = drive;

    let applications = await Application.find(query)
      .populate({
        path: 'student',
        match: branch ? { branch: branch } : {}
      })
      .populate('drive')
      .sort({ createdAt: -1 });

    // Filter out if student branch didn't match
    applications = applications.filter(app => app.student !== null);

    return successResponse(res, 200, 'All applicants fetched', applications);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all students forwarded by departments
 */
exports.getForwardedStudents = async (req, res, next) => {
  try {
    const applications = await Application.find({ status: 'forwarded_to_tpo' })
      .populate('student')
      .populate('drive');

    return successResponse(res, 200, 'Forwarded students fetched', applications);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Approve student from TPO level
 */
exports.approveStudent = async (req, res, next) => {
  try {
    const { applicationId, remarks } = req.body;

    const application = await Application.findById(applicationId).populate('student drive');
    if (!application) return errorResponse(res, 404, 'Application not found');

    application.status = 'tpo_approved';
    application.tpoRemarks = remarks;
    await application.save();

    // Update student placement status record if needed
    const student = await Student.findById(application.student._id);
    if (student) {
      student.placementStatus = 'shortlisted';
      await student.save();
    }

    // Notifications
    await Notification.createNotification(
      application.studentUser,
      'tpo_approved',
      'Shortlist Approved!',
      `TPO has approved your shortlist for ${application.drive.company}. Stay tuned for interview info.`,
      '/student/applications'
    );

    return successResponse(res, 200, 'Student approved by TPO');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Reject student from TPO level
 */
exports.rejectStudent = async (req, res, next) => {
  try {
    const { applicationId, remarks } = req.body;

    const application = await Application.findById(applicationId).populate('drive');
    if (!application) return errorResponse(res, 404, 'Application not found');

    application.status = 'rejected';
    application.tpoRemarks = remarks;
    await application.save();

    await Notification.createNotification(
      application.studentUser,
      'tpo_rejected',
      'Application Update',
      `Your application for ${application.drive.company} was not processed further by TPO.`,
      '/student/applications'
    );

    return successResponse(res, 200, 'Student rejected by TPO');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Final selection of student (Placed)
 */
exports.finalSelectStudent = async (req, res, next) => {
  try {
    const { applicationId } = req.body;

    const application = await Application.findById(applicationId).populate('student drive');
    if (!application) return errorResponse(res, 404, 'Application not found');

    application.status = 'final_selected';
    application.selectedAt = new Date();
    await application.save();

    const student = await Student.findById(application.student._id);
    if (student) {
      student.placementStatus = 'placed';
      student.selectedDrive = application.drive._id;
      await student.save();
    }

    await Notification.createNotification(
      application.studentUser,
      'result_announced',
      'Congratulations! You are PLACED!',
      `Incredible news! You have been selected by ${application.drive.company}. Check your dashboard for details.`,
      '/student/dashboard'
    );

    return successResponse(res, 200, 'Student marked as final selected (Placed)');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get comprehensive TPO analytics
 */
exports.getTPOAnalytics = async (req, res, next) => {
  try {
    const companyStats = [
      { company: 'Google', totalHires: 4, avgPackage: '42 LPA', acceptanceRate: '95%', departments: { CSE: 3, ECE: 1 } },
      { company: 'Microsoft', totalHires: 8, avgPackage: '32 LPA', acceptanceRate: '88%', departments: { CSE: 6, IT: 2 } },
      { company: 'Amazon', totalHires: 12, avgPackage: '28 LPA', acceptanceRate: '92%', departments: { CSE: 8, IT: 4 } }
    ];

    const departmentStats = [
      { branch: 'CSE', placed: 120, total: 180, rate: 66 },
      { branch: 'IT', placed: 95, total: 120, rate: 79 },
      { branch: 'ECE', placed: 60, total: 150, rate: 40 }
    ];

    return successResponse(res, 200, 'TPO analytics fetched', {
      companyStats,
      departmentStats,
      monthlyTrend: [
        { month: 'Oct', placed: 15, drives: 4 },
        { month: 'Nov', placed: 32, drives: 8 },
        { month: 'Dec', placed: 45, drives: 6 },
        { month: 'Jan', placed: 58, drives: 12 }
      ],
      packageDistribution: [
        { range: '0-5L', count: 40 },
        { range: '5-10L', count: 85 },
        { range: '10-20L', count: 45 },
        { range: '20L+', count: 20 }
      ]
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get full drive details with status breakdown
 */
exports.getDriveDetails = async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) return errorResponse(res, 404, 'Drive not found');

    const applications = await Application.find({ drive: req.params.id }).populate('student');

    const breakdown = {
      applied: applications.filter(a => a.status === 'applied').length,
      shortlisted: applications.filter(a => a.status === 'shortlisted').length,
      forwarded: applications.filter(a => a.status === 'forwarded_to_tpo').length,
      approved: applications.filter(a => a.status === 'tpo_approved').length,
      selected: applications.filter(a => a.status === 'final_selected').length,
      rejected: applications.filter(a => a.status === 'rejected').length
    };

    return successResponse(res, 200, 'Drive details fetched', { drive, breakdown, applications });
  } catch (error) {
    next(error);
  }
};
