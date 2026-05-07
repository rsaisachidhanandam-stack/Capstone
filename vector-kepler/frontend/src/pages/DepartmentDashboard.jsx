import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, FileText, CheckCircle, Search, Loader2 } from 'lucide-react';

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

const DepartmentDashboard = () => {
  const [drives, setDrives] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState([]);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/drives');
      setDrives(res.data);
      if (res.data.length > 0) handleSelectDrive(res.data[0]._id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDrive = async (driveId) => {
    setSelectedDrive(driveId);
    try {
      setApplicants([]);
      const res = await axios.get(`http://localhost:5000/api/drives/${driveId}/applicants`);
      setApplicants(res.data || []);
      setSelectedStudents([]);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]
    );
  };

  const autoShortlist = () => {
    // Select all users with > 80 probability/match mock
    const highMatch = applicants
      .filter(a => a.studentId?.resumeScore > 70)
      .map(a => a.studentId._id);
    setSelectedStudents(highMatch);
    alert('AI selected top candidates based on skills & CGPA!');
  };

  const actionApplicants = async (actionUrl) => {
    if (selectedStudents.length === 0) return alert('Select students first');
    try {
      await axios.post(`http://localhost:5000/api/department/${actionUrl}`, {
        driveId: selectedDrive,
        studentIds: selectedStudents
      });
      alert(`Successfully processed candidates`);
      handleSelectDrive(selectedDrive); // refresh
    } catch (error) {
      alert(error.response?.data?.message || 'Error processing');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-green-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-teal-600">Department Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and shortlist your department students.</p>
        </div>
        <button 
          onClick={autoShortlist} 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm flex items-center transition"
        >
          <Search className="w-4 h-4 mr-2" />
          AI Auto Shortlist
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Students" value="-" icon={Users} colorClass="bg-blue-100 text-blue-600" />
        <StatCard title="Total Applications" value={applicants.length} icon={FileText} colorClass="bg-orange-100 text-orange-600" />
        <StatCard title="Forwarded to TPO" value={applicants.filter(a => a.status === 'Forwarded to TPO').length} icon={CheckCircle} colorClass="bg-green-100 text-green-600" />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <select 
            value={selectedDrive || ''} 
            onChange={e => handleSelectDrive(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border rounded-lg bg-slate-50 dark:bg-slate-700 outline-none"
          >
            <option disabled value="">Select a Drive</option>
            {drives.map(d => <option key={d._id} value={d._id}>{d.companyName} - {d.role}</option>)}
          </select>
          <div className="space-x-2">
            <button 
              onClick={() => actionApplicants('shortlist')}
              className="text-blue-600 hover:text-white border-blue-600 border hover:bg-blue-600 px-3 py-1.5 rounded-lg transition text-sm font-medium"
            >
              Shortlist Selected
            </button>
            <button 
              onClick={() => actionApplicants('forward')}
              className="text-white bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded-lg transition text-sm font-medium"
            >
              Forward to TPO
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          {applicants.length === 0 ? (
             <div className="p-10 text-center text-slate-500">No applicants for this drive.</div>
          ) : (
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-sm">
                   <th className="p-4 w-10">
                      <input 
                        type="checkbox" 
                        onChange={(e) => setSelectedStudents(e.target.checked ? applicants.map(a => a.studentId._id) : [])}
                        checked={selectedStudents.length === applicants.length && applicants.length > 0} 
                        className="rounded"
                      />
                   </th>
                   <th className="p-4 font-medium">Student Info</th>
                   <th className="p-4 font-medium">CGPA & Dept</th>
                   <th className="p-4 font-medium">AI Match Score</th>
                   <th className="p-4 font-medium">Status</th>
                 </tr>
               </thead>
               <tbody className="text-sm divide-y divide-slate-100 dark:divide-slate-700">
                 {applicants.map((applicant, i) => (
                   <tr key={applicant.studentId?._id || i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                     <td className="p-4">
                        <input 
                          type="checkbox" 
                          checked={selectedStudents.includes(applicant.studentId?._id)} 
                          onChange={() => toggleStudent(applicant.studentId?._id)}
                          className="rounded"
                        />
                     </td>
                     <td className="p-4 font-medium">
                        {applicant.studentId?.name}
                        <div className="text-xs text-slate-500 font-normal">{applicant.studentId?.email}</div>
                     </td>
                     <td className="p-4">
                        {applicant.studentId?.cgpa} <br />
                        <span className="text-xs text-slate-500">({applicant.studentId?.department})</span>
                     </td>
                     <td className="p-4 flex items-center">
                        <div className="w-16 bg-slate-200 rounded-full h-2 mr-2">
                           <div className="bg-green-500 h-2 rounded-full" style={{width: `${applicant.studentId?.resumeScore || 0}%`}}></div>
                        </div> 
                        {applicant.studentId?.resumeScore || 0}%
                     </td>
                     <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          applicant.status === 'Applied' ? 'bg-blue-100 text-blue-700' :
                          applicant.status.includes('Shortlist') ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                           {applicant.status}
                        </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
