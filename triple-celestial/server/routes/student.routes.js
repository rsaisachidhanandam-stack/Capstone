const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getMyProfile,
  createOrUpdateProfile,
  getStudentById,
  getAllStudents,
  updateSkills,
  getStudentDashboardStats
} = require('../controllers/student.controller');

// Student only routes
router.get('/profile', protect, authorize('student'), getMyProfile);
router.post('/profile', protect, authorize('student'), createOrUpdateProfile);
router.put('/profile', protect, authorize('student'), createOrUpdateProfile);
router.get('/dashboard-stats', protect, authorize('student'), getStudentDashboardStats);
router.put('/skills', protect, authorize('student'), updateSkills);

// Shared/Admin routes
router.get('/all', protect, authorize('department', 'tpo'), getAllStudents);
router.get('/:id', protect, authorize('department', 'tpo'), getStudentById);

module.exports = router;
