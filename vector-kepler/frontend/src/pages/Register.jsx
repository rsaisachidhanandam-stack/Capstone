import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await register({ ...formData, role: formData.role.toLowerCase() });
    setLoading(false);
    if (res.success) {
      navigate('/login');
    } else {
      setError(res.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-6">Create Account</h2>
      {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
          <input name="name" type="text" required onChange={handleChange} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
          <input name="email" type="email" required onChange={handleChange} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
          <input name="password" type="password" required onChange={handleChange} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
          <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-blue-500">
            <option value="student">Student</option>
            <option value="department">Department Incharge</option>
            <option value="tpo">TPO Admin</option>
          </select>
        </div>
        
        {formData.role !== 'tpo' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
            <input name="department" type="text" required onChange={handleChange} className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        )}

        
        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition flex justify-center items-center mt-4">
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Register'}
        </button>
      </form>
      <div className="mt-6 text-center text-sm">
        <span className="text-slate-500">Already have an account? </span>
        <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
      </div>
    </div>
  );
};

export default Register;
