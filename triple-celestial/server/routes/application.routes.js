const express = require('express');
const {
  applyToDrive,
  getMyApplications,
  getApplicationById,
} = require('../controllers/application.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

router.post('/apply/:driveId', protect, authorize('student'), applyToDrive);
router.get('/my', protect, authorize('student'), getMyApplications);
router.get('/:id', protect, getApplicationById);

module.exports = router;
