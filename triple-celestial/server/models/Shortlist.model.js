const mongoose = require('mongoose');

const shortlistSchema = new mongoose.Schema({
  drive: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drive',
    required: true
  },
  department: {
    type: String,
    required: true
  },
  shortlistedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  forwardedToTPO: {
    type: Boolean,
    default: false
  },
  forwardedAt: {
    type: Date
  },
  forwardedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tpoApprovalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  remarks: {
    type: String,
    default: ''
  },
  forwardHistory: [{
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student'
    },
    studentName: String,
    forwardedAt: {
      type: Date,
      default: Date.now
    },
    remarks: String,
    tpoStatus: {
      type: String,
      default: 'Pending'
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Shortlist', shortlistSchema);
