const Application = require('../models/Application.model');
const Drive = require('../models/Drive.model');
const Student = require('../models/Student.model');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Apply to a placement drive
 */
exports.applyToDrive = async (req, res, next) => {
  try {
    const { driveId } = req.params;
    const userId = req.user.id;

    // 1. Find student profile
    const student = await Student.findOne({ userId });
    if (!student) {
      return errorResponse(res, 400, 'Please complete your student profile first');
    }

    // 2. Find drive
    const drive = await Drive.findById(driveId);
    if (!drive) {
      return errorResponse(res, 404, 'Placement drive not found');
    }

    // 3. Check deadline
    if (new Date() > new Date(drive.deadline)) {
      return errorResponse(res, 400, 'Application deadline has passed');
    }

    // 4. Check eligibility
    if (student.cgpa < drive.minCGPA) {
      return errorResponse(res, 400, `Ineligible: Minimum CGPA of ${drive.minCGPA} required`);
    }

    if (!drive.eligibleBranches.includes(student.branch)) {
      return errorResponse(res, 400, `Ineligible: Your branch (${student.branch}) is not eligible for this drive`);
    }

    if (student.backlogs > drive.maxBacklogs) {
      return errorResponse(res, 400, `Ineligible: Maximum ${drive.maxBacklogs} backlogs allowed`);
    }

    // 5. Check if already applied
    const existingApp = await Application.findOne({ student: student._id, drive: driveId });
    if (existingApp) {
      return errorResponse(res, 400, 'You have already applied for this drive');
    }

    // 6. Calculate AI Score
    const matchingSkills = drive.requiredSkills.filter((skill) =>
      student.skills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
    ).length;

    const skillMatch = (matchingSkills / drive.requiredSkills.length) * 100;
    const cgpaScore = (student.cgpa / 10) * 100;
    const aiScore = Math.round((skillMatch * 0.6) + (cgpaScore * 0.4));

    // 7. Create Application
    const application = await Application.create({
      student: student._id,
      studentUser: userId,
      drive: driveId,
      aiMatchScore: aiScore,
      resumeScoreAtApply: student.resumeScore,
    });

    // 8. Update Student and Drive
    student.appliedDrives.push(drive._id);
    student.placementStatus = 'applied';
    await student.save();

    drive.applicants.push(userId);
    await drive.save();

    return successResponse(res, 201, 'Applied successfully', application);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current student's applications
 */
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ studentUser: req.user.id })
      .populate('drive')
      .sort({ appliedAt: -1 });

    return successResponse(res, 200, 'Your applications fetched', applications);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get application details by ID
 */
exports.getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('drive')
      .populate({
        path: 'student',
        populate: { path: 'userId', select: 'name email' }
      });

    if (!application) {
      return errorResponse(res, 404, 'Application not found');
    }

    return successResponse(res, 200, 'Application details fetched', application);
  } catch (error) {
    next(error);
  }
};
