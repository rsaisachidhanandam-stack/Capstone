import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { HiUser, HiMail, HiLockClosed, HiEye, HiEyeOff, HiUserGroup } from 'react-icons/hi';
import { FaBullseye, FaRobot, FaChartBar } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const { name, email, password, confirmPassword, role } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', { name, email, password, role });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err || 'Registration failed. Please try again.');
      toast.error(err || 'Registration Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-inter">
      {/* Left Side - 40% */}
      <div className="hidden lg:flex lg:w-[40%] bg-gradient-to-br from-[#0f172a] to-[#1e3a5f] p-12 flex-col justify-between text-white">
        <div>
          <div className="flex items-center space-x-3 mb-12">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold text-xl">
              I
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              IntelliPlace <span className="text-primary">AI</span>
            </h1>
          </div>
          
          <div className="space-y-8 mt-20">
            <h2 className="text-4xl font-extrabold leading-tight">
              Join the Next Generation of Placements
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-white/10 p-2 rounded-lg text-primary">
                  <FaBullseye size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Smart Placement Matching</h3>
                  <p className="text-gray-300 text-sm">Our AI algorithm matches your profile with the best career opportunities.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white/10 p-2 rounded-lg text-success">
                  <FaRobot size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI Resume Analyzer</h3>
                  <p className="text-gray-300 text-sm">Instant feedback on your resume with personalized improvement tips.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white/10 p-2 rounded-lg text-warning">
                  <FaChartBar size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Real-time Analytics</h3>
                  <p className="text-gray-300 text-sm">Track placement stats, drive updates, and application status live.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-l-2 border-primary/30 pl-6 py-2">
          <p className="text-gray-400 italic text-sm">
            "Your placement journey starts here. IntelliPlace AI handles the complexity so you can focus on your performance."
          </p>
          <p className="text-xs font-semibold mt-2 text-primary uppercase tracking-wider">
            — TPO CELL, UNIVERSITY
          </p>
        </div>
      </div>

      {/* Right Side - 60% */}
      <div className="w-full lg:w-[60%] flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500">Get started with your dedicated placement portal</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-danger text-danger text-sm rounded flex items-center">
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <HiUser size={20} />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={name}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <HiMail size={20} />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="name@university.edu"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <HiLockClosed size={20} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    value={password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <HiLockClosed size={20} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    value={confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div 
              className="flex items-center text-xs text-gray-500 cursor-pointer mb-2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <HiEyeOff size={16} className="mr-1" /> : <HiEye size={16} className="mr-1" />}
              {showPassword ? 'Hide Passwords' : 'Show Passwords'}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Register As
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <HiUserGroup size={20} />
                </div>
                <select
                  name="role"
                  value={role}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
                >
                  <option value="student">Student</option>
                  <option value="department">Department Incharge</option>
                  <option value="tpo">TPO Admin</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-primary hover:text-secondary">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
