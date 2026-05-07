import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardRouter from './pages/DashboardRouter';

const ProtectedRoute = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route path="/" element={<DashboardRouter />} />
            <Route path="/student-dashboard" element={<DashboardRouter />} />
            <Route path="/department-dashboard" element={<DashboardRouter />} />
            <Route path="/tpo-dashboard" element={<DashboardRouter />} />
            <Route path="/drives" element={<DashboardRouter />} />
            <Route path="/analyzer" element={<DashboardRouter />} />
            <Route path="/mock" element={<DashboardRouter />} />
            <Route path="/applicants" element={<DashboardRouter />} />
            <Route path="/shortlist" element={<DashboardRouter />} />
            <Route path="/tpo/drives" element={<DashboardRouter />} />
            <Route path="/tpo/approvals" element={<DashboardRouter />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;