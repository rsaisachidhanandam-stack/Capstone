const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { auth, checkRole } = require('../middleware/auth');

router.post('/shortlist', auth, checkRole(['department']), departmentController.shortlistApplicants);
router.post('/forward', auth, checkRole(['department']), departmentController.forwardToTpo);

module.exports = router;
