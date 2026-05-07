import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { 
  HiSearch, HiOutlineFilter, HiBriefcase, HiOutlineCurrencyDollar, 
  HiOutlineLocationMarker, HiOutlineCalendar, HiOutlineCheckCircle, HiInformationCircle,
  HiOutlineX, HiOutlineChevronRight
} from 'react-icons/hi';
import { BRANCHES } from '../../utils/constants';

const Drives = () => {
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [applying, setApplying] = useState(null);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter States
  const [filters, setFilters] = useState({
    branch: '',
    minPackage: '',
    jobType: ''
  });

  const { currentUser } = useAuth();

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const res = await api.get('/drives/eligible');
      setDrives(res.data.data || []);
    } catch (err) {
      toast.error(err?.message || 'Failed to load eligible drives');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, []);

  const handleApply = async (driveId) => {
    try {
      setApplying(driveId);
      await api.post(`/applications/apply/${driveId}`);
      toast.success('Application submitted successfully!');
      
      setDrives((drives || []).map(drive => 
        drive._id === driveId 
          ? { ...drive, alreadyApplied: true } 
          : drive
      ));
      
      if (selectedDrive?._id === driveId) {
        setSelectedDrive({ ...selectedDrive, alreadyApplied: true });
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to apply');
    } finally {
      setApplying(null);
    }
  };

  const isApplied = (drive) => {
    if (!drive) return false;
    return drive.alreadyApplied || (drive.applicants || []).includes(currentUser?.id);
  };

  const filteredDrives = (drives || []).filter(drive => {
    const matchesSearch = drive?.company?.toLowerCase().includes(search.toLowerCase()) ||
                         drive?.role?.toLowerCase().includes(search.toLowerCase());
    const matchesBranch = !filters.branch || (drive?.eligibleBranches || []).includes(filters.branch);
    const matchesJobType = !filters.jobType || drive?.jobType === filters.jobType;
    
    // Simple package comparison (extracting number from string like "12 LPA")
    const packageVal = parseFloat(drive?.package || '0');
    const filterPkg = parseFloat(filters.minPackage) || 0;
    const matchesPackage = packageVal >= filterPkg;

    return matchesSearch && matchesBranch && matchesJobType && matchesPackage;
  });

  return (
    <Layout title="Placement Opportunities">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Filter Sidebar - 25% */}
        <div className={`lg:w-1/4 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 flex items-center">
                <HiOutlineFilter className="mr-2 text-primary" size={20} />
                Filters
              </h3>
              <button 
                onClick={() => setFilters({ branch: '', minPackage: '', jobType: '' })}
                className="text-xs font-bold text-primary hover:underline"
              >
                Reset All
              </button>
            </div>

            <div className="space-y-6">
              {/* Branch Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Branch</label>
                <select 
                  value={filters?.branch ?? ''}
                  onChange={(e) => setFilters({...filters, branch: e.target.value})}
                  className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="">All Branches</option>
                  {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Package Filter */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Min Package (LPA)</label>
                <input 
                  type="number"
                  placeholder="e.g. 5"
                  value={filters?.minPackage ?? ''}
                  onChange={(e) => setFilters({...filters, minPackage: e.target.value})}
                  className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Job Type</label>
                <div className="space-y-2">
                  {['full-time', 'internship', 'part-time'].map(type => (
                    <label key={type} className="flex items-center space-x-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="jobType"
                        checked={filters?.jobType === type}
                        onChange={() => setFilters({...filters, jobType: type})}
                        className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <span className="text-sm font-medium text-gray-600 group-hover:text-primary transition-colors capitalize">{type.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - 75% */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="relative mb-8">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by company, role or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-3xl shadow-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
            />
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-gray-100 rounded-lg text-gray-600"
            >
              <HiOutlineFilter size={20} />
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white rounded-3xl h-64 animate-pulse border border-gray-100"></div>
              ))}
            </div>
          ) : (filteredDrives || []).length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-20 text-center">
              <HiBriefcase className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="text-lg font-bold text-gray-900">No matching drives found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(filteredDrives || []).map((drive) => (
                <div key={drive?._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative group overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl" style={{ backgroundColor: drive?.logoColor || '#3b82f6' }}>
                        {drive?.company?.charAt(0) || 'D'}
                      </div>
                      <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        (drive?.aiMatchScore || 0) >= 80 ? 'bg-emerald-50 text-emerald-600' : 
                        (drive?.aiMatchScore || 0) >= 60 ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {drive?.aiMatchScore ?? 0}% Match
                      </div>
                    </div>

                    <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors cursor-pointer" onClick={() => setSelectedDrive(drive)}>
                      {drive?.company}
                    </h4>
                    <p className="text-gray-500 font-semibold mb-4 text-sm">{drive?.role}</p>

                    <div className="grid grid-cols-2 gap-y-3 mb-6">
                      <div className="flex items-center text-xs text-gray-600 font-bold">
                        <HiOutlineCurrencyDollar className="mr-2 text-primary" size={16} />
                        {drive?.package}
                      </div>
                      <div className="flex items-center text-xs text-gray-600 font-bold">
                        <HiOutlineLocationMarker className="mr-2 text-gray-400" size={16} />
                        {drive?.jobLocation}
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <HiOutlineCalendar className="mr-2 text-gray-400" size={16} />
                        Ends: {drive?.deadline ? format(new Date(drive.deadline), 'MMM dd') : 'N/A'}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleApply(drive?._id)}
                        disabled={isApplied(drive) || applying === drive?._id}
                        className={`flex-1 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                          isApplied(drive) 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'bg-primary text-white hover:bg-secondary'
                        }`}
                      >
                        {applying === drive?._id ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : isApplied(drive) ? (
                          <HiOutlineCheckCircle size={18} />
                        ) : (
                          <HiBriefcase size={18} />
                        )}
                        <span>{isApplied(drive) ? 'Applied' : 'Apply Now'}</span>
                      </button>
                      <button 
                        onClick={() => setSelectedDrive(drive)}
                        className="px-4 py-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-colors"
                      >
                        <HiInformationCircle size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Drive Detail Modal */}
      {selectedDrive && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedDrive(null)}></div>
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Modal Header */}
            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: selectedDrive?.logoColor || '#3b82f6' }}>
                  {selectedDrive?.company?.charAt(0) || 'D'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedDrive?.company}</h3>
                  <p className="text-sm text-gray-500 font-medium">{selectedDrive?.role}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDrive(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <HiOutlineX size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-primary/5 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Package</p>
                  <p className="font-bold text-gray-900">{selectedDrive?.package}</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-1">Min CGPA</p>
                  <p className="font-bold text-gray-900">{selectedDrive?.minCGPA || 0}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-2xl">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Match Score</p>
                  <p className="font-bold text-gray-900">{selectedDrive?.aiMatchScore ?? 0}%</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Job Description</h4>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {selectedDrive?.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {(selectedDrive?.requiredSkills || []).map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200">
                  <h4 className="text-sm font-bold text-slate-900 mb-3">Eligibility Details</h4>
                  <ul className="space-y-2 text-xs font-medium text-slate-600">
                    <li className="flex items-center"><HiOutlineChevronRight className="mr-2 text-primary" /> Branches: {(selectedDrive?.eligibleBranches || []).join(', ')}</li>
                    <li className="flex items-center"><HiOutlineChevronRight className="mr-2 text-primary" /> Max Backlogs Allowed: {selectedDrive?.maxBacklogs ?? 0}</li>
                    <li className="flex items-center"><HiOutlineChevronRight className="mr-2 text-primary" /> Total Openings: {selectedDrive?.totalPositions ?? 0}</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex gap-4">
              <button 
                onClick={() => setSelectedDrive(null)}
                className="flex-1 py-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all"
              >
                Close
              </button>
              <button 
                onClick={() => handleApply(selectedDrive?._id)}
                disabled={isApplied(selectedDrive) || applying === selectedDrive?._id}
                className={`flex-[2] py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center space-x-2 ${
                  isApplied(selectedDrive) 
                    ? 'bg-emerald-500 cursor-default' 
                    : 'bg-primary hover:bg-secondary'
                }`}
              >
                {applying === selectedDrive?._id ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : isApplied(selectedDrive) ? (
                  <>
                    <HiOutlineCheckCircle size={20} />
                    <span>Application Submitted</span>
                  </>
                ) : (
                  'Confirm & Apply'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Drives;
