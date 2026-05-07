import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  HiOutlineBriefcase, HiOutlineUserGroup, HiOutlineCheckCircle, 
  HiOutlineTrendingUp, HiOutlineCurrencyDollar, HiOutlineOfficeBuilding,
  HiOutlineChevronRight, HiOutlineSearch, HiSparkles, HiOutlineArrowSmUp
} from 'react-icons/hi';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area 
} from 'recharts';

const TPODashboard = () => {
  const [stats, setStats] = useState({
    activeDrives: 0,
    totalApplicants: 0,
    totalShortlisted: 0,
    placementRate: 0,
    monthlyGrowth: 0,
    avgPackage: '0 LPA',
    highestPackage: '0 LPA',
    recentDrives: [],
    forwardedStudents: [],
    topCompanies: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/tpo/dashboard');
        // If your API returns data wrap in data.data check
        const dashboardData = res.data.data || res.data;
        setStats(prev => ({ ...prev, ...dashboardData }));
      } catch (err) {
        toast.error('Failed to load TPO dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Layout title="TPO Dashboard">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-zinc-100 border-t-zinc-900 rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  const kpis = [
    { label: 'Active Drives', value: stats?.activeDrives ?? 0, icon: HiOutlineBriefcase, trend: '+2 this month', color: 'text-zinc-900', bg: 'bg-zinc-50' },
    { label: 'Total Applicants', value: stats?.totalApplicants ?? 0, icon: HiOutlineUserGroup, trend: '+14% growth', color: 'text-blue-500', bg: 'bg-blue-50/50' },
    { label: 'Avg. Package', value: stats?.avgPackage ?? '0 LPA', icon: HiOutlineCurrencyDollar, trend: '+L8% YoY', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Placement Rate', value: `${stats?.placementRate ?? 0}%`, icon: HiOutlineTrendingUp, trend: 'Ahead of target', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <Layout title="TPO Control Center">
      <div className="max-w-7xl mx-auto space-y-8 pb-16 pt-4 animate-in fade-in duration-1000">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
           <div>
              <div className="flex items-center space-x-2 mb-2">
                 <span className="px-2 py-0.5 bg-zinc-900 text-white text-[9px] font-black uppercase tracking-widest rounded">Admin Access</span>
                 <HiSparkles className="text-amber-500" size={14} />
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight text-neutral-900">Placement Overview</h2>
              <p className="text-zinc-500 font-medium text-sm mt-1">Strategic command center for campus recruitment and industry relations.</p>
           </div>
           <div className="flex items-center space-x-3">
              <button className="px-5 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-50 transition-all">Export JSON</button>
              <button className="px-5 py-2.5 bg-zinc-950 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-xl shadow-black/10 hover:bg-zinc-800">Generate Report</button>
           </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white p-7 rounded-[28px] shadow-sm border border-zinc-100 group hover:border-zinc-300 transition-all bg-gradient-to-br from-white to-zinc-50/10">
               <div className="flex justify-between items-start mb-4">
                  <div className={`w-11 h-11 ${kpi.bg} ${kpi.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <kpi.icon size={22} />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">Live Data</span>
               </div>
               <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{kpi.label}</p>
               <h4 className="text-2xl font-black text-zinc-900 tracking-tight">{kpi.value}</h4>
               <p className={`text-[11px] font-bold mt-3 flex items-center ${kpi.trend.includes('+') ? 'text-emerald-500' : 'text-zinc-400'}`}>
                  {kpi.trend.includes('+') && <HiOutlineArrowSmUp className="mr-0.5" />}
                  {kpi.trend}
               </p>
            </div>
          ))}
        </div>

        {/* Level 2: Visualization and Approvals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           {/* Chart Section */}
           <div className="lg:col-span-8 bg-white border border-border rounded-[32px] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h3 className="text-lg font-black text-zinc-900 tracking-tight">Placement Performance</h3>
                    <p className="text-xs font-medium text-zinc-500">Monthly breakdown of student placements vs industry outreach.</p>
                 </div>
                 <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1.5 mr-4">
                       <div className="w-2 h-2 rounded-full bg-zinc-900"></div>
                       <span className="text-[10px] font-bold text-zinc-400 uppercase">Placements</span>
                    </div>
                    <select className="text-[11px] font-bold bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-1.5 focus:outline-none">
                       <option>Last 6 Months</option>
                       <option>Last Academic Year</option>
                    </select>
                 </div>
              </div>

              <div className="h-[340px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.topCompanies || [
                    { name: 'IBM', salary: 12, placements: 45 },
                    { name: 'Google', salary: 45, placements: 5 },
                    { name: 'Adobe', salary: 32, placements: 12 },
                    { name: 'Amazon', salary: 28, placements: 22 },
                    { name: 'Infosys', salary: 6, placements: 120 },
                  ]}>
                    <defs>
                      <linearGradient id="colorPlacements" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#000000" stopOpacity={0.08}/>
                        <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }}
                       dy={10}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }}
                    />
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Area 
                       type="monotone" 
                       dataKey="placements" 
                       stroke="#000000" 
                       strokeWidth={3}
                       fillOpacity={1} 
                       fill="url(#colorPlacements)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Approval Queue / Sidebar */}
           <div className="lg:col-span-4 space-y-8">
              <div className="bg-[#0a0a0a] rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between h-full">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-[80px] -mr-24 -mt-24"></div>
                 <div className="relative z-10">
                    <div className="flex items-center space-x-2 text-zinc-500 mb-6 font-black uppercase text-[10px] tracking-widest">
                       <HiOutlineCheckCircle size={16} />
                       <span>Approval Queue</span>
                    </div>
                    <h3 className="text-4xl font-extrabold tracking-tight mb-4">
                       {stats?.forwardedStudents?.length ?? 0} <span className="text-zinc-500 font-medium">Pending</span>
                    </h3>
                    <p className="text-zinc-500 text-sm font-medium leading-relaxed mb-10">Candidates forwarded from Dept Head await your final verification.</p>
                 </div>
                 <button className="relative z-10 w-full py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2 group">
                    <span>Review All Candidates</span>
                    <HiOutlineChevronRight className="group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
           </div>
        </div>

        {/* Level 3: Recent Activity and Top Companies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Section: Upcoming Drives */}
           <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-zinc-900 font-black tracking-tight flex items-center">
                    <HiOutlineOfficeBuilding className="mr-2 text-zinc-400" />
                    Scheduled Drives
                 </h3>
                 <button className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-black">View Calendar</button>
              </div>
              <div className="space-y-4">
                 {(stats?.recentDrives || []).length > 0 ? (stats?.recentDrives || []).slice(0, 4).map((drive, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-zinc-50 transition-colors border border-transparent hover:border-zinc-100 group">
                       <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white font-black text-sm">
                             {drive?.company?.charAt(0)}
                          </div>
                          <div>
                             <h4 className="text-sm font-bold text-zinc-900">{drive?.company}</h4>
                             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{drive?.role}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xs font-black text-zinc-900">{drive?.package}</p>
                          <p className="text-[10px] font-bold text-emerald-500 uppercase">{drive?.applicantsCount ?? 0} Applicants</p>
                       </div>
                    </div>
                 )) : (
                    <div className="py-12 text-center">
                       <p className="text-zinc-400 font-bold uppercase text-[10px] tracking-widest">No drives scheduled</p>
                    </div>
                 )}
              </div>
           </div>

           {/* Section: Student Activity */}
           <div className="bg-white border border-zinc-100 rounded-[32px] p-8 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                 <h3 className="text-zinc-900 font-black tracking-tight flex items-center">
                    <HiOutlineUserGroup className="mr-2 text-zinc-400" />
                    Placement Activity
                 </h3>
                 <div className="relative">
                    <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={12} />
                    <input type="text" placeholder="Search students..." className="bg-zinc-50 text-[10px] pr-3 pl-8 py-2 rounded-lg border-none focus:ring-1 focus:ring-zinc-200 outline-none w-32" />
                 </div>
              </div>
              
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-zinc-50">
                          <th className="pb-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Candidate</th>
                          <th className="pb-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest">Company</th>
                          <th className="pb-4 text-[10px] font-black text-zinc-400 uppercase tracking-widest text-right">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-50">
                       {(stats?.forwardedStudents || []).slice(0, 5).map((stu, i) => (
                          <tr key={i} className="group hover:bg-zinc-50 transition-colors">
                             <td className="py-4">
                                <span className="text-[13px] font-bold text-zinc-800">{stu?.studentName}</span>
                                <p className="text-[10px] font-medium text-zinc-400">{stu?.rollNumber}</p>
                             </td>
                             <td className="py-4">
                                <span className="text-[13px] font-bold text-zinc-600">{stu?.company}</span>
                             </td>
                             <td className="py-4 text-right">
                                <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase rounded-lg">Checking</span>
                             </td>
                          </tr>
                       ))}
                       {(stats?.forwardedStudents || []).length === 0 && (
                          <tr><td colSpan="3" className="py-12 text-center text-zinc-400 italic text-sm">No recent activity detected</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

      </div>
    </Layout>
  );
};

export default TPODashboard;
