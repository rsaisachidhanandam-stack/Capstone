import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ROLES } from './utils/constants';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Department Pages
import DeptDashboard from './pages/department/DepartmentDashboard';
import StudentManagement from './pages/department/StudentManagement';
import AutoShortlist from './pages/department/AutoShortlist';
import DeptAnalytics from './pages/department/DeptAnalytics';

// TPO Pages
import TPODashboard from './pages/tpo/TPODashboard';
import CreateDrive from './pages/tpo/CreateDrive';
import ManageDrives from './pages/tpo/ManageDrives';
import AllApplicants from './pages/tpo/AllApplicants';
import CompanyAnalytics from './pages/tpo/CompanyAnalytics';

// Common Pages
import AlumniConnect from './pages/common/AlumniConnect';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentDrives from './pages/student/Drives';
import MyApplications from './pages/student/MyApplications';
import Profile from './pages/student/Profile';
import ResumeAnalyzer from './pages/student/ResumeAnalyzer';
import SkillGap from './pages/student/SkillGap';
import Predictor from './pages/student/Predictor';
import MockInterview from './pages/student/MockInterview';

// Common Components
import Layout from './components/common/Layout';

/**
 * @desc    Full screen loader with spinner
 */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      <p className="mt-4 text-gray-600 font-medium animate-pulse">IntelliPlace AI is loading...</p>
    </div>
  </div>
);

/**
 * @desc    Protected Route Component
 */
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && role !== allowedRole) {
    // Redirect to correct dashboard based on actual role
    if (role === ROLES.STUDENT) return <Navigate to="/student/dashboard" />;
    if (role === ROLES.DEPARTMENT) return <Navigate to="/department/dashboard" />;
    if (role === ROLES.TPO) return <Navigate to="/tpo/dashboard" />;
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter suppressHydrationWarning>
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 4000,
            className: 'font-inter text-sm rounded-xl px-4 py-3 shadow-xl',
          }}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Student Routes */}
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute allowedRole={ROLES.STUDENT}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/drives" 
            element={
              <ProtectedRoute allowedRole={ROLES.STUDENT}>
                <StudentDrives />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/applications" 
            element={
              <ProtectedRoute allowedRole={ROLES.STUDENT}>
                <MyApplications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/profile" 
            element={
              <ProtectedRoute allowedRole={ROLES.STUDENT}>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/resume" 
            element={
              <ProtectedRoute allowedRole={ROLES.STUDENT}>
                <ResumeAnalyzer />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/skills" 
            element={
              <ProtectedRoute allowedRole={ROLES.STUDENT}>
                <SkillGap />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/predictor" 
            element={
              <ProtectedRoute allowedRole={ROLES.STUDENT}>
                <Predictor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/interview" 
            element={
              <ProtectedRoute allowedRole={ROLES.STUDENT}>
                <MockInterview />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/alumni" 
            element={
              <ProtectedRoute allowedRole={ROLES.STUDENT}>
                <AlumniConnect />
              </ProtectedRoute>
            } 
          />
          <Route path="/settings" element={<Navigate to="/student/profile" />} />
          
          {/* Department Routes */}
          <Route 
            path="/department/dashboard" 
            element={
              <ProtectedRoute allowedRole={ROLES.DEPARTMENT}>
                <DeptDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/department/students" 
            element={
              <ProtectedRoute allowedRole={ROLES.DEPARTMENT}>
                <StudentManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/department/shortlist" 
            element={
              <ProtectedRoute allowedRole={ROLES.DEPARTMENT}>
                <AutoShortlist />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/department/analytics" 
            element={
              <ProtectedRoute allowedRole={ROLES.DEPARTMENT}>
                <DeptAnalytics />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/department/alumni" 
            element={
              <ProtectedRoute allowedRole={ROLES.DEPARTMENT}>
                <AlumniConnect />
              </ProtectedRoute>
            } 
          />
          
          {/* TPO Routes */}
          <Route 
            path="/tpo/dashboard" 
            element={
              <ProtectedRoute allowedRole={ROLES.TPO}>
                <TPODashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tpo/drives" 
            element={
              <ProtectedRoute allowedRole={ROLES.TPO}>
                <ManageDrives />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tpo/drives/create" 
            element={
              <ProtectedRoute allowedRole={ROLES.TPO}>
                <CreateDrive />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tpo/applicants" 
            element={
              <ProtectedRoute allowedRole={ROLES.TPO}>
                <AllApplicants />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tpo/analytics" 
            element={
              <ProtectedRoute allowedRole={ROLES.TPO}>
                <CompanyAnalytics />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tpo/alumni" 
            element={
              <ProtectedRoute allowedRole={ROLES.TPO}>
                <AlumniConnect />
              </ProtectedRoute>
            } 
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};







export default App;
