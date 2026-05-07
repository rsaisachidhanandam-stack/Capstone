const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  originalUrl: {
    type: String,
    required: true
  },
  atsScore: {
    type: Number,
    default: 0
  },
  sectionScore: {
    type: Number,
    default: 0
  },
  skillMatchScore: {
    type: Number,
    default: 0
  },
  missingSkills: {
    type: [String],
    default: []
  },
  matchedSkills: {
    type: [String],
    default: []
  },
  suggestions: {
    type: [String],
    default: []
  },
  improvements: {
    type: [String],
    default: []
  },
  sections: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  analyzedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);

