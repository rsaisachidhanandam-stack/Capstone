import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  HiChartBar, HiOutlineCurrencyDollar, HiTrendingUp, HiOutlineFire,
  HiUserGroup, HiOutlineBadgeCheck, HiOutlineArrowUp
} from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const DeptAnalytics = () => {
  const [data, setData] = useState({
    placementRate: 0,
    avgPackage: '0 LPA',
    highestPackage: '0 LPA',
    trend: [],
    topStudents: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/department/analytics');
        if (res.data && res.data.data) {
          setData(res.data.data);
        }
      } catch (err) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  const highlights = [
    { label: 'Placement Rate', val: `${data?.placementRate ?? 0}%`, icon: HiTrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Avg Package', val: data?.avgPackage ?? '0 LPA', icon: HiOutlineCurrencyDollar, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Highest Offer', val: data?.highestPackage ?? '0 LPA', icon: HiOutlineFire, color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: 'Active Students', val: '240', icon: HiUserGroup, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <Layout title="Placement Analytics Dashboard">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        
        {loading ? (
          <div className="bg-white rounded-[40px] p-24 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">AI Generating Analytics...</p>
          </div>
        ) : (
          <>
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {highlights.map((h, i) => (
                <div key={i} className="bg-white p-8 rounded-[36px] shadow-sm border border-gray-100 flex items-center space-x-5 hover:shadow-lg transition-all">
                  <div className={`w-14 h-14 ${h.bg} ${h.color} rounded-2xl flex items-center justify-center`}>
                    <h.icon size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{h.label}</p>
                    <div className="flex items-end space-x-2">
                      <p className={`text-2xl font-black ${h.color}`}>{h.val}</p>
                      <HiOutlineArrowUp size={14} className="text-emerald-500 mb-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Monthly Trend Chart */}
              <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-widest flex items-center px-2">
                  <HiChartBar className="mr-3 text-primary" size={24} />
                  Monthly Placement Trend
                </h3>
                <div className="h-[350px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.trend || []}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#9ca3af' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#9ca3af' }} />
                      <Tooltip 
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '15px' }}
                      />
                      <Bar dataKey="placed" fill="#3b82f6" radius={[10, 10, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Students Table */}
              <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100">
                <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-widest flex items-center">
                  <HiOutlineBadgeCheck className="mr-3 text-emerald-500" size={24} />
                  Top Performers
                </h3>
                <div className="space-y-4">
                   {(data?.topStudents || []).map((student, i) => (
                     <div key={i} className="flex items-center justify-between p-5 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all rounded-[28px] border border-transparent hover:border-gray-100">
                        <div className="flex items-center space-x-4">
                           <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>
                              {i + 1}
                           </span>
                           <div>
                              <p className="text-sm font-bold text-gray-900">{student?.userId?.name ?? 'Unknown Student'}</p>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{student?.branch ?? 'N/A'}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-black text-primary">{student?.cgpa ?? 0} CGPA</p>
                           <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Master Profile</p>
                        </div>
                     </div>
                   ))}
                   {(data?.topStudents || []).length === 0 && (
                     <div className="text-center py-12 text-gray-400 italic">No top students data found.</div>
                   )}
                </div>
                <button className="w-full mt-6 py-4 bg-gray-50 text-gray-400 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-gray-100 hover:text-gray-600 transition-all">
                  Download Full Report
                </button>
              </div>
            </div>

            {/* Forward History Section */}
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-8 border-b border-gray-50">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest leading-none">Recent Shortlist Actions</h3>
                  <p className="text-xs text-gray-400 font-medium mt-2">Historical data of student profiles forwarded to the Central TPO.</p>
               </div>
               
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead>
                     <tr className="bg-gray-50/50">
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Drive</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Selection Criteria</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Batch Size</th>
                        <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Approval Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50">
                      <tr className="hover:bg-gray-50/30">
                        <td className="px-8 py-5">
                           <p className="text-sm font-bold text-gray-900">Microsoft - AI Engineer</p>
                           <p className="text-[10px] text-gray-400 font-medium mt-1">Applied Oct 12, 2025</p>
                        </td>
                        <td className="px-8 py-5">
                           <span className="px-3 py-1 bg-blue-50 text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-tighter mr-2">CGPA &gt; 8</span>
                           <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-black uppercase tracking-tighter">Python/AI</span>
                        </td>
                        <td className="px-8 py-5 text-center font-black text-gray-700">18</td>
                        <td className="px-8 py-5 text-center">
                           <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Approved</span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50/30">
                        <td className="px-8 py-5">
                           <p className="text-sm font-bold text-gray-900">Adobe - Full Stack</p>
                           <p className="text-[10px] text-gray-400 font-medium mt-1">Applied Sep 28, 2025</p>
                        </td>
                        <td className="px-8 py-5">
                           <span className="px-3 py-1 bg-blue-50 text-blue-500 rounded-lg text-[10px] font-black uppercase tracking-tighter mr-2">Auto-AI Match</span>
                        </td>
                        <td className="px-8 py-5 text-center font-black text-gray-700">22</td>
                        <td className="px-8 py-5 text-center">
                           <span className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Under Review</span>
                        </td>
                      </tr>
                   </tbody>
                 </table>
               </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default DeptAnalytics;
