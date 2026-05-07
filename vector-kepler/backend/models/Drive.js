const mongoose = require('mongoose');

const ApplicantSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  status: { 
    type: String, 
    enum: ['Applied', 'Shortlisted by Department', 'Forwarded to TPO', 'Final Approved', 'Selected', 'Rejected'], 
    default: 'Applied' 
  }
}, { _id: false });

const DriveSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  role: { type: String, required: true },
  package: { type: Number, required: true },
  requiredSkills: [{ type: String }],
  minCGPA: { type: Number, required: true },
  eligibleDepartments: [{ type: String }],
  deadline: { type: Date, required: true },
  applicants: [ApplicantSchema],
  shortlistedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  finalSelectedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
}, { timestamps: true });

module.exports = mongoose.model('Drive', DriveSchema);
