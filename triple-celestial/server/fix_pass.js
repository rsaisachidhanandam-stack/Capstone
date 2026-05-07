const mongoose = require('mongoose');
const User = require('./models/User.model');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const fixPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('123456', salt);
    
    await User.updateOne({ email: 'rsaisachidhanandam@gmail.com' }, { password: hash });
    console.log('Password fixed for rsaisachidhanandam@gmail.com');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

fixPassword();
