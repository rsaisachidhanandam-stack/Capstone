const Drive = require('../models/Drive.model');
const Student = require('../models/Student.model');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Create a new placement drive (TPO Only)
 */
exports.createDrive = async (req, res, next) => {
  try {
    const driveData = { ...req.body, createdBy: req.user.id };

    const drive = await Drive.create(driveData);

    return successResponse(res, 201, 'Placement drive created successfully', drive);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all drives with filtering and pagination
 */
exports.getAllDrives = async (req, res, next) => {
  try {
    const { status, branch, minPackage, search, page = 1, limit = 10 } = req.query;

    let query = {};

    // Base filters
    if (status) query.status = status;
    else if (req.user.role === 'student') query.status = 'active';

    if (branch) query.eligibleBranches = branch;
    if (minPackage) query.package = { $gte: minPackage };
    if (search) {
      query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
      ];
    }

    // Role specific student filters
    if (req.user.role === 'student') {
      try {
        const student = await Student.findOne({ userId: req.user.id });
        if (student) {
          query.eligibleBranches = student.branch;
          query.minCGPA = { $lte: student.cgpa };
          query.maxBacklogs = { $gte: student.backlogs };
        }
      } catch (err) {
        console.error('Error fetching student profile:', err);
        // Continue without student-specific filters
      }
    }

    const skip = (page - 1) * limit;

    const drives = await Drive.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Drive.countDocuments(query);

    return successResponse(res, 200, 'Drives fetched successfully', {
      drives,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get drive by ID
 */
exports.getDriveById = async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.id)
      .populate('applicants', 'name email')
      .populate('shortlisted', 'name email');

    if (!drive) {
      return errorResponse(res, 404, 'Drive not found');
    }

    return successResponse(res, 200, 'Drive details fetched', drive);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update drive details (TPO Only)
 */
exports.updateDrive = async (req, res, next) => {
  try {
    const drive = await Drive.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!drive) {
      return errorResponse(res, 404, 'Drive not found');
    }

    return successResponse(res, 200, 'Drive updated successfully', drive);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Soft delete/Close drive (TPO Only)
 */
exports.deleteDrive = async (req, res, next) => {
  try {
    const drive = await Drive.findByIdAndUpdate(
      req.params.id,
      { status: 'closed' },
      { new: true }
    );

    if (!drive) {
      return errorResponse(res, 404, 'Drive not found');
    }

    return successResponse(res, 200, 'Drive closed successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all applicants for a specific drive
 */
exports.getDriveApplicants = async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.id).populate({
      path: 'applicants',
      select: 'name email',
      // In a real scenario, we'd join with Applications and then Student profile
    });

    if (!drive) {
      return errorResponse(res, 404, 'Drive not found');
    }

    return successResponse(res, 200, 'Applicants fetched successfully', drive.applicants);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get drives student is eligible for with AI Match Score
 */
exports.getStudentEligibleDrives = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });

    let drives;
    if (!student) {
      // If no student profile, return all active drives with default score
      drives = await Drive.find({
        status: 'active',
        deadline: { $gt: new Date() },
      });

      const eligibleDrives = drives.map((drive) => ({
        ...drive.toObject(),
        aiMatchScore: 50, // Default score
      }));

      return successResponse(res, 200, 'Active drives fetched (Profile incomplete)', eligibleDrives);
    }

    drives = await Drive.find({
      status: 'active',
      eligibleBranches: student.branch,
      minCGPA: { $lte: student.cgpa },
      maxBacklogs: { $gte: student.backlogs },
      deadline: { $gt: new Date() },
    });

    const eligibleDrives = drives.map((drive) => {
      const driveObj = drive.toObject();

      // AI Match Score Logic
      const matchingSkills = drive.requiredSkills.filter((skill) =>
        student.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
      ).length;

      const skillMatch = drive.requiredSkills.length > 0 
        ? (matchingSkills / drive.requiredSkills.length) * 100 
        : 100;
        
      const cgpaScore = (student.cgpa / 10) * 100;
      
      const overallMatch = (skillMatch * 0.6) + (cgpaScore * 0.4);

      return {
        ...driveObj,
        aiMatchScore: Math.round(overallMatch),
      };
    });

    eligibleDrives.sort((a, b) => b.aiMatchScore - a.aiMatchScore);

    return successResponse(res, 200, 'Eligible drives fetched', eligibleDrives);
  } catch (error) {
    next(error);
  }
};
