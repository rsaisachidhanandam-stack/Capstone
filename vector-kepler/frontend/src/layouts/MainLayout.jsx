import React, { useContext } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Briefcase, FileText, CheckCircle, Search, Users } from 'lucide-react';
import clsx from 'clsx';

const MainLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getSidebarLinks = () => {
    switch (user?.role) {
      case 'student':
        return [
          { name: 'Dashboard', path: '/student-dashboard', icon: LayoutDashboard },
          { name: 'Drives', path: '/drives', icon: Briefcase },
          { name: 'Analyzer', path: '/analyzer', icon: FileText },
          { name: 'Mock Interview', path: '/mock', icon: CheckCircle },
        ];
      case 'department':
        return [
          { name: 'Dashboard', path: '/department-dashboard', icon: LayoutDashboard },
          { name: 'Applicants', path: '/applicants', icon: Users },
          { name: 'Shortlist', path: '/shortlist', icon: Search },
        ];
      case 'tpo':
        return [
          { name: 'Dashboard', path: '/tpo-dashboard', icon: LayoutDashboard },
          { name: 'Drives', path: '/tpo/drives', icon: Briefcase },
          { name: 'Approvals', path: '/tpo/approvals', icon: CheckCircle },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex text-slate-800 dark:text-slate-100">
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">IntelliPlace</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {getSidebarLinks().map((link) => {
            const Icon = link.icon;
            return (
              <Link 
                key={link.path}
                to={link.path}
                className="flex items-center px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <Icon className="w-5 h-5 mr-3 text-slate-500 dark:text-slate-400" />
                <span className="font-medium">{link.name}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold uppercase">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="text-sm font-semibold">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </aside>
      
      <main className="flex-1 overflow-x-hidden overflow-y-auto w-full">
        {/* Mobile Header omitted for brevity */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 md:hidden">
          <span className="text-xl font-bold text-blue-600">IntelliPlace</span>
        </div>
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
