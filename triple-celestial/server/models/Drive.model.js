const mongoose = require('mongoose');

const driveSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
    },
    package: {
      type: String,
      required: [true, 'Package/CTC is required'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    minCGPA: {
      type: Number,
      required: [true, 'Minimum CGPA is required'],
      min: 0,
      max: 10,
    },
    maxBacklogs: {
      type: Number,
      default: 0,
    },
    eligibleBranches: {
      type: [String],
      required: [true, 'Eligible branches are required'],
      enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'MCA', 'MBA'],
    },
    requiredSkills: {
      type: [String],
      required: [true, 'Required skills are required'],
    },
    deadline: {
      type: Date,
      required: [true, 'Application deadline is required'],
    },
    driveDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['draft', 'active', 'closed', 'completed'],
      default: 'active',
    },
    logo: {
      type: String,
      default: '',
    },
    logoColor: {
      type: String,
      default: '#3b82f6',
    },
    companyWebsite: {
      type: String,
    },
    jobLocation: {
      type: String,
    },
    jobType: {
      type: String,
      enum: ['full-time', 'internship', 'part-time'],
      default: 'full-time',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Referencing User because applications model tracks student profile
      },
    ],
    shortlisted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    selected: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    totalPositions: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals
driveSchema.virtual('applicantCount').get(function () {
  return this.applicants ? this.applicants.length : 0;
});

driveSchema.virtual('shortlistCount').get(function () {
  return this.shortlisted ? this.shortlisted.length : 0;
});

// Indexes
driveSchema.index({ status: 1, deadline: 1 });

module.exports = mongoose.model('Drive', driveSchema);
