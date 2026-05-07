import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed, HiArrowNarrowRight, HiSparkles, HiShieldCheck, HiOutlineCubeTransparent } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error('Please fill in all fields');
    }

    try {
      setLoading(true);
      const user = await login(formData.email, formData.password);
      toast.success(`Welcome back, ${user?.name || 'User'}!`);
      
      // Redirect based on role
      if (user.role === 'student') navigate('/student/dashboard');
      else if (user.role === 'tpo') navigate('/tpo/dashboard');
      else if (user.role === 'department') navigate('/department/dashboard');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden font-inter">
      
      {/* Brand Side (Left) - Hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0a0a0a] relative flex-col justify-between p-16 animate-in slide-in-from-left duration-1000">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-0 left-0 w-full h-[600px] bg-blue-500 rounded-full blur-[200px] opacity-10 -ml-64 -mt-64"></div>
           <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500 rounded-full blur-[150px] opacity-10 -mr-32 -mb-32"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 text-white">
            <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center">
              <HiSparkles className="text-black" size={20} />
            </div>
            <span className="text-2xl font-black tracking-tight">IntelliPlace AI</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-6xl font-extrabold text-white leading-[1.1] tracking-tighter mb-8">
            The standard for <br />
            <span className="text-zinc-500 italic font-medium">campus recruitment.</span>
          </h1>
          <p className="text-zinc-500 text-xl font-medium leading-relaxed">
            Enterprise-grade placement management powered by advanced analysis and automated workflows.
          </p>
          
          <div className="mt-16 grid grid-cols-2 gap-8">
             <div className="space-y-3">
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-blue-400">
                   <HiShieldCheck size={20} />
                </div>
                <h3 className="text-white font-bold text-sm">Security Assured</h3>
                <p className="text-zinc-500 text-xs font-medium">Encrypted data vaults for student records and documents.</p>
             </div>
             <div className="space-y-3">
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-emerald-400">
                   <HiOutlineCubeTransparent size={20} />
                </div>
                <h3 className="text-white font-bold text-sm">AI Engine</h3>
                <p className="text-zinc-500 text-xs font-medium">Sophisticated matching algorithms for precision shortlisting.</p>
             </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">Build 1.2.4 Final</p>
          <div className="flex space-x-4 opacity-50">
             <div className="w-2 h-2 rounded-full bg-white"></div>
             <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
             <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
          </div>
        </div>
      </div>

      {/* Form Side (Right) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16 animate-in fade-in duration-700">
        <div className="w-full max-w-md space-y-12">
          <div className="space-y-4">
             <div className="lg:hidden flex items-center space-x-2 mb-8 text-black">
                <HiSparkles size={24} />
                <span className="text-xl font-black tracking-tight">IntelliPlace</span>
             </div>
             <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Welcome back</h2>
             <p className="text-zinc-500 font-medium">Enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Work Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlineMail className="text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold text-zinc-900 transition-all focus:bg-white focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 outline-none placeholder-zinc-400"
                  placeholder="name@university.edu"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                 <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Password</label>
                 <a href="#" className="text-[10px] font-black text-zinc-400 hover:text-zinc-900 tracking-widest uppercase underline transition-colors">Forgot Password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-sm font-bold text-zinc-900 transition-all focus:bg-white focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 outline-none placeholder-zinc-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center space-x-3 px-8 py-5 bg-zinc-950 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-black/10 hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50 group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Continue to Workspace</span>
                    <HiArrowNarrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="pt-8 border-t border-zinc-100 text-center">
             <p className="text-sm font-medium text-zinc-500">
               Need an account? <Link to="/register" className="text-zinc-900 font-bold hover:underline">Get started here</Link>
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
