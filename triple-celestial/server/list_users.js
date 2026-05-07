const mongoose = require('mongoose');
const User = require('./models/User.model');
const Student = require('./models/Student.model');
const dotenv = require('dotenv');

dotenv.config();

const checkUsersStats = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find({}, 'email role name');
    console.log('--- Users and Profiles ---');
    for (const u of users) {
      const profile = await Student.findOne({ userId: u._id });
      console.log(`Email: ${u.email} | Role: ${u.role} | Profile: ${profile ? 'FOUND' : 'MISSING'}`);
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkUsersStats();
