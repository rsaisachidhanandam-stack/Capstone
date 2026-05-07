const Drive = require('../models/Drive');

exports.shortlistApplicants = async (req, res) => {
  try {
    const { driveId, studentIds } = req.body;
    
    const drive = await Drive.findById(driveId);
    if (!drive) return res.status(404).json({ message: 'Drive not found' });

    // Update applicant statuses
    let updatedCount = 0;
    drive.applicants.forEach(applicant => {
      if (studentIds.includes(applicant.studentId.toString()) && applicant.status === 'Applied') {
        applicant.status = 'Shortlisted by Department';
        updatedCount++;
      }
    });

    await drive.save();
    res.json({ message: `Successfully shortlisted ${updatedCount} students` });
  } catch (error) {
    res.status(500).json({ message: 'Error shortlisting', error: error.message });
  }
};

exports.forwardToTpo = async (req, res) => {
  try {
    const { driveId, studentIds } = req.body;
    
    const drive = await Drive.findById(driveId);
    if (!drive) return res.status(404).json({ message: 'Drive not found' });

    let forwardedCount = 0;
    drive.applicants.forEach(applicant => {
      if (studentIds.includes(applicant.studentId.toString()) && applicant.status === 'Shortlisted by Department') {
        applicant.status = 'Forwarded to TPO';
        forwardedCount++;
      }
    });

    await drive.save();
    res.json({ message: `Successfully forwarded ${forwardedCount} students to TPO` });
  } catch (error) {
    res.status(500).json({ message: 'Error forwarding to TPO', error: error.message });
  }
};
