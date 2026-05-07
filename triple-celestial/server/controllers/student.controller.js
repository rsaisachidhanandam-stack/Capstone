const Student = require('../models/Student.model');
const Drive = require('../models/Drive.model');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Get current student's profile
 */
exports.getMyProfile = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id }).populate('userId', 'name email');

    if (!student) {
      // Return 200 with null so frontend knows to show empty form instead of error
      return successResponse(res, 200, 'No profile found, please create one', null);
    }

    return successResponse(res, 200, 'Student profile fetched successfully', student);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create or Update student profile
 */
exports.createOrUpdateProfile = async (req, res, next) => {
  try {
    const existingStudent = await Student.findOne({ 
      userId: req.user.id 
    });
    
    if (existingStudent) {
      // UPDATE existing profile
      const updated = await Student.findOneAndUpdate(
        { userId: req.user.id },
        { 
          $set: {
            rollNumber: req.body.rollNumber,
            branch: req.body.branch,
            cgpa: parseFloat(req.body.cgpa) || 0,
            skills: req.body.skills || [],
            phone: req.body.phone || '',
            linkedIn: req.body.linkedIn || '',
            github: req.body.github || '',
            tenthPercent: parseFloat(req.body.tenthPercent) || 0,
            twelthPercent: parseFloat(req.body.twelthPercent) || 0,
            graduationYear: parseInt(req.body.graduationYear) || 2025,
            backlogs: parseInt(req.body.backlogs) || 0,
          }
        },
        { new: true, runValidators: true }
      );
      return successResponse(res, 200, 'Profile updated successfully', updated);
    } else {
      // CREATE new profile
      const newStudent = await Student.create({
        userId: req.user.id,
        rollNumber: req.body.rollNumber || '',
        branch: req.body.branch || 'CSE',
        cgpa: parseFloat(req.body.cgpa) || 0,
        skills: req.body.skills || [],
        phone: req.body.phone || '',
        linkedIn: req.body.linkedIn || '',
        github: req.body.github || '',
        tenthPercent: parseFloat(req.body.tenthPercent) || 0,
        twelthPercent: parseFloat(req.body.twelthPercent) || 0,
        graduationYear: parseInt(req.body.graduationYear) || 2025,
        backlogs: parseInt(req.body.backlogs) || 0,
      });
      return successResponse(res, 201, 'Profile created successfully', newStudent);
    }
  } catch (error) {
    console.error('Profile save error:', error);
    next(error);
  }
};

/**
 * @desc    Get student profile by ID (Department/TPO)
 */
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('userId', 'name email');

    if (!student) {
      return errorResponse(res, 404, 'Student not found');
    }

    return successResponse(res, 200, 'Student details fetched', student);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all students with filters (Department/TPO)
 */
exports.getAllStudents = async (req, res, next) => {
  try {
    const { branch, minCGPA, maxBacklogs, placementStatus } = req.query;

    let query = {};

    if (branch) query.branch = branch;
    if (minCGPA) query.cgpa = { $gte: minCGPA };
    if (maxBacklogs) query.backlogs = { $lte: maxBacklogs };
    if (placementStatus) query.placementStatus = placementStatus;

    const students = await Student.find(query).populate('userId', 'name email');

    return successResponse(res, 200, 'Students fetched successfully', students);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update student skills
 */
exports.updateSkills = async (req, res, next) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return errorResponse(res, 400, 'Skills must be an array of strings');
    }

    const student = await Student.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { skills } },
      { new: true }
    );

    if (!student) {
      return errorResponse(res, 404, 'Student profile not found');
    }

    return successResponse(res, 200, 'Skills updated successfully', student);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard statistics for current student
 */
exports.getStudentDashboardStats = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });

    if (!student) {
      const defaultStats = {
        totalApplied: 0,
        shortlisted: 0,
        interviewScore: 0,
        resumeScore: 0,
        placementProbability: 0,
        matchRate: 0,
        placementStatus: 'unplaced'
      };
      return successResponse(res, 200, 'Complete your profile for personalized analysis', defaultStats);
    }

    const appliedCount = student.appliedDrives ? student.appliedDrives.length : 0;
    const shortlistedCount = student.shortlistedDrives ? student.shortlistedDrives.length : 0;

    // In a real app, matchRate would come from an aggregation of all active drives
    // For now, we return the student's stored match fields
    const stats = {
      totalApplied: appliedCount,
      shortlisted: shortlistedCount,
      interviewScore: student.interviewScore || 0,
      resumeScore: student.resumeScore || 0,
      placementProbability: student.placementProbability || 0,
      matchRate: student.skillMatchScore || 0,
      placementStatus: student.placementStatus
    };

    return successResponse(res, 200, 'Dashboard statistics fetched', stats);
  } catch (error) {
    next(error);
  }
};
