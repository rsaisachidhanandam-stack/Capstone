const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const driveRoutes = require('./routes/driveRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const tpoRoutes = require('./routes/tpoRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/tpo', tpoRoutes);
app.use('/api/ai', aiRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/intelliplace_fresh')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
