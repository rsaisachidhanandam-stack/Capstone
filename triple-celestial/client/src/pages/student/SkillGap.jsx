import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';
import { 
  HiOutlineAcademicCap, HiLightningBolt, HiOutlineExternalLink, 
  HiOutlineFilter, HiOutlineBadgeCheck, HiOutlineFire
} from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const SkillGap = () => {
  const [data, setData] = useState({
    matchPercentage: 0,
    matchedSkills: [],
    missingSkills: [],
    extraSkills: [],
    recommendations: [],
    readinessLevel: 'Beginner',
    radarData: [
      { category: 'DSA', score: 0 },
      { category: 'Web Dev', score: 0 },
      { category: 'Database', score: 0 },
      { category: 'DevOps', score: 0 },
      { category: 'System Design', score: 0 },
      { category: 'ML/AI', score: 0 }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState('Software Engineer');

  const fetchSkillGap = async (selectedRole) => {
    try {
      setLoading(true);
      const res = await api.get(`/resume/skill-gap?role=${selectedRole}`);
      if (res.data && res.data.data) {
        setData(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load skill gap analysis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkillGap(role);
  }, []);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    fetchSkillGap(newRole);
  };

  const roles = [
    'Software Engineer', 'Full Stack Developer', 'Data Scientist', 
    'Frontend Engineer', 'Backend Engineer', 'DevOps Engineer'
  ];

  return (
    <Layout title="AI Skill Gap Analyzer">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Role Selector Dashboard */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-primary/10 rounded-[20px] flex items-center justify-center text-primary shadow-inner">
              <HiOutlineFilter size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">Industry Gap Analysis</h2>
              <p className="text-gray-500 font-medium">Analyze your skills against current market requirements.</p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {roles.map(r => (
              <button
                key={r}
                onClick={() => handleRoleChange(r)}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                  role === r 
                    ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' 
                    : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white rounded-[40px] border border-gray-100 shadow-sm">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">AI Analyzing Skills...</p>
          </div>
        ) : (
          <>
            {/* Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Skill Match %', val: `${data?.matchPercentage ?? 0}%`, color: 'text-emerald-500', bg: 'bg-emerald-50', icon: HiOutlineBadgeCheck },
                { label: 'Missing Skills', val: (data?.missingSkills || []).length, color: 'text-rose-500', bg: 'bg-rose-50', icon: HiOutlineFire },
                { label: 'Extra Skills', val: (data?.extraSkills || []).length, color: 'text-blue-500', bg: 'bg-blue-50', icon: HiLightningBolt },
                { label: 'Readiness', val: data?.readinessLevel ?? 'N/A', color: 'text-amber-500', bg: 'bg-amber-50', icon: HiOutlineAcademicCap }
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 flex items-center space-x-4">
                  <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                    <stat.icon size={28} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                    <p className={`text-2xl font-black ${stat.color}`}>{stat.val}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Radar Chart Section */}
              <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-widest">Technical Proficiency Radar</h3>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data?.radarData || []}>
                      <PolarGrid stroke="#f3f4f6" />
                      <PolarAngleAxis dataKey="category" tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 700 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar
                        name="Student"
                        dataKey="score"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Skill Lists Section */}
              <div className="space-y-8">
                <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 flex-1">
                  <h3 className="text-sm font-black text-gray-900 mb-6 uppercase tracking-widest">Skills Overview</h3>
                  <div className="space-y-8">
                    <div>
                      <label className="block text-[10px] font-black text-rose-500 uppercase tracking-widest mb-4">Critical Skill Gaps ({(data?.missingSkills || []).length})</label>
                      <div className="flex flex-wrap gap-2 text-rose-500">
                        {(data?.missingSkills || []).map(s => (
                          <span key={s} className="px-4 py-2 bg-rose-50 rounded-xl text-xs font-bold border border-rose-100">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-4">Mastered Skills ({(data?.matchedSkills || []).length})</label>
                      <div className="flex flex-wrap gap-2 text-emerald-500">
                        {(data?.matchedSkills || []).map(s => (
                          <span key={s} className="px-4 py-2 bg-emerald-50 rounded-xl text-xs font-bold border border-emerald-100">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-slate-900 rounded-[40px] text-white">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center font-bold italic">AI</div>
                    <h3 className="text-xl font-bold">Smart Recommendation</h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">
                    Based on your gaps in <span className="text-blue-400 font-bold">{(data?.missingSkills || []).slice(0, 2).join(' and ') || 'Technical Areas'}</span>, we suggest prioritizing certifications. Bridging these gaps will improve your <span className="text-white font-bold">{role}</span> readiness by approximately <span className="text-emerald-400 font-bold">{Math.round((100 - (data?.matchPercentage ?? 0)) / 2)}%</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendations Table */}
            <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest">Personalized Learning Roadmap</h3>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{(data?.recommendations || []).length} Recommended Courses</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Skill</th>
                      <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Course Recommendation</th>
                      <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Platform</th>
                      <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Duration</th>
                      <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Priority</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {(data?.recommendations || []).map((rec, i) => (
                      <tr key={i} className="hover:bg-gray-50/30 transition-all group">
                        <td className="px-8 py-6 font-black text-gray-900">{rec?.skill}</td>
                        <td className="px-8 py-6 font-bold text-gray-600 group-hover:text-primary transition-colors">{rec?.course}</td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1.5 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold uppercase tracking-widest">
                            {rec?.platform}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-gray-500">{rec?.duration}</td>
                        <td className="px-8 py-6 text-center">
                          <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                            rec?.priority === 'High' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'
                          }`}>
                            {rec?.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
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

export default SkillGap;
