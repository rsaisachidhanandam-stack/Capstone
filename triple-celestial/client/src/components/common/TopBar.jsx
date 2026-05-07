import React, { useState, useEffect } from 'react';
import { 
  HiBell, HiSearch, HiChevronDown, HiOutlineMailOpen, 
  HiOutlineTrash, HiOutlineBadgeCheck, HiOutlineExclamationCircle,
  HiOutlineSpeakerphone, HiOutlineCalendar, HiOutlineX, HiSparkles
} from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

const TopBar = ({ title }) => {
  const { currentUser, role, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data.data.notifications);
      setUnreadCount(res.data.data.unreadCount);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      fetchNotifications();
      toast.success('All marked as read');
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotification = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      fetchNotifications();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'tpo_approved': return <HiOutlineBadgeCheck className="text-emerald-500" />;
      case 'tpo_rejected': return <HiOutlineX className="text-rose-500" />;
      case 'drive_announced': return <HiOutlineSpeakerphone className="text-blue-500" />;
      case 'interview_scheduled': return <HiOutlineCalendar className="text-purple-500" />;
      default: return <HiOutlineExclamationCircle className="text-amber-500" />;
    }
  };

  return (
    <div className="h-16 bg-white/80 backdrop-blur-xl border-b border-zinc-100 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center space-x-1">
        <h2 className="text-sm font-bold text-zinc-900 tracking-tight flex items-center">
          <span className="text-zinc-400 font-medium mr-2">Pages</span>
          <span className="text-zinc-300 mr-2">/</span>
          {title}
        </h2>
      </div>

      <div className="flex items-center space-x-5">
        {/* Search */}
        <div className="hidden md:flex items-center bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-zinc-100 transition-all">
          <HiSearch className="text-zinc-400" size={16} />
          <input 
            type="text" 
            placeholder="Search commands..." 
            className="bg-transparent border-none focus:ring-0 text-[13px] font-medium text-zinc-900 ml-2 w-48 placeholder-zinc-400 outline-none"
          />
          <span className="text-[10px] font-bold text-zinc-300 border border-zinc-200 rounded px-1.5 py-0.5 ml-2">⌘K</span>
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-2 border-r border-zinc-100 pr-5">
           <button className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg transition-all">
              <HiSparkles size={20} />
           </button>
           
           {/* Notifications */}
           <div className="relative">
             <button 
               className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all relative ${showNotifications ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50'}`}
               onClick={() => setShowNotifications(!showNotifications)}
             >
               <HiBell size={20} />
               {unreadCount > 0 && (
                 <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-500 border-2 border-white rounded-full"></span>
               )}
             </button>

             {/* Notifications Dropdown */}
             {showNotifications && (
               <>
                 <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
                 <div className="absolute right-0 mt-3 w-[400px] bg-white border border-border rounded-2xl shadow-premium z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                   <div className="p-5 border-b border-zinc-50 flex items-center justify-between">
                     <h3 className="font-bold text-zinc-900 text-sm">Notifications</h3>
                     {unreadCount > 0 && (
                       <button 
                         onClick={markAllAsRead}
                         className="text-[11px] font-bold text-zinc-500 hover:text-zinc-900 transition-colors flex items-center"
                       >
                         Mark all read
                       </button>
                     )}
                   </div>
                   
                   <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                     {notifications.length > 0 ? (
                       notifications.map((n) => (
                         <div 
                           key={n._id} 
                           onClick={() => markAsRead(n._id)}
                           className={`p-4 border-b border-zinc-50 flex items-start space-x-4 cursor-pointer transition-all hover:bg-zinc-50 group ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                         >
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${!n.isRead ? 'bg-white shadow-sm border border-blue-100' : 'bg-zinc-50'}`}>
                             {getNotificationIcon(n.type)}
                           </div>
                           <div className="flex-1 space-y-0.5 min-w-0">
                             <div className="flex justify-between items-start">
                                <p className={`text-[13px] truncate pr-4 ${!n.isRead ? 'font-bold text-zinc-900' : 'font-semibold text-zinc-600'}`}>{n.title}</p>
                                <button 
                                  onClick={(e) => deleteNotification(e, n._id)}
                                  className="text-zinc-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                                >
                                   <HiOutlineTrash size={14} />
                                </button>
                             </div>
                             <p className="text-[12px] text-zinc-500 font-medium line-clamp-2 leading-relaxed">{n.message}</p>
                             <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest pt-1.5 flex items-center">
                               {formatDistanceToNow(new Date(n.createdAt))} ago
                               {!n.isRead && <span className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full"></span>}
                             </p>
                           </div>
                         </div>
                       ))
                     ) : (
                       <div className="p-16 text-center text-zinc-400">
                         <HiOutlineMailOpen size={40} className="mx-auto mb-4 opacity-20" />
                         <p className="font-bold text-[11px] tracking-[0.1em] uppercase">No new alerts</p>
                       </div>
                     )}
                   </div>
                   {notifications.length > 0 && (
                      <div className="p-3 bg-zinc-50/50 text-center border-t border-zinc-50">
                         <button className="text-[11px] font-bold text-zinc-500 hover:text-zinc-900 transition-colors">Clear all history</button>
                      </div>
                   )}
                 </div>
               </>
             )}
           </div>
        </div>

        {/* User Profile */}
        <div className="relative">
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white font-black text-[11px] group-hover:scale-105 transition-transform overflow-hidden shadow-sm">
              {currentUser?.profilePicture ? (
                <img src={currentUser.profilePicture} alt="User" className="w-full h-full object-cover" />
              ) : (
                getInitials(currentUser?.name)
              )}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-zinc-900 flex items-center">
                {currentUser?.name || 'User'}
                <HiChevronDown className={`ml-1 text-zinc-400 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} size={14} />
              </p>
            </div>
          </div>

          {/* Profile Dropdown */}
          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
              <div className="absolute right-0 mt-3 w-56 bg-white border border-border rounded-2xl shadow-premium z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-zinc-50 mb-1">
                   <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Signed in as</p>
                   <p className="text-[13px] font-bold text-zinc-900 truncate">{currentUser?.email}</p>
                </div>
                <button 
                  onClick={() => {
                    const profilePath = role === 'student' ? '/student/profile' : '/settings';
                    window.location.href = profilePath;
                  }}
                  className="w-full text-left px-4 py-2 text-[13px] font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors flex items-center"
                >
                  View Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-[13px] font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
                  System Settings
                </button>
                <div className="h-px bg-zinc-50 my-1 mx-2"></div>
                <button 
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-[13px] font-bold text-rose-500 hover:bg-rose-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
