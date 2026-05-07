import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { format, differenceInDays } from 'date-fns';
import { HiOutlinePlus, HiOfficeBuilding, HiOutlineCurrencyDollar, HiOutlineUsers, HiOutlineExternalLink, HiPencil, HiOutlineX, HiBriefcase } from 'react-icons/hi';

const ManageDrives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const res = await api.get('/drives');
      setDrives(res.data.data?.drives || []);
    } catch (err) {
      toast.error(err?.message || 'Failed to load drives');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const closeDrive = async (id) => {
    if (!window.confirm('Are you sure you want to close this drive?')) return;
    try {
      await api.delete(`/drives/${id}`);
      toast.success('Drive closed');
      fetchDrives();
    } catch (err) {
      toast.error('Failed to close drive');
    }
  };

  const getDeadlineColor = (date) => {
    if (!date) return 'text-gray-400 bg-gray-100';
    try {
      const days = differenceInDays(new Date(date), new Date());
      if (days < 0) return 'text-gray-400 bg-gray-100';
      if (days < 3) return 'text-red-600 bg-red-50';
      if (days < 7) return 'text-amber-600 bg-amber-50';
      return 'text-emerald-600 bg-emerald-50';
    } catch (e) {
      return 'text-gray-400 bg-gray-100';
    }
  };

  return (
    <Layout title="Manage Placement Drives">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Overview</h3>
          <p className="text-gray-900 font-bold">Total Active Drives: {(drives || []).filter(d => d.status === 'active').length}</p>
        </div>
        <Link 
          to="/tpo/drives/create" 
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center space-x-2 hover:bg-secondary transition-all shadow-lg shadow-primary/10"
        >
          <HiOutlinePlus size={20} />
          <span>Post New Drive</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white rounded-2xl h-64 animate-pulse border border-gray-100"></div>
          ))}
        </div>
      ) : (drives || []).length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-20 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <HiBriefcase size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No Placement Drives Found</h3>
          <p className="text-gray-500 mb-6">Start by creating your first company placement drive.</p>
          <Link 
            to="/tpo/drives/create" 
            className="text-primary font-bold hover:underline"
          >
            Create Drive &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(drives || []).map((drive) => (
            <div key={drive?._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden relative group">
              {/* Status Badge */}
              <div className={`absolute top-4 right-4 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                drive?.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {drive?.status}
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-4 mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-inner"
                    style={{ backgroundColor: drive?.logoColor || '#3b82f6' }}
                  >
                    {drive?.company?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-tight">{drive?.company}</h4>
                    <p className="text-xs text-gray-500 font-medium">{drive?.role}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <HiOutlineCurrencyDollar className="mr-2 text-gray-400" size={18} />
                    <span className="font-bold text-gray-900">{drive?.package}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <HiOfficeBuilding className="mr-2 text-gray-400" size={18} />
                    <span>{drive?.jobLocation} &bull; {drive?.jobType}</span>
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold ${getDeadlineColor(drive?.deadline)}`}>
                    Deadline: {drive?.deadline ? format(new Date(drive.deadline), 'MMM dd, yyyy') : 'N/A'}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 border-t border-gray-50 pt-4 pb-2 text-center">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Applied</p>
                    <p className="text-sm font-bold text-gray-900">{drive?.applicants?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Shortlisted</p>
                    <p className="text-sm font-bold text-emerald-600">{drive?.shortlisted?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Positions</p>
                    <p className="text-sm font-bold text-primary">{drive?.totalPositions ?? 0}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 border-t border-gray-100">
                <button 
                  onClick={() => navigate(`/tpo/drives/edit/${drive._id}`)}
                  className="py-3 text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center justify-center border-r border-gray-100"
                >
                  <HiPencil className="mr-2" size={14} />
                  Edit
                </button>
                <button 
                  onClick={() => closeDrive(drive._id)}
                  disabled={drive?.status === 'closed'}
                  className={`py-3 text-xs font-bold flex items-center justify-center ${
                    drive?.status === 'closed' ? 'text-gray-300' : 'text-danger hover:bg-red-50'
                  }`}
                >
                  <HiOutlineX className="mr-2" size={14} />
                  {drive?.status === 'closed' ? 'Closed' : 'Close Drive'}
                </button>
              </div>
              
              <Link 
                to={`/tpo/drives/${drive?._id}`}
                className="block w-full py-3 bg-gray-50 text-center text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all"
              >
                View Full Insight & Applicants
              </Link>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
};

export default ManageDrives;
