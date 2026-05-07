const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getTPODashboard,
  getAllApplicants,
  getForwardedStudents,
  approveStudent,
  rejectStudent,
  finalSelectStudent,
  getTPOAnalytics,
  getDriveDetails
} = require('../controllers/tpo.controller');

router.get('/dashboard', protect, authorize('tpo'), getTPODashboard);
router.get('/applicants', protect, authorize('tpo'), getAllApplicants);
router.get('/forwarded', protect, authorize('tpo'), getForwardedStudents);
router.post('/approve', protect, authorize('tpo'), approveStudent);
router.post('/reject', protect, authorize('tpo'), rejectStudent);
router.post('/final-select', protect, authorize('tpo'), finalSelectStudent);
router.get('/analytics', protect, authorize('tpo'), getTPOAnalytics);
router.get('/drives/:id', protect, authorize('tpo', 'department'), getDriveDetails);

module.exports = router;
