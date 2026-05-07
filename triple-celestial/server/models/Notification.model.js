const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      'drive_announced',
      'application_confirmed',
      'shortlisted',
      'forwarded_to_tpo',
      'tpo_approved',
      'tpo_rejected',
      'interview_scheduled',
      'deadline_reminder',
      'result_announced',
      'auto_shortlist_done',
      'new_applicant'
    ],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  link: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Static method to create a notification
notificationSchema.statics.createNotification = async function(recipientId, type, title, message, link = '') {
  try {
    return await this.create({
      recipient: recipientId,
      type,
      title,
      message,
      link
    });
  } catch (err) {
    console.error('Notification Error:', err);
  }
};

module.exports = mongoose.model('Notification', notificationSchema);
