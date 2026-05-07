const mongoose = require('mongoose');
const User = require('./models/User.model');
const Student = require('./models/Student.model');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Delete existing test users and student profiles
    await User.deleteMany({
      email: { $in: ['student@test.com', 'dept@intelliplace.com', 'tpo@test.com'] }
    });
    
    // Create student user
    const studentUser = await User.create({
      name: 'Test Student',
      email: 'student@test.com',
      password: '123456',
      role: 'student'
    });

    // Create student profile
    await Student.create({
      userId: studentUser._id,
      rollNumber: 'STU001',
      branch: 'CSE',
      cgpa: 8.5,
      skills: ['Java', 'Spring', 'MySQL', 'React', 'Node.js', 'Python'],
      phone: '9876543210',
      tenthPercent: 90,
      twelthPercent: 88,
      graduationYear: 2025,
      backlogs: 0,
      placementStatus: 'not_placed',
      resumeScore: 85,
      skillMatchScore: 80,
      interviewScore: 75,
      placementProbability: 0
    });

    // Create department
    await User.create({
      name: 'Test Dept',
      email: 'dept@intelliplace.com',
      password: 'dept123456',
      role: 'department'
    });

    // Create TPO
    await User.create({
      name: 'Test TPO',
      email: 'tpo@test.com',
      password: '123456',
      role: 'tpo'
    });

    console.log('Test users and student profile created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding test users:', error);
    process.exit(1);
  }
};

seed();
