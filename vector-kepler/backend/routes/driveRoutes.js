const express = require('express');
const router = express.Router();
const driveController = require('../controllers/driveController');
const { auth, checkRole } = require('../middleware/auth');

router.get('/', auth, driveController.getDrives);
router.post('/create', auth, checkRole(['tpo']), driveController.createDrive);
router.post('/:driveId/apply', auth, checkRole(['student']), driveController.applyToDrive);
router.get('/:driveId/applicants', auth, checkRole(['tpo', 'department']), driveController.getApplicants);

module.exports = router;
