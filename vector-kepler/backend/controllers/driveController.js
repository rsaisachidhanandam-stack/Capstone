const Drive = require('../models/Drive');
const Student = require('../models/Student');

exports.createDrive = async (req, res) => {
  try {
    const drive = new Drive(req.body);
    await drive.save();
    res.status(201).json(drive);
  } catch (error) {
    res.status(500).json({ message: 'Error creating drive', error: error.message });
  }
};

exports.getDrives = async (req, res) => {
  try {
    const drives = await Drive.find().sort({ createdAt: -1 });
    res.json(drives);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drives', error: error.message });
  }
};

exports.applyToDrive = async (req, res) => {
  try {
    const { driveId } = req.params;
    
    // Find student profile belonging to logged in user
    const student = await Student.findOne({ userId: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const drive = await Drive.findById(driveId);
    if (!drive) return res.status(404).json({ message: 'Drive not found' });
    
    // Check if already applied
    const alreadyApplied = drive.applicants.find(a => a.studentId.toString() === student._id.toString());
    if (alreadyApplied) return res.status(400).json({ message: 'Already applied' });

    drive.applicants.push({ studentId: student._id, status: 'Applied' });
    await drive.save();

    student.appliedDrives.push(drive._id);
    await student.save();

    res.json({ message: 'Applied successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error applying to drive', error: error.message });
  }
};

exports.getApplicants = async (req, res) => {
  try {
    const { driveId } = req.params;
    const drive = await Drive.findById(driveId).populate({
      path: 'applicants.studentId',
      select: 'name email department cgpa skills resumeScore placementProbability'
    });
    if (!drive) return res.status(404).json({ message: 'Drive not found' });

    res.json(drive.applicants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applicants', error: error.message });
  }
};
