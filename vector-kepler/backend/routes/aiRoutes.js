const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { auth, checkRole } = require('../middleware/auth');

router.post('/resume-analyze', auth, checkRole(['student']), aiController.analyzeResume);
router.post('/skill-gap', auth, checkRole(['student', 'department']), aiController.skillGap);
router.get('/mock-interview', auth, checkRole(['student']), aiController.mockInterview);

module.exports = router;
