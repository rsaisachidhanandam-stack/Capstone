import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, BarChart3, Target, Award, Loader2 } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex items-center">
    <div className={`p-4 rounded-full ${colorClass} mr-4`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{title}</p>
      <h3 className="text-2xl font-bold mt-1 text-slate-800 dark:text-white">{value}</h3>
    </div>
  </div>
);

const StudentDashboard = () => {
  const [drives, setDrives] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const driveRes = await axios.get('http://localhost:5000/api/drives');
      setDrives(driveRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (driveId) => {
    try {
      await axios.post(`http://localhost:5000/api/drives/${driveId}/apply`);
      alert('Applied successfully!');
      fetchData(); // Refresh drives to check applied status
    } catch (error) {
      alert(error.response?.data?.message || 'Error applying');
    }
  };

  const analyzeResume = async () => {
    setAnalyzing(true);
    try {
      const aiRes = await axios.post('http://localhost:5000/api/ai/resume-analyze');
      setAiAnalysis(aiRes.data);
    } catch (error) {
      alert('Error analyzing resume');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Student Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back, check your placement progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Drives" value={drives.length} icon={Briefcase} colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/40" />
        <StatCard title="Applications Sent" value="-" icon={Target} colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/40" />
        <StatCard title="Resume Score" value={aiAnalysis ? `${aiAnalysis.score}%` : 'N/A'} icon={Award} colorClass="bg-green-100 text-green-600 dark:bg-green-900/40" />
        <StatCard title="Placement Probability" value="88%" icon={BarChart3} colorClass="bg-orange-100 text-orange-600 dark:bg-orange-900/40" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-4">Active Drives</h3>
          <div className="space-y-4">
            {drives.length === 0 ? <p className="text-slate-500 text-sm">No active drives available right now.</p> : 
              drives.map(drive => (
               <div key={drive._id} className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700 hover:border-blue-500 transition cursor-pointer">
                  <div>
                    <h4 className="font-semibold text-blue-600">{drive.companyName} • {drive.role}</h4>
                    <p className="text-sm text-slate-500">Package: {drive.package} LPA • Min CGPA: {drive.minCGPA}</p>
                    <p className="text-xs text-slate-400 mt-1">Skills: {drive.requiredSkills.join(', ')}</p>
                  </div>
                  <button 
                    onClick={() => handleApply(drive._id)} 
                    className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-sm font-medium transition"
                  >
                    Apply Now
                  </button>
               </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-bold mb-4">AI Analyzer</h3>
          {aiAnalysis ? (
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-sm mb-1"><span>Target Score</span> <span className="font-semibold text-green-500">{aiAnalysis.score}%</span></div>
                  <div className="w-full bg-slate-200 rounded-full h-2 dark:bg-slate-700"><div className="bg-green-500 h-2 rounded-full" style={{width: `${aiAnalysis.score}%`}}></div></div>
               </div>
               <div className="mt-4">
                 <h4 className="text-sm font-semibold mb-2">Suggestions:</h4>
                 <ul className="text-sm space-y-2 text-slate-600 dark:text-slate-400 list-disc pl-4">
                   {aiAnalysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                 </ul>
               </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-slate-500 text-sm mb-4">You haven't analyzed your resume yet.</p>
              <button 
                onClick={analyzeResume} 
                disabled={analyzing}
                className="w-full mt-2 flex items-center justify-center py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm font-medium disabled:opacity-50"
              >
                {analyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analyze Resume'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
