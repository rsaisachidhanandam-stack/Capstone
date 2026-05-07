import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  HiOutlineClipboardCheck, HiOutlineDocumentSearch, HiAcademicCap, 
  HiTrendingUp, HiOutlineLightBulb, HiOutlineStar, HiOutlineArrowNarrowRight, HiSparkles
} from 'react-icons/hi';

const StudentDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalApplied: 0,
    shortlisted: 0,
    matchRate: 0,
    interviewScore: 0,
    resumeScore: 0,
    placementProbability: 0,
    placementStatus: 'unplaced'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/students/dashboard-stats');
        setStats(res.data.data || stats);
      } catch (err) {
        toast.error('Complete your profile to view dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Layout title="Dashboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  const kpis = [
    { label: 'Applications', value: stats?.totalApplied ?? 0, icon: HiOutlineClipboardCheck, color: 'text-zinc-900', bg: 'bg-zinc-50' },
    { label: 'Shortlisted', value: stats?.shortlisted ?? 0, icon: HiOutlineStar, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'AI Match Rate', value: `${stats?.matchRate ?? 0}%`, icon: HiTrendingUp, color: 'text-blue-500', bg: 'bg-blue-50/50' },
    { label: 'Placement Prob.', value: `${stats?.placementProbability ?? 0}%`, icon: HiOutlineLightBulb, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <Layout title="Dashboard">
      <div className="max-w-7xl mx-auto space-y-10 pb-16 pt-4 animate-in fade-in duration-1000">
        
        {/* Welcome Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 relative bg-[#0a0a0a] rounded-[32px] p-10 text-white overflow-hidden shadow-2xl flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[150px] opacity-10 -mr-64 -mt-64"></div>
              <div className="relative z-10 space-y-4">
                 <div className="flex items-center space-x-2">
                    <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">Student Portal</span>
                    <HiSparkles className="text-blue-400" size={14} />
                 </div>
                 <h2 className="text-white text-5xl font-extrabold tracking-tight leading-tight max-w-lg">
                    Good morning, <br />
                    <span className="text-white font-black">{currentUser?.name?.split(' ')[0] || 'User'}</span>.
                 </h2>
                 <p className="text-gray-300 text-lg font-medium leading-relaxed max-w-md">
                   You have <span className="text-white font-bold">{stats?.totalApplied}</span> active applications in the queue. 
                   Your profile is looking <span className="text-emerald-400 font-bold italic">prime</span> for the upcoming season.
                 </p>
              </div>
              <div className="relative z-10 pt-12 flex items-center space-x-6">
                 <button className="bg-white text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center group shadow-xl shadow-white/5">
                    Launch Resume Analyzer
                    <HiOutlineArrowNarrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                 </button>
                 <div className="flex items-center space-x-2 text-zinc-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">System Ready</span>
                 </div>
              </div>
           </div>

           <div className="bg-white border border-border rounded-[32px] p-10 flex flex-col justify-between shadow-sm relative overflow-hidden group">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-zinc-950 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/10 group-hover:rotate-6 transition-transform">
                    <HiOutlineDocumentSearch size={28} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">ATS Readiness</p>
                    <p className="text-xs font-bold text-zinc-900 mt-1">High Accuracy</p>
                  </div>
                </div>
                <h3 className="text-2xl font-black text-zinc-900 mb-2">Resume Score</h3>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">Your resume is parsed better than 84% of candidates in the CSE batch.</p>
              </div>
              
              <div className="pt-8">
                 <div className="flex items-end justify-between mb-2">
                    <span className="text-4xl font-black text-zinc-900">{stats?.resumeScore ?? 0}<span className="text-zinc-300 text-xl">/100</span></span>
                    <span className="text-emerald-500 font-black text-xs uppercase tracking-widest flex items-center">
                       <HiTrendingUp className="mr-1" />+12% vs last
                    </span>
                 </div>
                 <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-950 transition-all duration-1000" style={{ width: `${stats?.resumeScore ?? 0}%` }}></div>
                 </div>
              </div>
           </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white p-8 rounded-[28px] shadow-sm border border-zinc-100 group hover:border-zinc-300 transition-all relative overflow-hidden">
               <div className={`w-12 h-12 ${kpi.bg} ${kpi.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                 <kpi.icon size={24} />
               </div>
               <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{kpi.label}</p>
               <h4 className="text-3xl font-black text-zinc-900 tracking-tighter">{kpi.value}</h4>
               
               {/* Sytle element */}
               <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-zinc-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>

        {/* Detailed Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           <div className="lg:col-span-8 bg-white border border-border rounded-[40px] p-10 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                 <div>
                    <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Technical Proficiency Radar</h3>
                    <p className="text-zinc-500 font-medium text-sm">Real-time mapping of your current skill strengths across major domains.</p>
                 </div>
                 <button className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-black transition-colors">History Log</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div className="space-y-8">
                    <div className="space-y-3">
                       <div className="flex justify-between">
                          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Industry Alignment</span>
                          <span className="text-xs font-black text-blue-500">{stats?.matchRate ?? 0}%</span>
                       </div>
                       <div className="h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${stats?.matchRate ?? 0}%` }}></div>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <div className="flex justify-between">
                          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Interview Resilience</span>
                          <span className="text-xs font-black text-emerald-500">{stats?.interviewScore ?? 0}%</span>
                       </div>
                       <div className="h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${stats?.interviewScore ?? 0}%` }}></div>
                       </div>
                    </div>
                    <div className="space-y-3">
                       <div className="flex justify-between">
                          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">Placement Momentum</span>
                          <span className="text-xs font-black text-amber-500">{stats?.placementProbability ?? 0}%</span>
                       </div>
                       <div className="h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full transition-all duration-1000" style={{ width: `${stats?.placementProbability ?? 0}%` }}></div>
                       </div>
                    </div>
                 </div>

                 <div className="bg-[#fcfcfc] border border-dashed border-zinc-200 p-8 rounded-[32px] flex flex-col justify-between">
                    <div>
                       <div className="flex items-center space-x-2 mb-4 text-zinc-400">
                          <HiOutlineLightBulb size={20} />
                          <span className="text-[10px] font-black uppercase tracking-widest">AI Agent Analysis</span>
                       </div>
                       <p className="text-zinc-600 text-[13px] font-medium leading-relaxed italic">
                         "Your current match rate is significantly higher for Backend roles. We recommend participating in the upcoming Fintech drives for maximum conversion probability."
                       </p>
                    </div>
                    <button className="text-xs font-bold text-blue-500 hover:text-blue-700 mt-6 underline underline-offset-4 flex animate-pulse">View Recommended Paths</button>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-4 space-y-8">
              <div className="bg-white border border-border rounded-[32px] p-8 shadow-sm flex flex-col items-center text-center group transition-all">
                 <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[24px] flex items-center justify-center mb-6 rotate-3 group-hover:rotate-0 transition-transform shadow-lg shadow-emerald-500/10">
                    <HiAcademicCap size={44} />
                 </div>
                 <h3 className="text-xl font-bold text-zinc-900 mb-2">Elite Track Access</h3>
                 <p className="text-sm font-medium text-zinc-500 mb-8 px-4">Your current standing allows access to Tier-1 recruitment circles.</p>
                 <button className="w-full py-4 border border-zinc-200 text-zinc-900 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-50 transition-all active:scale-95">
                    Request Referral
                 </button>
              </div>

              <div className="bg-zinc-50 border border-zinc-100 rounded-[32px] p-8 shadow-sm relative overflow-hidden group hover:bg-white transition-colors duration-500">
                 <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Upcoming Drive</span>
                    <span className="bg-white px-2 py-1 rounded text-[9px] font-bold text-zinc-500 border border-border">TODAY</span>
                 </div>
                 <h4 className="text-lg font-black text-zinc-900">Adobe Systems</h4>
                 <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-tighter">Deadline in 4 hours</p>
                 <button className="mt-6 w-full py-4 bg-zinc-950 text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center">
                    Apply Now
                 </button>
              </div>
           </div>
        </div>

      </div>
    </Layout>
  );
};

export default StudentDashboard;
