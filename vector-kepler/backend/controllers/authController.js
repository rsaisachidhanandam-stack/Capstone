const User = require('../models/User');
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, department, studentId, cgpa } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ name, email, password, role, department });
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // If student, create student profile
    if (role === 'student' && studentId && cgpa) {
      const newStudent = new Student({
        userId: user._id, studentId, name, email, department, cgpa,
        skills: req.body.skills || []
      });
      await newStudent.save();
    }

    const payload = { user: { id: user.id, role: user.role, department: user.department } };
    jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: user.role });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { user: { id: user.id, role: user.role, department: user.department } };
    jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: user.role, name: user.name, department: user.department });
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
