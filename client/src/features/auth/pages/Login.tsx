import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '@/src/features/auth/store/authSlice';
import axios from 'axios';
import { motion } from 'framer-motion';
import { KeyRound, Mail, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      toast.success('Successfully logged in');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center px-4 md:px-6 py-24 md:py-32 relative overflow-hidden">
      
      {/* Decorative */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-900/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-[#0a0a0a] p-8 md:p-12 rounded-[1.5rem] md:rounded-[2rem] border border-white/5 relative z-10"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h2>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Sign in to your client portal</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-white transition-colors" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#030303] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-slate-700"
                placeholder="you@example.com"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-1">Password</label>
            <div className="relative group">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-white transition-colors" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#030303] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-sm focus:outline-none focus:border-white/20 transition-all placeholder:text-slate-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-white text-black py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 group mt-4"
          >
            Sign In
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-xs">
          Don't have an account? <Link to="/register" className="text-white hover:text-blue-400 font-medium transition-colors ml-1">Register</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
