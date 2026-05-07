const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  company: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  package: {
    type: String, // e.g. "12 LPA"
    required: true
  },
  yearPlaced: {
    type: Number,
    required: true
  },
  branch: {
    type: String
  },
  interviewRounds: {
    type: Number,
    default: 3
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  tips: {
    type: String
  },
  interviewQuestions: [{
    type: String
  }],
  strategy: {
    type: String
  },
  advice: {
    type: String
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  linkedIn: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alumni', alumniSchema);
