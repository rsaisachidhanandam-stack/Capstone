import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { HiOutlineUser, HiAcademicCap, HiOutlineCode, HiOutlineSave, HiPencilAlt, HiOutlineChevronRight, HiOutlineX, HiOutlinePlus } from 'react-icons/hi';
import { BRANCHES } from '../../utils/constants';

const Profile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const [formData, setFormData] = useState({
    rollNumber: '',
    branch: '',
    cgpa: 0,
    skills: [],
    phone: '',
    linkedIn: '',
    github: '',
    tenthPercent: 0,
    twelthPercent: 0,
    graduationYear: new Date().getFullYear(),
    backlogs: 0
  });

  const popularSkills = ['Python', 'Java', 'React', 'Node.js', 'SQL', 'MongoDB', 'AWS', 'Docker', 'ML', 'DSA'];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.get('/students/profile');
        if (res.data && res.data.data) {
          setFormData(prev => ({
            ...prev,
            ...res.data.data,
            skills: res.data.data.skills || []
          }));
        }
      } catch (err) {
        // If 404, it just means profile isn't created yet, which is fine
        if (err.response?.status !== 404) {
          toast.error('Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSkill = (skill) => {
    const cleanSkill = typeof skill === 'string' ? skill.trim() : skillInput.trim();
    if (cleanSkill && !(formData?.skills || []).includes(cleanSkill)) {
      setFormData({
        ...formData,
        skills: [...(formData?.skills || []), cleanSkill]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: (formData?.skills || []).filter(s => s !== skillToRemove)
    });
  };

  const calculateCompletion = () => {
    const fields = ['rollNumber', 'branch', 'cgpa', 'phone', 'linkedIn', 'github', 'tenthPercent', 'twelthPercent', 'graduationYear'];
    const filled = fields.filter(field => formData[field] && formData[field] !== 0).length;
    const skillsFilled = (formData?.skills || []).length > 0 ? 1 : 0;
    return Math.round(((filled + skillsFilled) / (fields.length + 1)) * 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...formData,
      cgpa: parseFloat(formData.cgpa) || 0,
      tenthPercent: parseFloat(formData.tenthPercent) || 0,
      twelthPercent: parseFloat(formData.twelthPercent) || 0,
      graduationYear: parseInt(formData.graduationYear) || 2025,
      backlogs: parseInt(formData.backlogs) || 0,
      skills: Array.isArray(formData.skills) ? formData.skills : []
    };

    console.log('Sending Profile Data:', payload);

    try {
      await api.post('/students/profile', payload);
      toast.success('Profile saved successfully!');
      setEditMode(false);
    } catch (err) {
      console.error('Save Profile Error:', err);
      toast.error(err?.response?.data?.message || err?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout title="My Profile">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  const completion = calculateCompletion();

  return (
    <Layout title="Student Profile">
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        {/* Header Section */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32"></div>
          
          <div className="relative flex flex-col md:flex-row items-center md:items-start md:space-x-8">
            <div className="w-32 h-32 rounded-3xl bg-primary/10 flex items-center justify-center text-primary font-black text-4xl border-4 border-white shadow-xl mb-6 md:mb-0">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-black text-gray-900">{currentUser?.name ?? 'Student'}</h2>
                  <p className="text-gray-500 font-medium">{currentUser?.email ?? 'N/A'}</p>
                </div>
                <button 
                  onClick={() => setEditMode(!editMode)}
                  className={`px-6 py-2.5 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all ${
                    editMode ? 'bg-amber-50 text-amber-600' : 'bg-primary text-white shadow-lg shadow-primary/20'
                  }`}
                >
                  {editMode ? <HiOutlineX size={20} /> : <HiPencilAlt size={20} />}
                  <span>{editMode ? 'Cancel Editing' : 'Edit Profile'}</span>
                </button>
              </div>

              <div className="mt-8">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Profile Completion</span>
                  <span className={`text-sm font-black ${completion > 80 ? 'text-emerald-500' : 'text-primary'}`}>{completion}%</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${completion > 80 ? 'bg-emerald-500' : 'bg-primary'}`}
                    style={{ width: `${completion}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main info - 2 cols */}
          <div className="lg:col-span-2 space-y-8">
            {/* Section 1 - Personal & Contact */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <HiOutlineUser className="mr-3 text-primary" size={24} />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Roll Number</label>
                  <input
                    type="text"
                    name="rollNumber"
                    disabled={!editMode}
                    value={formData?.rollNumber ?? ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium disabled:opacity-60"
                    placeholder="e.g. 21CS001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    disabled={!editMode}
                    value={formData?.phone ?? ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium disabled:opacity-60"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedIn"
                    disabled={!editMode}
                    value={formData?.linkedIn ?? ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium disabled:opacity-60"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">GitHub Profile</label>
                  <input
                    type="url"
                    name="github"
                    disabled={!editMode}
                    value={formData?.github ?? ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium disabled:opacity-60"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>
            </div>

            {/* Section 2 - Academic */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <HiAcademicCap className="mr-3 text-primary" size={24} />
                Academic Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Branch</label>
                  <select
                    name="branch"
                    disabled={!editMode}
                    value={formData?.branch ?? ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium disabled:opacity-60 appearance-none"
                  >
                    <option value="">Select Branch</option>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Current CGPA</label>
                  <input
                    type="number"
                    name="cgpa"
                    step="0.01"
                    min="0"
                    max="10"
                    disabled={!editMode}
                    value={formData?.cgpa ?? 0}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">10th Percentage</label>
                  <input
                    type="number"
                    name="tenthPercent"
                    step="0.01"
                    disabled={!editMode}
                    value={formData?.tenthPercent ?? 0}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">12th Percentage</label>
                  <input
                    type="number"
                    name="twelthPercent"
                    step="0.01"
                    disabled={!editMode}
                    value={formData?.twelthPercent ?? 0}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Graduation Year</label>
                  <input
                    type="number"
                    name="graduationYear"
                    disabled={!editMode}
                    value={formData?.graduationYear ?? new Date().getFullYear()}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Active Backlogs</label>
                  <input
                    type="number"
                    name="backlogs"
                    disabled={!editMode}
                    value={formData?.backlogs ?? 0}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium disabled:opacity-60"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar info - 1 col */}
          <div className="space-y-8">
            {/* Section 3 - Skills */}
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 flex flex-col h-full">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <HiOutlineCode className="mr-3 text-primary" size={24} />
                Technical Skills
              </h3>
              
              <div className="flex-1 space-y-6">
                <div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(formData?.skills || []).map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-primary/5 text-primary rounded-xl text-xs font-bold flex items-center">
                        {skill}
                        {editMode && (
                          <button 
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 hover:text-danger"
                          >
                            <HiOutlineX size={14} />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  {editMode && (
                    <div className="relative">
                      <input
                        type="text"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                        placeholder="Add a skill..."
                        className="w-full px-4 py-3 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                      />
                      <button 
                        type="button" 
                        onClick={() => handleAddSkill()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-primary hover:bg-white rounded-lg transition-colors"
                      >
                        <HiOutlinePlus size={20} />
                      </button>
                    </div>
                  )}
                </div>

                {editMode && (
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Popular Suggestions</label>
                    <div className="flex flex-wrap gap-2">
                      {popularSkills.filter(s => !(formData?.skills || []).includes(s)).map(skill => (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => handleAddSkill(skill)}
                          className="px-3 py-1.5 bg-gray-50 text-gray-500 rounded-xl text-xs font-semibold hover:bg-primary hover:text-white transition-all"
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {editMode && (
                <div className="mt-8">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:bg-secondary transition-all flex items-center justify-center space-x-2"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <HiOutlineSave size={20} />
                        <span>Save Profile</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Profile;
