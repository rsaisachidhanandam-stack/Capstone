import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  HiUserGroup, HiOutlineDocumentText, HiOutlineCheckCircle, 
  HiChartPie, HiLightningBolt, HiBriefcase,
  HiOutlineArrowRight, HiOutlineSparkles
} from 'react-icons/hi';

const DepartmentDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalApplicants: 0,
    shortlisted: 0,
    shortlistPercentage: 0,
    avgMatchScore: 0,
    recentDrives: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/department/dashboard');
        if (res.data && res.data.data) {
          setStats(res.data.data);
        }
      } catch (err) {
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const kpis = [
    { label: 'Total Students', value: stats?.totalStudents ?? 0, icon: HiUserGroup, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Applicants', value: stats?.totalApplicants ?? 0, icon: HiOutlineDocumentText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Shortlisted', value: stats?.shortlisted ?? 0, icon: HiOutlineCheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Shortlist %', value: `${stats?.shortlistPercentage ?? 0}%`, icon: HiChartPie, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Avg Match %', value: `${stats?.avgMatchScore ?? 0}%`, icon: HiLightningBolt, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  ];

  return (
    <Layout title="Department Command Center">
      <div className="max-w-7xl mx-auto space-y-10 pb-12">
        
        {loading ? (
          <div className="bg-white rounded-[40px] p-24 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Department Insights...</p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {kpis.map((kpi, i) => (
                <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex flex-col items-center text-center group hover:shadow-lg transition-all">
                  <div className={`w-14 h-14 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <kpi.icon size={28} />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                  <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Drives Section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-gray-900 flex items-center">
                    <HiBriefcase className="mr-3 text-primary" size={24} />
                    Recent Placement Drives
                  </h3>
                  <Link to="/department/students" className="text-sm font-bold text-primary hover:underline">View All Students &rarr;</Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(stats?.recentDrives || []).map((drive) => (
                    <div key={drive?._id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-md transition-all group">
                      <div className="flex justify-between items-start mb-6">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                          style={{ backgroundColor: drive?.logoColor || '#3b82f6' }}
                        >
                          {drive?.company?.charAt(0) || 'D'}
                        </div>
                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                          Active
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{drive?.company}</h4>
                      <p className="text-sm text-gray-500 font-medium mb-4">{drive?.role}</p>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Applicants</p>
                          <p className="font-bold text-gray-900">{drive?.applicants?.length || 0}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Shortlisted</p>
                          <p className="font-bold text-emerald-600">{drive?.shortlisted?.length || 0}</p>
                        </div>
                        <Link to="/department/students" className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-primary hover:text-white transition-all">
                          <HiOutlineArrowRight size={18} />
                        </Link>
                      </div>
                    </div>
                  ))}
                  {(stats?.recentDrives || []).length === 0 && (
                    <div className="col-span-2 p-10 text-center text-gray-400 font-bold uppercase text-xs">No active drives found</div>
                  )}
                </div>
              </div>

              {/* Quick Actions Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-black text-gray-900 flex items-center">
                  <HiLightningBolt className="mr-3 text-amber-500" size={24} />
                  Quick Actions
                </h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <Link to="/department/students" className="p-6 bg-white border border-gray-100 rounded-[32px] shadow-sm hover:shadow-md transition-all flex items-center space-x-6 group">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <HiUserGroup size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">Manage Students</p>
                      <p className="text-xs text-gray-500 font-medium">Verify profiles & monitor status</p>
                    </div>
                  </Link>

                  <Link to="/department/shortlist" className="p-6 bg-slate-900 text-white rounded-[32px] shadow-xl hover:-translate-y-1 transition-all flex items-center space-x-6 group border border-slate-800">
                    <div className="w-12 h-12 bg-white/10 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <HiOutlineSparkles size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold">Auto Shortlist</p>
                      <p className="text-xs text-white/50 font-medium">Run AI matching engine</p>
                    </div>
                  </Link>

                  <Link to="/department/analytics" className="p-6 bg-white border border-gray-100 rounded-[32px] shadow-sm hover:shadow-md transition-all flex items-center space-x-6 group">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <HiChartPie size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900">View Analytics</p>
                      <p className="text-xs text-gray-500 font-medium">Check monthly placement trends</p>
                    </div>
                  </Link>
                </div>

                {/* Notification Banner */}
                <div className="p-8 bg-gradient-to-br from-primary to-indigo-600 rounded-[32px] text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                   <h4 className="text-lg font-bold mb-2">Waitlisted Applicants</h4>
                   <p className="text-sm font-medium text-white/70 leading-relaxed">
                     Manage student profiles and monitor their real-time application status to ensure high placement rates.
                   </p>
                   <Link to="/department/students" className="inline-block mt-4 text-xs font-black uppercase tracking-widest bg-white text-primary px-4 py-2 rounded-xl">Action Now</Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default DepartmentDashboard;
