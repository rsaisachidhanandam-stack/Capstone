import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { HiOutlinePlus, HiOutlineX } from 'react-icons/hi';
import { BRANCHES } from '../../utils/constants';

const CreateDrive = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    package: '',
    description: '',
    minCGPA: 6.0,
    maxBacklogs: 0,
    eligibleBranches: [],
    requiredSkills: [],
    deadline: '',
    driveDate: '',
    status: 'active',
    jobLocation: '',
    jobType: 'full-time',
    companyWebsite: '',
    totalPositions: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBranchChange = (branch) => {
    const currentBranches = [...formData.eligibleBranches];
    if (currentBranches.includes(branch)) {
      setFormData({
        ...formData,
        eligibleBranches: currentBranches.filter(b => b !== branch)
      });
    } else {
      setFormData({
        ...formData,
        eligibleBranches: [...currentBranches, branch]
      });
    }
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.requiredSkills.includes(skillInput.trim())) {
        setFormData({
          ...formData,
          requiredSkills: [...formData.requiredSkills, skillInput.trim()]
        });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      requiredSkills: formData.requiredSkills.filter(s => s !== skillToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.eligibleBranches.length === 0) {
      return toast.error('Please select at least one eligible branch');
    }
    if (formData.requiredSkills.length === 0) {
      return toast.error('Please add at least one required skill');
    }

    setLoading(true);
    try {
      await api.post('/drives', formData);
      toast.success('Placement drive created successfully!');
      navigate('/tpo/drives');
    } catch (err) {
      toast.error(err || 'Failed to create drive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Create Placement Drive">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-900">Drive Configuration</h3>
          <p className="text-sm text-gray-500">Specify company details and eligibility criteria</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Company Details Section */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-primary/10 pb-2">Company Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                <input
                  type="text"
                  name="company"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="e.g. Google, Microsoft"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Role *</label>
                <input
                  type="text"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Package / CTC *</label>
                <input
                  type="text"
                  name="package"
                  required
                  value={formData.package}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="e.g. 12 LPA"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Type</label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none bg-white"
                >
                  <option value="full-time">Full-time</option>
                  <option value="internship">Internship</option>
                  <option value="part-time">Part-time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Location</label>
                <input
                  type="text"
                  name="jobLocation"
                  value={formData.jobLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="e.g. Bangalore, Remote"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Website</label>
                <input
                  type="url"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="https://company.com"
                />
              </div>
            </div>
          </div>

          {/* Eligibility Section */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-primary/10 pb-2">Eligibility Criteria</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Min CGPA *</label>
                <input
                  type="number"
                  name="minCGPA"
                  step="0.1"
                  min="0"
                  max="10"
                  required
                  value={formData.minCGPA}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Backlogs *</label>
                <input
                  type="number"
                  name="maxBacklogs"
                  min="0"
                  required
                  value={formData.maxBacklogs}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Total Positions</label>
                <input
                  type="number"
                  name="totalPositions"
                  min="1"
                  value={formData.totalPositions}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Eligible Branches *</label>
              <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                {BRANCHES.map(branch => (
                  <label key={branch} className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-300 transition-all"
                      checked={formData.eligibleBranches.includes(branch)}
                      onChange={() => handleBranchChange(branch)}
                    />
                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">{branch}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Required Skills * (Press Enter to add)</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.requiredSkills.map(skill => (
                  <span key={skill} className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="ml-2 hover:text-danger">
                      <HiOutlineX size={14} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                placeholder="e.g. React.js, Node.js, AWS..."
              />
            </div>
          </div>

          {/* Dates & Description */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 border-b border-primary/10 pb-2">Timeline & Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Application Deadline *</label>
                <input
                  type="date"
                  name="deadline"
                  required
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Drive Date</label>
                <input
                  type="date"
                  name="driveDate"
                  value={formData.driveDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description *</label>
              <textarea
                name="description"
                rows="5"
                required
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                placeholder="Detailed job description, responsibilities, and extra requirements..."
              ></textarea>
            </div>

            <div className="w-1/3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Initial Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none appearance-none bg-white"
              >
                <option value="active">Active (Immediate Visibility)</option>
                <option value="draft">Draft (Hidden)</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-8 border-t border-gray-100 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/tpo/drives')}
              className="px-6 py-2.5 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition-all shadow-lg shadow-primary/20 flex items-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <HiOutlinePlus size={20} />
                  <span>Create Drive</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateDrive;
