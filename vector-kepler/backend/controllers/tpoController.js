const Drive = require('../models/Drive');

exports.getFinalCandidates = async (req, res) => {
  try {
    // Returns applicants that were forwarded to TPO across all drives
    const drives = await Drive.find({ 'applicants.status': 'Forwarded to TPO' })
      .populate('applicants.studentId', 'name email department cgpa skills');
      
    // Filter out only the forwarded applicants
    const finalCandidates = drives.map(drive => ({
      driveId: drive._id,
      companyName: drive.companyName,
      role: drive.role,
      candidates: drive.applicants.filter(a => a.status === 'Forwarded to TPO')
    })).filter(d => d.candidates.length > 0);

    res.json(finalCandidates);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching final candidates', error: error.message });
  }
};

exports.approveCandidates = async (req, res) => {
  try {
    const { driveId, studentIds, approvalStatus } = req.body;
    // approvalStatus can be 'Final Approved' or 'Rejected'

    const drive = await Drive.findById(driveId);
    if (!drive) return res.status(404).json({ message: 'Drive not found' });

    let updatedCount = 0;
    drive.applicants.forEach(applicant => {
      if (studentIds.includes(applicant.studentId.toString()) && applicant.status === 'Forwarded to TPO') {
        applicant.status = approvalStatus;
        if (approvalStatus === 'Final Approved') {
           drive.finalSelectedStudents.push(applicant.studentId);
        }
        updatedCount++;
      }
    });

    await drive.save();
    res.json({ message: `Successfully ${approvalStatus === 'Final Approved' ? 'approved' : 'rejected'} ${updatedCount} candidates` });
  } catch (error) {
    res.status(500).json({ message: 'Error approving candidates', error: error.message });
  }
};
