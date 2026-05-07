const express = require('express');
const {
  createDrive,
  getAllDrives,
  getDriveById,
  updateDrive,
  deleteDrive,
  getDriveApplicants,
  getStudentEligibleDrives,
} = require('../controllers/drive.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

router.get('/', protect, getAllDrives);
router.get('/eligible', protect, authorize('student'), getStudentEligibleDrives);
router.get('/:id', protect, getDriveById);

// TPO Routes
router.post('/', protect, authorize('tpo'), createDrive);
router.put('/:id', protect, authorize('tpo'), updateDrive);
router.delete('/:id', protect, authorize('tpo'), deleteDrive);
router.get('/:id/applicants', protect, authorize('tpo', 'department'), getDriveApplicants);

module.exports = router;
