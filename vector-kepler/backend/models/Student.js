const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  cgpa: { type: Number, required: true },
  skills: [{ type: String }],
  resumeUrl: { type: String },
  resumeScore: { type: Number, default: 0 },
  placementProbability: { type: Number, default: 0 },
  appliedDrives: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Drive' }],
  shortlistedDrives: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Drive' }]
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
