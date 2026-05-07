const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    rollNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    branch: {
      type: String,
      enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'MCA', 'MBA'],
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    skills: {
      type: [String],
      default: [],
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    resumeScore: {
      type: Number,
      default: 0,
    },
    skillMatchScore: {
      type: Number,
      default: 0,
    },
    placementStatus: {
      type: String,
      enum: ['not_placed', 'applied', 'shortlisted', 'placed'],
      default: 'not_placed',
    },
    appliedDrives: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drive',
      },
    ],
    shortlistedDrives: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drive',
      },
    ],
    selectedDrive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drive',
    },
    backlogs: {
      type: Number,
      default: 0,
    },
    phone: {
      type: String,
      default: '',
    },
    linkedIn: {
      type: String,
      default: '',
    },
    github: {
      type: String,
      default: '',
    },
    profilePicture: {
      type: String,
      default: '',
    },
    interviewScore: {
      type: Number,
      default: 0,
    },
    placementProbability: {
      type: Number,
      default: 0,
    },
    tenthPercent: {
      type: Number,
      default: 0,
    },
    twelthPercent: {
      type: Number,
      default: 0,
    },
    graduationYear: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Student', studentSchema);
