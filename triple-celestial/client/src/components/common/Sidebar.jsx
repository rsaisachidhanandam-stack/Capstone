import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';
import { 
  HiHome, HiBriefcase, HiOutlineDocumentText, HiLightningBolt,
  HiChartBar, HiOutlineMicrophone, HiUserGroup, HiCog,
  HiLogout, HiCheckCircle, HiOutlineUserAdd, HiSparkles
} from 'react-icons/hi';

const Sidebar = () => {
  const { currentUser, logout, role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const navItems = {
    [ROLES.STUDENT]: [
      { label: 'Overview', icon: HiHome, path: '/student/dashboard' },
      { label: 'Placement Drives', icon: HiBriefcase, path: '/student/drives' },
      { label: 'My Applications', icon: HiOutlineDocumentText, path: '/student/applications' },
      { label: 'Resume Analyzer', icon: HiLightningBolt, path: '/student/resume' },
      { label: 'Skill Gap', icon: HiChartBar, path: '/student/skills' },
      { label: 'Predictor', icon: HiCheckCircle, path: '/student/predictor' },
      { label: 'Mock Interview', icon: HiOutlineMicrophone, path: '/student/interview' },
      { label: 'Alumni Connect', icon: HiUserGroup, path: '/student/alumni' },
    ],
    [ROLES.DEPARTMENT]: [
      { label: 'Overview', icon: HiHome, path: '/department/dashboard' },
      { label: 'Students', icon: HiUserGroup, path: '/department/students' },
      { label: 'Auto Shortlist', icon: HiCheckCircle, path: '/department/shortlist' },
      { label: 'Analytics', icon: HiChartBar, path: '/department/analytics' },
      { label: 'Alumni Connect', icon: HiUserGroup, path: '/department/alumni' },
    ],
    [ROLES.TPO]: [
      { label: 'Overview', icon: HiHome, path: '/tpo/dashboard' },
      { label: 'Manage Drives', icon: HiBriefcase, path: '/tpo/drives' },
      { label: 'Create Drive', icon: HiOutlineUserAdd, path: '/tpo/drives/create' },
      { label: 'All Applicants', icon: HiOutlineDocumentText, path: '/tpo/applicants' },
      { label: 'Analytics', icon: HiChartBar, path: '/tpo/analytics' },
      { label: 'Alumni Connect', icon: HiUserGroup, path: '/tpo/alumni' },
    ],
  };

  const menuItems = navItems[role] || [];

  return (
    <div className="w-68 bg-[#0a0a0a] min-h-screen flex flex-col fixed left-0 top-0 text-zinc-400 z-50 border-r border-zinc-800/50">
      {/* Brand Logo */}
      <div className="p-8 pb-6">
        <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-300">
            <HiSparkles className="text-black" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-white tracking-tight leading-none">
              IntelliPlace
            </span>
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
              Enterprise AI
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-4 py-8 space-y-1 custom-scrollbar">
        <p className="px-4 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-4">Main Menu</p>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? 'bg-zinc-800/50 text-white shadow-sm border border-zinc-700/50'
                  : 'hover:bg-zinc-800/30 hover:text-zinc-200'
              }`
            }
          >
            <item.icon size={18} className={`transition-colors ${location.pathname === item.path ? 'text-blue-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
            <span className="text-[13px] font-semibold">{item.label}</span>
            {location.pathname === item.path && (
               <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
            )}
          </NavLink>
        ))}
      </div>

      {/* Account Section */}
      <div className="p-6 mt-auto border-t border-zinc-800/50 bg-zinc-900/20 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-6 px-2">
           <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
              {currentUser?.profilePicture ? (
                <img src={currentUser.profilePicture} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs font-bold text-white">{getInitials(currentUser?.name)}</span>
              )}
           </div>
           <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-white truncate">{currentUser?.name || 'User'}</h4>
              <p className="text-[10px] font-medium text-zinc-500 truncate capitalize">{role} Account</p>
           </div>
        </div>

        <div className="space-y-1">
          <button
            onClick={() => navigate('/settings')}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-zinc-800/50 text-zinc-500 hover:text-zinc-200 transition-all group"
          >
            <HiCog size={18} className="group-hover:rotate-45 transition-transform duration-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Settings</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-rose-500/10 text-zinc-500 hover:text-rose-400 transition-all"
          >
            <HiLogout size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Sign Out</span>
          </button>
        </div>
        
        <div className="flex items-center justify-between mt-6 px-2 opacity-30">
           <span className="text-[9px] font-bold text-zinc-500 tracking-widest uppercase">IntelliPlace AI v1.2</span>
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
