import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  HiSearch, HiOutlineFilter, HiOutlineCheckCircle, HiOutlineX, 
  HiOutlineViewGrid, HiOutlineBadgeCheck, HiInformationCircle
} from 'react-icons/hi';
import { BRANCHES } from '../../utils/constants';

const AllApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    branch: '',
    search: ''
  });

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tpo/applicants', { params: filter });
      setApplicants(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load global applicants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [filter.status, filter.branch]);

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      if (status === 'approve') {
        await api.post('/tpo/approve', { applicationId, remarks: 'Globally approved by TPO' });
      } else if (status === 'reject') {
        await api.post('/tpo/reject', { applicationId, remarks: 'Criteria check failed' });
      } else if (status === 'select') {
        await api.post('/tpo/final-select', { applicationId });
      }
      toast.success('Status updated successfully');
      fetchApplicants();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const getStatusStyle = (status) => {
    if (!status) return 'bg-gray-100 text-gray-500';
    switch (status) {
      case 'final_selected': return 'bg-emerald-50 text-emerald-600';
      case 'tpo_approved': return 'bg-blue-50 text-blue-600';
      case 'forwarded_to_tpo': return 'bg-purple-50 text-purple-600';
      case 'shortlisted': return 'bg-indigo-50 text-indigo-600';
      case 'rejected': return 'bg-rose-50 text-rose-600';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const statusTabs = [
    { label: 'All', value: '' },
    { label: 'Applied', value: 'applied' },
    { label: 'Shortlisted', value: 'shortlisted' },
    { label: 'Forwarded', value: 'forwarded_to_tpo' },
    { label: 'Approved', value: 'tpo_approved' },
    { label: 'Selected', value: 'final_selected' },
  ];

  return (
    <Layout title="Global Applicant Pool">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        
        {/* Advanced Filters */}
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-8">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1 relative">
                 <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                 <input 
                   type="text"
                   placeholder="Search by name, company, or role..."
                   className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                   onChange={(e) => setFilter({...filter, search: e.target.value})}
                 />
              </div>
              <div className="flex items-center space-x-4">
                 <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-xl">
                    <HiOutlineFilter className="text-gray-400" />
                    <select 
                      className="bg-transparent border-none text-xs font-black uppercase tracking-widest outline-none cursor-pointer"
                      value={filter?.branch ?? ''}
                      onChange={(e) => setFilter({...filter, branch: e.target.value})}
                    >
                      <option value="">All Branches</option>
                      {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                 </div>
                 <button 
                   onClick={fetchApplicants}
                   className="bg-primary text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20"
                 >
                   Apply Search
                 </button>
              </div>
           </div>

           {/* Status Tabs */}
           <div className="flex flex-wrap gap-2 border-b border-gray-50 pb-4">
              {statusTabs.map(tab => (
                <button
                  key={tab.value}
                  onClick={() => setFilter({...filter, status: tab.value})}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    filter?.status === tab.value 
                      ? 'bg-slate-900 text-white shadow-xl scale-105' 
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
           </div>
        </div>

        {/* Applicants Table */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Candidate</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Drive</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Stats</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">AI Match</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {(applicants || []).map((app) => (
                    <tr key={app?._id} className="hover:bg-gray-50/30 transition-all">
                      <td className="px-8 py-6">
                         <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold">
                               {app?.student?.userId?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                               <p className="font-bold text-gray-900">{app?.student?.userId?.name}</p>
                               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{app?.student?.branch}</p>
                            </div>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         <p className="font-bold text-gray-700">{app?.drive?.company}</p>
                         <p className="text-xs text-gray-400 font-medium">{app?.drive?.role}</p>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <div className="flex items-center justify-center space-x-2">
                            <div className="px-2 py-1 bg-gray-50 rounded-lg text-[10px] font-bold text-gray-500">{app?.student?.cgpa || 0}</div>
                            <div className="px-2 py-1 bg-primary/5 rounded-lg text-[10px] font-bold text-primary">{app?.student?.backlogs || 0} B</div>
                         </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <span className="font-black text-primary">{app?.aiMatchScore ?? 0}%</span>
                      </td>
                      <td className="px-8 py-6 text-center">
                         <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${getStatusStyle(app?.status)}`}>
                            {app?.status?.replace(/_/g, ' ') || 'Applied'}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center justify-center space-x-2">
                            {app?.status === 'forwarded_to_tpo' && (
                              <>
                                <button 
                                  onClick={() => handleStatusUpdate(app?._id, 'approve')}
                                  title="Approve for Next Round"
                                  className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                >
                                  <HiOutlineCheckCircle size={18} />
                                </button>
                                <button 
                                  onClick={() => handleStatusUpdate(app?._id, 'reject')}
                                  title="Reject Candidate"
                                  className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                >
                                  <HiOutlineX size={18} />
                                </button>
                              </>
                            )}
                            {app?.status === 'tpo_approved' && (
                              <button 
                                onClick={() => handleStatusUpdate(app?._id, 'select')}
                                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-lg"
                              >
                                Final Select
                              </button>
                            )}
                            <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-100 transition-all">
                               <HiInformationCircle size={18} />
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
           </div>
           {loading && (
             <div className="p-24 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Scanning Global Database...</p>
             </div>
           )}
           {!loading && (applicants || []).length === 0 && (
             <div className="p-24 text-center">
                <HiOutlineViewGrid className="mx-auto text-gray-100 mb-6" size={64} />
                <h3 className="text-xl font-black text-gray-900 uppercase">No Applicants Found</h3>
                <p className="text-gray-400 font-medium max-w-sm mx-auto mt-2">No students match the current status or branch filter criteria.</p>
             </div>
           )}
        </div>
      </div>
    </Layout>
  );
};

export default AllApplicants;
