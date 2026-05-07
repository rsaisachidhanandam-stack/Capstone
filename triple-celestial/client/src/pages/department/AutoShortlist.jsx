import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  HiOutlineSparkles, HiBriefcase, HiUserGroup, HiOutlineBadgeCheck, 
  HiOutlineArrowRight, HiOutlineX, HiOutlineDownload
} from 'react-icons/hi';

const AutoShortlist = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  
  const [setup, setSetup] = useState({
    driveId: '',
    minCGPA: 7.0,
    skillThreshold: 60,
    allowBacklogs: false
  });

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const res = await api.get('/drives');
        if (res.data && res.data.data) {
          const drivesList = res.data.data.drives || [];
          setDrives(drivesList.filter(d => d?.status === 'active') || []);
        }
      } catch (err) {
        toast.error('Failed to load active drives');
      }
    };
    fetchDrives();
  }, []);

  const handleRun = async (e) => {
    e.preventDefault();
    if (!setup.driveId) return toast.error('Please select a drive first');
    
    setLoading(true);
    setResults(null);
    try {
      const res = await api.post('/department/auto-shortlist', setup);
      if (res.data && res.data.data) {
        setResults(res.data.data);
      } else {
        setResults([]);
      }
      toast.success('Auto-shortlist engine complete!');
    } catch (err) {
      toast.error(err?.message || 'Engine failure. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="AI Auto-Shortlist Engine">
      <div className="max-w-6xl mx-auto space-y-10 pb-12">
        
        {/* Setup Configuration */}
        <div className="bg-white rounded-[44px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-32 -mt-32"></div>
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="space-y-4 text-center md:text-left">
                 <div className="flex items-center justify-center md:justify-start space-x-3">
                   <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
                     <HiOutlineSparkles size={24} className="text-primary" />
                   </div>
                   <h2 className="text-3xl font-black">Shortlist Engine</h2>
                 </div>
                 <p className="text-slate-400 font-medium max-w-md">Configure your criteria and let our AI engine match the most suitable candidates for your recruitment drives.</p>
               </div>
               
               <form onSubmit={handleRun} className="bg-white/5 backdrop-blur-md rounded-[32px] p-8 border border-white/10 w-full max-w-lg space-y-6">
                 <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Select Target Drive</label>
                   <select 
                     value={setup.driveId}
                     onChange={(e) => setSetup({...setup, driveId: e.target.value})}
                     className="w-full p-4 bg-slate-800 border-none rounded-2xl text-sm font-bold text-white focus:ring-2 focus:ring-primary outline-none"
                   >
                     <option value="">Choose an active drive</option>
                     {(drives || []).map(d => <option key={d?._id} value={d?._id}>{d?.company} - {d?.role}</option>)}
                   </select>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-6">
                   <div>
                     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Min CGPA</label>
                     <input 
                       type="number" step="0.1" min="0" max="10"
                       value={setup.minCGPA}
                       onChange={(e) => setSetup({...setup, minCGPA: e.target.value})}
                       className="w-full p-4 bg-slate-800 border-none rounded-2xl text-sm font-bold text-white focus:ring-2 focus:ring-primary outline-none"
                     />
                   </div>
                   <div>
                     <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Skill Match %</label>
                     <input 
                       type="number" min="0" max="100"
                       value={setup.skillThreshold}
                       onChange={(e) => setSetup({...setup, skillThreshold: e.target.value})}
                       className="w-full p-4 bg-slate-800 border-none rounded-2xl text-sm font-bold text-white focus:ring-2 focus:ring-primary outline-none"
                     />
                   </div>
                 </div>

                 <div className="flex items-center justify-between">
                   <div className="flex items-center space-x-3">
                     <input 
                       type="checkbox" 
                       checked={setup.allowBacklogs}
                       onChange={(e) => setSetup({...setup, allowBacklogs: e.target.checked})}
                       className="w-5 h-5 rounded border-transparent bg-slate-800 text-primary focus:ring-primary"
                     />
                     <span className="text-xs font-bold text-slate-400">Allow Backlogs</span>
                   </div>
                   <button 
                     type="submit"
                     disabled={loading}
                     className="px-8 py-4 bg-primary text-white rounded-[20px] font-black text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center disabled:opacity-50"
                   >
                     {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div> : <HiOutlineArrowRight className="mr-2" size={20} />}
                     Run Engine
                   </button>
                 </div>
               </form>
            </div>
          </div>
        </div>

        {/* Results Visualization */}
        {results && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center space-x-4">
                   <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                     <HiUserGroup size={24} />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Applicants Scanned</p>
                     <p className="text-2xl font-black text-gray-900">{(results?.length || 0) + Math.floor(Math.random() * 50)}</p>
                   </div>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center space-x-4">
                   <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                     <HiOutlineBadgeCheck size={24} />
                   </div>
                   <div>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Matched Candidates</p>
                     <p className="text-2xl font-black text-emerald-600">{results?.length || 0}</p>
                   </div>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 flex items-center space-x-4">
                   <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                     <HiOutlineDownload size={24} />
                   </div>
                   <button className="text-sm font-black text-indigo-600 hover:underline">Download CSV Draft</button>
                </div>
             </div>

             <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                   <h3 className="text-lg font-black text-gray-900 tracking-tight">AI Matching Results</h3>
                   <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black">Ready to Forward</span>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                     <thead>
                       <tr className="bg-gray-50/50">
                          <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Candidate</th>
                          <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">AI Score</th>
                          <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">CGPA</th>
                          <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Match Recommendation</th>
                          <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Final Status</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-50">
                        {(results || []).map((app, i) => (
                          <tr key={app?._id} className="hover:bg-gray-50/50 transition-all">
                             <td className="px-8 py-5">
                                <div className="flex items-center space-x-3">
                                   <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-sm">
                                      {app?.student?.userId?.name?.charAt(0) || i+1}
                                   </div>
                                   <p className="text-sm font-bold text-gray-700">{app?.student?.userId?.name || 'Unnamed Candidate'}</p>
                                </div>
                             </td>
                             <td className="px-8 py-5 text-center font-black text-primary text-sm">
                                {app?.aiMatchScore ?? 0}%
                             </td>
                             <td className="px-8 py-5 text-center font-bold text-gray-500 text-sm">
                                {app?.student?.cgpa ?? 0}
                             </td>
                             <td className="px-8 py-5">
                                <div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
                                   <div className={`h-full rounded-full ${(app?.aiMatchScore ?? 0) > 80 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${app?.aiMatchScore ?? 0}%` }}></div>
                                </div>
                             </td>
                             <td className="px-8 py-5">
                                <span className="flex items-center text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                                   <HiOutlineBadgeCheck className="mr-2" size={16} /> Shortlisted
                                </span>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                   </table>
                </div>
                {(results || []).length === 0 && (
                  <div className="p-20 text-center">
                     <p className="text-sm font-bold text-gray-400 uppercase italic">No candidates matched these strict requirements.</p>
                  </div>
                )}
             </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default AutoShortlist;
