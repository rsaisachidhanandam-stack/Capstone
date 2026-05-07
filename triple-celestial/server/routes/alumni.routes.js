const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
  getAllAlumni,
  seedAlumniData,
  getAlumniById,
  addAlumni
} = require('../controllers/alumni.controller');

router.get('/', protect, getAllAlumni);
router.get('/seed', protect, seedAlumniData);
router.get('/:id', protect, getAlumniById);
router.post('/', protect, authorize('tpo', 'student'), addAlumni);

module.exports = router;
