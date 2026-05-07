const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getDepartmentDashboard,
  getDepartmentStudents,
  shortlistStudent,
  bulkShortlist,
  removeFromShortlist,
  autoShortlist,
  forwardToTPO,
  getForwardHistory,
  getDepartmentAnalytics
} = require('../controllers/department.controller');

// Department Incharge Only Routes
router.get('/dashboard', protect, authorize('department'), getDepartmentDashboard);
router.get('/students', protect, authorize('department', 'tpo'), getDepartmentStudents);
router.post('/shortlist', protect, authorize('department'), shortlistStudent);
router.post('/shortlist/bulk', protect, authorize('department'), bulkShortlist);
router.delete('/shortlist', protect, authorize('department'), removeFromShortlist);
router.post('/auto-shortlist', protect, authorize('department'), autoShortlist);
router.post('/forward-to-tpo', protect, authorize('department'), forwardToTPO);
router.get('/forward-history', protect, authorize('department'), getForwardHistory);
router.get('/analytics', protect, authorize('department'), getDepartmentAnalytics);

module.exports = router;
