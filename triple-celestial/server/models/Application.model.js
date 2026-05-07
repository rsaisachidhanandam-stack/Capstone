const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    studentUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    drive: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Drive',
      required: true,
    },
    status: {
      type: String,
      enum: [
        'applied',
        'shortlisted',
        'forwarded_to_tpo',
        'tpo_approved',
        'final_selected',
        'rejected',
      ],
      default: 'applied',
    },
    aiMatchScore: {
      type: Number,
      default: 0,
    },
    resumeScoreAtApply: {
      type: Number,
      default: 0,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    shortlistedAt: {
      type: Date,
    },
    forwardedAt: {
      type: Date,
    },
    selectedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
    departmentRemarks: {
      type: String,
      default: '',
    },
    tpoRemarks: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications
applicationSchema.index({ student: 1, drive: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
