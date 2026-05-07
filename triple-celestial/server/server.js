const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error.middleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const authRoutes = require('./routes/auth.routes');
const driveRoutes = require('./routes/drive.routes');
const applicationRoutes = require('./routes/application.routes');
const studentRoutes = require('./routes/student.routes');
const resumeRoutes = require('./routes/resume.routes');
const departmentRoutes = require('./routes/department.routes');
const tpoRoutes = require('./routes/tpo.routes');
const notificationRoutes = require('./routes/notification.routes');
const alumniRoutes = require('./routes/alumni.routes');

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/drives', driveRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/tpo', tpoRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/alumni', alumniRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'IntelliPlace API is running',
    timestamp: new Date(),
  });
});

// Placeholder for routes
// AUTH ROUTES
// STUDENT ROUTES
// DEPARTMENT ROUTES
// TPO ROUTES
// DRIVE ROUTES
// APPLICATION ROUTES
// RESUME ROUTES
// NOTIFICATION ROUTES
// ALUMNI ROUTES

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} in ${process.env.NODE_ENV} mode`
  );
});

module.exports = app;
