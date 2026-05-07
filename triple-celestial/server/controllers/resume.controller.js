const pdfParse = require('pdf-parse/lib/pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');
const Student = require('../models/Student.model');
const Resume = require('../models/Resume.model');
const Drive = require('../models/Drive.model');
const resumeScorer = require('../services/ai/resumeScorer');
const skillGapAnalyzer = require('../services/ai/skillGapAnalyzer');
const placementPredictor = require('../services/ai/placementPredictor');
const { successResponse, errorResponse } = require('../utils/apiResponse');

/**
 * @desc    Upload resume and perform AI analysis
 */
exports.uploadAndAnalyzeResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return errorResponse(res, 400, 'Please upload a file');
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    let resumeText = '';

    // Extract text based on file type
    if (mimeType === 'application/pdf') {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      resumeText = pdfData.text;
    } else if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ path: filePath });
      resumeText = result.value;
    } else {
      // Fallback for DOC / others
      resumeText = fs.readFileSync(filePath, 'utf8');
    }

    if (!resumeText || resumeText.length < 20) {
      return errorResponse(res, 400, 'Could not extract enough text from resume. Please use a text-based file.');
    }

    // Call AI scorer
    const analysis = resumeScorer.analyzeResume(resumeText, []);

    // Find student profile
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return errorResponse(res, 404, 'Student profile not found');
    }

    // Update student profile
    student.resumeScore = analysis.totalScore;
    student.resumeUrl = req.file.path;
    student.skillMatchScore = analysis.skillMatchScore;
    await student.save();

    // Save Resume document
    await Resume.create({
      student: student._id,
      originalUrl: req.file.path,
      atsScore: analysis.totalScore,
      sectionScore: analysis.sectionScore,
      skillMatchScore: analysis.skillMatchScore,
      missingSkills: analysis.missingSkills,
      suggestions: analysis.suggestions,
      analyzedAt: new Date(),
      sections: analysis.sections,
      matchedSkills: analysis.matchedSkills,
      improvements: analysis.improvements
    });

    return successResponse(res, 201, 'Resume analyzed successfully', {
      totalScore: analysis.totalScore,
      sectionScore: analysis.sectionScore,
      skillMatchScore: analysis.skillMatchScore,
      sections: analysis.sections,
      missingSkills: analysis.missingSkills,
      suggestions: analysis.suggestions,
      improvements: analysis.improvements
    });

  } catch (error) {
    console.error('Resume error:', error);
    next(error);
  }
};



/**
 * @desc    Get latest resume analysis for current student
 */
exports.getResumeAnalysis = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) {
      return errorResponse(res, 404, 'Student profile not found');
    }

    const resume = await Resume.findOne({ student: student._id }).sort({ analyzedAt: -1 });

    if (!resume) {
      return errorResponse(res, 404, 'No resume analysis found. Please upload your resume.');
    }

    return successResponse(res, 200, 'Latest resume analysis fetched', resume);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Analyze skill gap for target role/drive
 */
exports.getSkillGap = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    
    // If student not found return default
    if (!student) {
      return successResponse(res, 200, 'Default skill gap data', {
        matchPercentage: 0,
        matchedSkills: [],
        missingSkills: [],
        recommendations: [],
        radarData: [
          { category: 'DSA', score: 0 },
          { category: 'Web Dev', score: 0 },
          { category: 'Database', score: 0 },
          { category: 'DevOps', score: 0 },
          { category: 'System Design', score: 0 },
          { category: 'ML/AI', score: 0 }
        ]
      });
    }

    const targetRole = req.query.role || 'Software Engineer';
    const activeDrives = await Drive.find({ status: 'active' }).limit(5);
    let requiredSkills = [];
    
    if (activeDrives.length > 0) {
      const allSkills = activeDrives.reduce((acc, drive) => [...acc, ...drive.requiredSkills], []);
      requiredSkills = [...new Set(allSkills)];
    } else {
      requiredSkills = ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Git', 'DSA'];
    }

    const gapAnalysis = skillGapAnalyzer.analyzeSkillGap(student.skills, requiredSkills, targetRole);

    return successResponse(res, 200, 'Skill gap analysis calculated', gapAnalysis);
  } catch (error) {
    console.error('Skill Gap Error:', error);
    next(error);
  }
};

/**
 * @desc    Calculate placement prediction
 */
exports.getPlacementPrediction = async (req, res, next) => {
  try {
    const student = await Student.findOne({ userId: req.user.id });
    
    // If student profile missing return default data
    if (!student) {
      return successResponse(res, 200, 'Default prediction data', {
        probability: 0,
        riskLevel: 'Medium',
        factors: [],
        suggestions: []
      });
    }

    // Gather data for prediction
    const predictionData = {
      cgpa: student.cgpa,
      resumeScore: student.resumeScore,
      skillMatchScore: student.skillMatchScore,
      interviewScore: student.interviewScore || 65,
      backlogs: student.backlogs || 0,
      appliedCount: student.appliedDrives?.length || 0,
      shortlistedCount: student.shortlistedDrives?.length || 0
    };

    const prediction = placementPredictor.predictPlacement(predictionData);

    // Update student probability
    student.placementProbability = prediction.probability;
    await student.save();

    return successResponse(res, 200, 'Placement prediction generated', prediction);
  } catch (error) {
    console.error('Prediction Error:', error);
    next(error);
  }
};


