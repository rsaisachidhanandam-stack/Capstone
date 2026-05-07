import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  HiSearch, HiOutlineFilter, HiOutlineBadgeCheck, HiOutlineExclamationCircle,
  HiOutlineMail, HiOutlinePhone, HiOutlineX, HiOutlineCheck, HiOutlineExternalLink,
  HiLightningBolt
} from 'react-icons/hi';
import { BRANCHES } from '../../utils/constants';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedDrive, setSelectedDrive] = useState('');
  
  // Filter States
  const [filters, setFilters] = useState({
    minCGPA: 0,
    skillThreshold: 0,
    branch: '',
    allowBacklogs: true
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/department/students', { params: filters });
      setStudents(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const fetchDrives = async () => {
    try {
      const res = await api.get('/drives');
      setDrives(res.data.data?.drives || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchDrives();
  }, [filters]);

  const toggleSelect = (id) => {
    setSelectedStudents(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedStudents.length === (students || []).length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents((students || []).map(s => s._id));
    }
  };

  const handleBulkShortlist = async () => {
    if (!selectedDrive) return toast.error('Please select a drive first');
    try {
      await api.post('/department/shortlist/bulk', {
        studentIds: selectedStudents,
        driveId: selectedDrive
      });
      toast.success('Students shortlisted successfully');
      setSelectedStudents([]);
      fetchStudents();
    } catch (err) {
      toast.error('Failed to shortlist students');
    }
  };

  const handleForwardToTPO = async () => {
    if (!selectedDrive) return toast.error('Please select a drive first');
    try {
      await api.post('/department/forward-to-tpo', {
        studentIds: selectedStudents,
        driveId: selectedDrive,
        remarks: 'Bulk forwarded by Department Incharge'
      });
      toast.success('Forwarded to TPO successfully');
      setSelectedStudents([]);
      fetchStudents();
    } catch (err) {
      toast.error('Failed to forward to TPO');
    }
  };

  const getRecommendationColor = (rec) => {
    switch (rec) {
      case 'Highly Recommended': return 'bg-emerald-50 text-emerald-600';
      case 'Good Fit': return 'bg-blue-50 text-blue-600';
      default: return 'bg-amber-50 text-amber-600';
    }
  };

  return (
    <Layout title="Student Management">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        
        {/* Filters Top Bar */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-gray-900 flex items-center">
              <HiOutlineFilter className="mr-3 text-primary" size={24} />
              Intelligent Filters
            </h3>
            <button 
              onClick={() => setFilters({ minCGPA: 0, skillThreshold: 0, branch: '', allowBacklogs: true })}
              className="text-xs font-bold text-primary px-4 py-2 hover:bg-primary/5 rounded-xl transition-all"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Min CGPA: {filters?.minCGPA ?? 0}</label>
              <input 
                type="range" min="0" max="10" step="0.5"
                value={filters?.minCGPA ?? 0}
                onChange={(e) => setFilters({...filters, minCGPA: e.target.value})}
                className="w-full accent-primary h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Skill Threshold: {filters?.skillThreshold ?? 0}%</label>
              <input 
                type="range" min="0" max="100" step="5"
                value={filters?.skillThreshold ?? 0}
                onChange={(e) => setFilters({...filters, skillThreshold: e.target.value})}
                className="w-full accent-primary h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Branch</label>
              <select 
                value={filters?.branch ?? ''}
                onChange={(e) => setFilters({...filters, branch: e.target.value})}
                className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
              >
                <option value="">All Branches</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-center pt-5">
              <label className="flex items-center cursor-pointer space-x-3">
                <input 
                  type="checkbox" 
                  checked={filters?.allowBacklogs ?? true}
                  onChange={(e) => setFilters({...filters, allowBacklogs: e.target.checked})}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm font-bold text-gray-600">Allow Backlogs</span>
              </label>
            </div>
          </div>
        </div>

        {/* AI Insight Banner */}
        <div className="bg-primary/5 border border-primary/10 p-6 rounded-[32px] flex items-center space-x-6">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary flex-shrink-0">
            <HiLightningBolt size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">
              AI suggests forwarding <span className="text-primary">{(students || []).filter(s => s.aiRecommendation === 'Highly Recommended').length} strong candidates</span> based on current selection criteria.
            </p>
          </div>
        </div>

        {/* Bulk Action Toolbar */}
        {(selectedStudents || []).length > 0 && (
          <div className="bg-slate-900 p-6 rounded-[32px] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 sticky top-20 z-30 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center space-x-4">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-black">
                {(selectedStudents || []).length} Students Selected
              </span>
              <select 
                value={selectedDrive}
                onChange={(e) => setSelectedDrive(e.target.value)}
                className="p-3 bg-slate-800 text-white border-none rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="">Select Drive</option>
                {(drives || []).map(d => <option key={d?._id} value={d?._id}>{d?.company} - {d?.role}</option>)}
              </select>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={handleBulkShortlist}
                className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-xs hover:bg-blue-50 transition-all flex items-center"
              >
                <HiOutlineCheck className="mr-2" size={18} />
                Shortlist
              </button>
              <button 
                onClick={handleForwardToTPO}
                className="px-6 py-3 bg-primary text-white rounded-2xl font-black text-xs hover:bg-secondary transition-all flex items-center"
              >
                <HiOutlineBadgeCheck className="mr-2" size={18} />
                Forward to TPO
              </button>
              <button 
                onClick={() => setSelectedStudents([])}
                className="px-4 py-3 bg-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all"
              >
                <HiOutlineX size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Students Table */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-6">
                    <input 
                      type="checkbox" 
                      onChange={selectAll}
                      checked={(selectedStudents || []).length === (students || []).length && (students || []).length > 0}
                      className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary mt-1"
                    />
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Student</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">CGPA</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Scores</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">AI Match</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">AI Recommendation</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {(students || []).map((student) => (
                  <tr key={student?._id} className={`hover:bg-gray-50/50 transition-all group ${(selectedStudents || []).includes(student?._id) ? 'bg-primary/5' : ''}`}>
                    <td className="px-8 py-6">
                      <input 
                        type="checkbox" 
                        checked={(selectedStudents || []).includes(student?._id)}
                        onChange={() => toggleSelect(student._id)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                          {student?.userId?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{student?.userId?.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{student?.branch}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`text-sm font-black ${(student?.cgpa ?? 0) < 7 ? 'text-rose-500' : 'text-gray-900'}`}>{student?.cgpa ?? 0}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center space-x-4">
                        <div className="text-center">
                          <p className="text-[8px] font-black text-gray-300 uppercase tracking-tighter">Resume</p>
                          <div className={`px-2 py-1 rounded-lg text-[10px] font-black ${(student?.resumeScore ?? 0) < 60 ? 'bg-rose-50 text-rose-500' : 'bg-gray-50 text-gray-500'}`}>
                            {student?.resumeScore ?? 0}%
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-[8px] font-black text-gray-300 uppercase tracking-tighter">Skills</p>
                          <div className={`px-2 py-1 rounded-lg text-[10px] font-black ${(student?.skillMatchScore ?? 0) < 65 ? 'bg-rose-50 text-rose-500' : 'bg-gray-50 text-gray-500'}`}>
                            {student?.skillMatchScore ?? 0}%
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="text-sm font-black text-primary">{student?.skillMatchScore ?? 0}%</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getRecommendationColor(student?.aiRecommendation)}`}>
                        {student?.aiRecommendation || 'Unrated'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                       <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                         student?.placementStatus === 'placed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'
                       }`}>
                         {student?.placementStatus || 'Unplaced'}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {loading && (
            <div className="p-20 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Processing Student Data...</p>
            </div>
          )}
          
          {!loading && (students || []).length === 0 && (
            <div className="p-24 text-center">
               <HiOutlineX className="mx-auto text-gray-200 mb-4" size={48} />
               <h3 className="text-lg font-bold text-gray-900 uppercase">No students found</h3>
               <p className="text-gray-400 font-medium">Try adjusting your filters to find suitable candidates.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default StudentManagement;
