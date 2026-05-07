const mongoose = require('mongoose');

const AlumniSchema = new mongoose.Schema({
  name: { type: String, required: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  package: { type: Number },
  interviewRounds: { type: Number },
  interviewQuestions: [{ type: String }],
  advice: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Alumni', AlumniSchema);
