const express = require('express');
const router = express.Router();
const tpoController = require('../controllers/tpoController');
const { auth, checkRole } = require('../middleware/auth');

router.get('/final-candidates', auth, checkRole(['tpo']), tpoController.getFinalCandidates);
router.post('/approve', auth, checkRole(['tpo']), tpoController.approveCandidates);

module.exports = router;
