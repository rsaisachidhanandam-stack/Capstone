import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import DepartmentDashboard from './DepartmentDashboard';
import TpoDashboard from './TpoDashboard';

const DashboardRouter = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  switch (user.role) {
    case 'student':
      return <StudentDashboard />;
    case 'department':
      return <DepartmentDashboard />;
    case 'tpo':
      return <TpoDashboard />;
    default:
      return <div>Role not recognized</div>;
  }
};

export default DashboardRouter;
