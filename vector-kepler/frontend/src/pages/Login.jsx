import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      navigate(`/${res.role}-dashboard`);
    } else {
      setError(res.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-6">Welcome Back</h2>
      {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
          <input 
            type="email" 
            required 
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={email} onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
          <input 
            type="password" 
            required 
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition"
            value={password} onChange={e => setPassword(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition flex justify-center items-center"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign In'}
        </button>
      </form>
      <div className="mt-6 text-center text-sm">
        <span className="text-slate-500">Don't have an account? </span>
        <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
      </div>
    </div>
  );
};

export default Login;
