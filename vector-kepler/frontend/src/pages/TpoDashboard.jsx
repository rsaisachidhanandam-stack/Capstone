import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Briefcase, Building, ShieldCheck, Mail, Loader2, X } from 'lucide-react';

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

const TpoDashboard = () => {
  const [drives, setDrives] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newDrive, setNewDrive] = useState({
    companyName: '', role: '', package: '', minCGPA: '', deadline: '', requiredSkills: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [drivesRes, candidatesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/drives'),
        axios.get('http://localhost:5000/api/tpo/final-candidates')
      ]);
      setDrives(drivesRes.data);
      setCandidates(candidatesRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    try {
       const payload = {
         ...newDrive,
         requiredSkills: newDrive.requiredSkills.split(',').map(s => s.trim())
       };
       await axios.post('http://localhost:5000/api/drives/create', payload);
       alert('Drive created successfully');
       setShowModal(false);
       setNewDrive({ companyName: '', role: '', package: '', minCGPA: '', deadline: '', requiredSkills: '' });
       fetchData();
    } catch (err) {
       alert(err.response?.data?.message || 'Error creating drive');
    }
  };

  const approveSelection = async (driveId, studentId, status) => {
    try {
      await axios.post('http://localhost:5000/api/tpo/approve', {
        driveId,
        studentIds: [studentId],
        approvalStatus: status
      });
      alert(`Candidate ${status === 'Final Approved' ? 'Approved' : 'Rejected'}`);
      fetchData();
    } catch (err) {
      alert('Error updating candidate');
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">TPO Control Center</h1>
          <p className="text-sm text-slate-500 mt-1">Manage drives and approve final candidates.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm flex items-center transition"
        >
          <Briefcase className="w-4 h-4 mr-2" />
          Create New Drive
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Active Drives" value={drives.length} icon={Briefcase} colorClass="bg-purple-100 text-purple-600" />
        <StatCard title="Total Applicants" value={drives.reduce((acc, d) => acc + d.applicants.length, 0)} icon={Building} colorClass="bg-blue-100 text-blue-600" />
        <StatCard title="Final Approvals" value={drives.reduce((acc, d) => acc + d.finalSelectedStudents.length, 0)} icon={ShieldCheck} colorClass="bg-green-100 text-green-600" />
        <StatCard title="Pending Review" value={candidates.reduce((acc, d) => acc + d.candidates.length, 0)} icon={Mail} colorClass="bg-orange-100 text-orange-600" />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-bold">Candidates Forwarded by Departments</h3>
        </div>
        <div className="p-4 space-y-4">
          {candidates.length === 0 ? <p className="text-slate-500 p-4 text-center">No forwarded candidates pending approval.</p> :
            candidates.map((driveGroup) => (
              <div key={driveGroup.driveId} className="mb-6">
                <h4 className="font-semibold text-purple-600 mb-3 ml-2">{driveGroup.companyName} - {driveGroup.role}</h4>
                {driveGroup.candidates.map((applicant, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg dark:border-slate-700 hover:border-purple-500 transition mb-2">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center font-bold">
                        {applicant.studentId.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-white">
                          {applicant.studentId.name} • {applicant.studentId.department}
                        </h4>
                        <p className="text-sm text-slate-500">CGPA: {applicant.studentId.cgpa} | Skills: {applicant.studentId.skills.join(', ') || 'None listed'}</p>
                      </div>
                    </div>
                    <div className="space-x-3">
                       <button onClick={() => approveSelection(driveGroup.driveId, applicant.studentId._id, 'Rejected')} className="text-slate-600 dark:text-slate-300 font-medium hover:text-red-500 transition px-3">
                         Reject
                       </button>
                       <button onClick={() => approveSelection(driveGroup.driveId, applicant.studentId._id, 'Final Approved')} className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded-lg font-medium transition shadow-sm">
                         Approve Selection
                       </button>
                    </div>
                  </div>
                ))}
              </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-full max-w-lg shadow-xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 dark:hover:text-white">
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold mb-4">Create New Placement Drive</h2>
            <form onSubmit={handleCreateDrive} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <input required value={newDrive.companyName} onChange={e => setNewDrive({...newDrive, companyName: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role / Job Title</label>
                <input required value={newDrive.role} onChange={e => setNewDrive({...newDrive, role: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Package (LPA)</label>
                  <input required type="number" step="0.1" value={newDrive.package} onChange={e => setNewDrive({...newDrive, package: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Min CGPA</label>
                  <input required type="number" step="0.1" value={newDrive.minCGPA} onChange={e => setNewDrive({...newDrive, minCGPA: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Required Skills (comma separated)</label>
                <input value={newDrive.requiredSkills} onChange={e => setNewDrive({...newDrive, requiredSkills: e.target.value})} placeholder="e.g. React, Node.js, Python" className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Application Deadline</label>
                <input required type="date" value={newDrive.deadline} onChange={e => setNewDrive({...newDrive, deadline: e.target.value})} className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600" />
              </div>
              <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg mt-4">
                Publish Drive
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TpoDashboard;
