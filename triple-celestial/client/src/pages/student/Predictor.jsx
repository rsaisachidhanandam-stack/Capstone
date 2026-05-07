import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { 
  HiOutlineShieldCheck, HiOutlineSparkles, HiOutlineThumbUp, 
  HiTrendingUp, HiOutlineLightBulb, HiOutlineExclamation
} from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const Predictor = () => {
  const [data, setData] = useState({
    probability: 0,
    riskLevel: 'Medium',
    factors: [],
    suggestions: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        setLoading(true);
        const res = await api.get('/resume/prediction');
        if (res.data && res.data.data) {
          setData(res.data.data);
        }
      } catch (err) {
        toast.error('Failed to generate placement prediction');
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, []);

  const COLORS = {
    'Very High': '#ef4444',
    'High': '#f97316',
    'Medium': '#eab308',
    'Low': '#3b82f6',
    'Very Low': '#22c55e'
  };

  const getGaugeColor = (prob) => {
    if (prob >= 75) return '#22c55e'; // Green
    if (prob >= 50) return '#3b82f6'; // Blue
    if (prob >= 25) return '#f97316'; // Orange
    return '#ef4444'; // Red
  };

  const pieData = [
    { name: 'Probability', value: data?.probability ?? 0 },
    { name: 'Remaining', value: 100 - (data?.probability ?? 0) }
  ];

  return (
    <Layout title="AI Placement Predictor">
      <div className="max-w-6xl mx-auto space-y-8 pb-12 animate-in fade-in duration-700">
        
        {loading ? (
          <div className="bg-white rounded-[44px] p-24 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">AI Calculating Placement Odds...</p>
          </div>
        ) : (
          <>
            {/* Probability Large Card */}
            <div className="bg-white rounded-[44px] p-10 shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="relative h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={100}
                      outerRadius={130}
                      startAngle={180}
                      endAngle={0}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      <Cell fill={getGaugeColor(data?.probability ?? 0)} />
                      <Cell fill="#f3f4f6" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-16">
                  <span className="text-6xl font-black text-gray-900 leading-none">{data?.probability ?? 0}%</span>
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-2">Likelihood</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-3">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
                    (data?.probability ?? 0) >= 50 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-500'
                  }`}>
                    {data?.riskLevel ?? 'N/A'} Risk
                  </span>
                  <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Confidence: 85%</span>
                </div>
                
                <h2 className="text-4xl font-black text-gray-900 leading-tight">
                  {(data?.probability ?? 0) >= 75 ? 'Excellent Prospects!' : 
                   (data?.probability ?? 0) >= 50 ? 'Steady Progress.' : 'Path to Improvement.'}
                </h2>
                <p className="text-gray-500 font-medium leading-relaxed">
                  Our AI evaluated your profile against historical placement data and current market trends. Your metrics show high potential in <span className="text-primary font-bold">Technical Skills</span> but require focused effort on <span className="text-rose-500 font-bold">Aptitude</span>.
                </p>

                <div className="flex gap-4 pt-4">
                  <div className="flex-1 p-5 rounded-[28px] bg-slate-900 text-white">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Risk Level</p>
                    <p className="text-lg font-bold" style={{ color: COLORS[data?.riskLevel] ?? '#fff' }}>{data?.riskLevel ?? 'Unknown'}</p>
                  </div>
                  <div className="flex-1 p-5 rounded-[28px] bg-primary/5 text-primary border border-primary/10">
                    <p className="text-[10px] font-black text-primary/50 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-lg font-black">{(data?.probability ?? 0) >= 50 ? 'Eligible' : 'Needs Work'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Factors Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-widest flex items-center">
                  <HiOutlineShieldCheck className="mr-3 text-primary" size={24} />
                  Evaluation Factors
                </h3>
                
                <div className="space-y-8">
                  {(data?.factors || []).map((factor, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-end mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-black text-gray-900">{factor?.name}</span>
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">({factor?.weight} Weight)</span>
                        </div>
                        <span className="text-xs font-black text-primary">{factor?.score}/100</span>
                      </div>
                      <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-1000"
                          style={{ width: `${factor?.score ?? 0}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[40px] p-10 shadow-sm border border-gray-100">
                <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-widest flex items-center">
                  <HiOutlineLightBulb className="mr-3 text-amber-500" size={24} />
                  Growth Suggestions
                </h3>
                
                <div className="space-y-4">
                  {(data?.suggestions || []).map((suggestion, i) => (
                    <div key={i} className="flex items-start space-x-4 p-5 rounded-3xl bg-gray-50/50 hover:bg-gray-50 transition-all group">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        {i % 2 === 0 ? <HiTrendingUp size={20} /> : <HiOutlineSparkles size={20} />}
                      </div>
                      <p className="text-sm font-bold text-gray-700 leading-relaxed pt-1 flex-1">{suggestion}</p>
                    </div>
                  ))}
                  {(data?.suggestions || []).length === 0 && (
                    <div className="flex flex-col items-center justify-center h-48 text-center text-gray-400">
                      <HiOutlineThumbUp size={48} className="mb-4 opacity-20" />
                      <p className="font-medium italic">No improvements needed! You are on an excellent track.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Banner */}
            <div className="p-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[44px] text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                  <HiOutlineExclamation size={32} />
                </div>
                <div>
                  <h4 className="text-2xl font-bold">Boost Your Score Today</h4>
                  <p className="text-slate-400 font-medium">Try our AI-powered interview practice or mock tests.</p>
                </div>
              </div>
              <button className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-black shadow-2xl hover:bg-blue-50 transition-all hover:-translate-y-1">
                Start Mock Interview
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Predictor;
