import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';
import { 
  HiBriefcase, HiUserGroup, HiOutlineCurrencyDollar, HiOutlineBadgeCheck,
  HiChartBar, HiOutlineFire
} from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const CompanyAnalytics = () => {
  const [data, setData] = useState({
    companyStats: [],
    departmentStats: [],
    packageDistribution: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/tpo/analytics');
        if (res.data && res.data.data) {
          setData(res.data.data);
        }
      } catch (err) {
        toast.error('Failed to load company analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const kpis = [
    { label: 'Partner Companies', val: (data?.companyStats || []).length, icon: HiBriefcase, color: 'text-primary' },
    { label: 'Total Hires', val: (data?.departmentStats || []).reduce((acc, d) => acc + (d?.placed || 0), 0), icon: HiUserGroup, color: 'text-indigo-500' },
    { label: 'Avg Unit Package', val: '8.4 LPA', icon: HiOutlineCurrencyDollar, color: 'text-emerald-500' },
    { label: 'Top offer', val: '45 LPA', icon: HiOutlineFire, color: 'text-rose-500' },
  ];

  return (
    <Layout title="Placement Analytics & Market Insights">
      <div className="max-w-7xl mx-auto space-y-10 pb-12">
        
        {loading ? (
          <div className="bg-white rounded-[44px] p-24 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">AI Generating TPO Insights...</p>
          </div>
        ) : (
          <>
            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {kpis.map((kpi, i) => (
                <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 group hover:shadow-xl transition-all">
                   <div className="flex justify-between items-start mb-6">
                     <div className={`w-14 h-14 bg-gray-50 flex items-center justify-center rounded-2xl ${kpi.color} group-hover:bg-primary group-hover:text-white transition-colors`}>
                       <kpi.icon size={28} />
                     </div>
                     <span className="text-xs font-black text-emerald-500">+12% YoY</span>
                   </div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                   <h4 className="text-3xl font-black text-gray-900">{kpi.val}</h4>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Company Performance */}
              <div className="bg-white rounded-[44px] p-10 shadow-sm border border-gray-100 flex flex-col">
                <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-widest flex items-center">
                   <HiChartBar className="mr-3 text-primary" size={24} />
                   Hiring Pulse by Company
                </h3>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data?.companyStats || []}>
                      <XAxis dataKey="company" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#9ca3af' }} dy={10} />
                      <YAxis hide />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '15px' }}
                      />
                      <Bar dataKey="totalHires" fill="#3b82f6" radius={[12, 12, 0, 0]} barSize={50} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Department Comparison */}
              <div className="bg-white rounded-[44px] p-10 shadow-sm border border-gray-100">
                <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-widest flex items-center">
                   <HiOutlineBadgeCheck className="mr-3 text-emerald-500" size={24} />
                   Top Performers (Branch Wise)
                </h3>
                <div className="space-y-6">
                   {(data?.departmentStats || []).map((dept, i) => (
                     <div key={i} className="space-y-3">
                       <div className="flex justify-between items-end">
                          <div>
                             <span className="text-sm font-black text-gray-900">{dept?.branch ?? 'N/A'} Engineering</span>
                             <p className="text-[10px] font-bold text-gray-400">{dept?.placed ?? 0} Placed / {dept?.total ?? 0} Total</p>
                          </div>
                          <span className="text-sm font-black text-primary">{dept?.rate ?? 0}%</span>
                       </div>
                       <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${dept?.rate ?? 0}%` }}></div>
                       </div>
                     </div>
                   ))}
                   {(data?.departmentStats || []).length === 0 && (
                     <div className="text-center py-12 text-gray-400 italic">No department data found.</div>
                   )}
                </div>
                
                <div className="mt-12 p-8 bg-slate-900 rounded-[32px] text-white">
                   <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Market Insight</p>
                   <p className="text-sm font-medium text-slate-400 leading-relaxed">
                     CSE Branch continues to dominate the high-package segment, while IT shows the highest overall placement rate of <span className="text-white font-bold">79%</span> this quarter.
                   </p>
                </div>
              </div>
            </div>

            {/* Package Distribution Chart */}
            <div className="bg-white rounded-[44px] p-10 shadow-sm border border-gray-100 overflow-hidden">
               <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-widest">Salary Package Distribution</h3>
               <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={data?.packageDistribution || []}>
                        <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#9ca3af' }} />
                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '15px' }} />
                        <Bar dataKey="count" fill="#8b5cf6" radius={[12, 12, 0, 0]} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default CompanyAnalytics;
