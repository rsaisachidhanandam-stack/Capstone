import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { 
  HiOutlineDocumentText, HiOutlineClock, HiOutlineCheckCircle, 
  HiOutlineXCircle, HiOutlineArrowNarrowRight, HiOutlineSearch, HiSparkles 
} from 'react-icons/hi';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/applications/my');
      setApplications(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load your applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'selected':
      case 'placed':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'rejected':
        return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'shortlisted':
      case 'tpo_approved':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      default:
        return 'bg-amber-50 text-amber-600 border-amber-100';
    }
  };

  const filteredApps = applications.filter(app => 
    app.drive?.company?.toLowerCase().includes(search.toLowerCase()) ||
    app.drive?.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout title="My Applications">
      <div className="max-w-7xl mx-auto space-y-8 pb-16 pt-4 animate-in fade-in duration-1000">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded">Tracking</span>
              <HiSparkles className="text-amber-500" size={14} />
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-zinc-900">Application Pipeline</h2>
            <p className="text-zinc-500 font-medium text-sm">Monitor your progress across all applied placement drives.</p>
          </div>

          <div className="relative">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input 
              type="text"
              placeholder="Filter applications..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 pr-6 py-3.5 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold text-zinc-900 focus:bg-white focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all outline-none w-full md:w-80 shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-zinc-50 rounded-[32px] animate-pulse"></div>
            ))}
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="bg-white border border-dashed border-zinc-200 rounded-[40px] p-20 text-center animate-in zoom-in duration-500">
            <div className="w-20 h-20 bg-zinc-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-zinc-300">
              <HiOutlineDocumentText size={40} />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">No applications found</h3>
            <p className="text-zinc-500 font-medium mt-2 max-w-xs mx-auto">
              {search ? "No applications matches your search criteria." : "You haven't applied to any drives yet. Exploration awaits!"}
            </p>
            {!search && (
              <button 
                onClick={() => window.location.href = '/student/drives'}
                className="mt-8 px-8 py-3.5 bg-zinc-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all active:scale-95"
              >
                Browse Drives
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredApps.map((app) => (
              <div key={app._id} className="bg-white border border-border rounded-[32px] overflow-hidden shadow-sm hover:shadow-premium transition-all group flex flex-col">
                <div className="p-8 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-black/5 group-hover:scale-110 transition-transform">
                      {app.drive?.company?.charAt(0) || 'D'}
                    </div>
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(app.status)}`}>
                      {app.status?.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-xl font-black text-zinc-900 leading-tight mb-1">{app.drive?.company}</h4>
                  <p className="text-xs font-bold text-zinc-400 border-b border-zinc-50 pb-4 mb-4 uppercase tracking-widest">{app.drive?.role}</p>
                  
                  <div className="space-y-4">
                     <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-zinc-400 uppercase tracking-widest">Applied on</span>
                        <span className="font-black text-zinc-600">{format(new Date(app.createdAt), 'MMM dd, yyyy')}</span>
                     </div>
                     <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-zinc-400 uppercase tracking-widest">Package</span>
                        <span className="font-black text-zinc-900">{app.drive?.package}</span>
                     </div>
                     <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-zinc-400 uppercase tracking-widest">Type</span>
                        <span className="font-black text-zinc-600 capitalize">{app.drive?.jobType?.replace('-', ' ')}</span>
                     </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50/50 border-t border-zinc-50 mt-auto">
                   <button 
                     onClick={() => window.location.href = `/student/drives?id=${app.drive?._id}`}
                     className="w-full py-3 bg-white border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-900 hover:bg-zinc-950 hover:text-white transition-all flex items-center justify-center group/btn"
                   >
                     Drive Details
                     <HiOutlineArrowNarrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Support Section */}
        <div className="bg-[#0a0a0a] rounded-[40px] p-10 text-white relative overflow-hidden mt-12 shadow-2xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[100px] opacity-10 -mr-32 -mt-32"></div>
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center space-x-6">
                 <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400">
                    <HiOutlineClock size={32} />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold">Automatic Status Updates</h3>
                    <p className="text-zinc-500 text-sm font-medium mt-1">Our system syncs with the TPO portal every 15 minutes.</p>
                 </div>
              </div>
              <button className="px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center">
                 Contact TPO Head
              </button>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyApplications;
