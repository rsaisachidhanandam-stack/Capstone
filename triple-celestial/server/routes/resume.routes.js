const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const upload = require('../config/multer');
const {
  uploadAndAnalyzeResume,
  getResumeAnalysis,
  getSkillGap,
  getPlacementPrediction
} = require('../controllers/resume.controller');

// All routes require student authentication
router.post('/upload',
  protect,
  authorize('student'),
  upload.single('resume'),
  uploadAndAnalyzeResume
);

router.get('/analysis', protect, authorize('student'), getResumeAnalysis);
router.get('/skill-gap', protect, authorize('student'), getSkillGap);
router.get('/prediction', protect, authorize('student'), getPlacementPrediction);

// Error handler for multer errors
router.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large! Maximum 5MB allowed.'
    });
  }
  if (err.message === 'Only PDF, DOC, DOCX files allowed!') {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next(err);
});

module.exports = router;


