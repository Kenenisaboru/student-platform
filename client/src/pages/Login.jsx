import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (emailStr, passStr) => {
    setEmail(emailStr);
    setPassword(passStr);
    // Allow state to update before submitting
    setTimeout(() => {
      document.querySelector('form').dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }, 100);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#060a14] p-4 sm:p-8 relative overflow-hidden">
      {/* Background Decorative Shapes */}
      <div className="absolute top-0 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob"></div>
      <div className="absolute top-0 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-10 left-32 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob animation-delay-4000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-5xl w-full relative z-10 flex flex-col lg:flex-row rounded-[2rem] shadow-2xl overflow-hidden glass-card"
      >
        {/* Left Side: Motivational Letter */}
        <div className="lg:w-1/2 p-10 lg:p-14 flex flex-col justify-center relative bg-gradient-to-bl from-blue-900/20 to-indigo-900/20 z-20 overflow-hidden border-r border-white/[0.04]">
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-8 flex items-center justify-center rotate-3 shadow-xl shadow-blue-500/20"
            >
              <h1 className="text-2xl font-extrabold text-white -rotate-3">AA</h1>
            </motion.div>

            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-5 leading-tight tracking-tight">
              Welcome Back <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Innovator.</span>
            </h2>
            
            <p className="text-base text-blue-200/60 mb-8 leading-relaxed font-medium">
              "The beautiful thing about learning is that no one can take it away from you."
            </p>

            {/* Quick Access for Admins/Testers */}
            <div className="mt-8 p-5 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/[0.06]">
              <div className="flex items-center space-x-2 mb-3">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <p className="text-white font-bold text-xs uppercase tracking-widest">Quick Sign-In</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => handleQuickLogin('student@example.com', 'Password123!')}
                  className="bg-white/[0.05] hover:bg-white/[0.1] text-white py-2.5 rounded-xl text-[11px] font-bold transition-all border border-white/[0.05]"
                >
                  Student Demo
                </button>
                <button 
                  onClick={() => handleQuickLogin('kananiman710@gmail.com', 'AdminPassword123!')}
                  className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 py-2.5 rounded-xl text-[11px] font-bold transition-all border border-blue-500/20"
                >
                  Admin Demo
                </button>
              </div>
              <p className="mt-3 text-[10px] text-slate-500 text-center font-medium">One-click access for platform testing</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:w-1/2 bg-[#0a0f1e] p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
          <div className="mb-8 hidden lg:block">
            <h3 className="text-2xl font-bold text-white mb-2">Sign In</h3>
            <p className="text-slate-500 font-medium text-sm">Access your Arsi Aseko Network account</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-red-500/10 text-red-400 rounded-xl text-sm border border-red-500/10 flex items-center"
            >
              <span className="font-semibold">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] focus:border-blue-500/30 focus:bg-white/[0.06] rounded-xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-slate-600"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-4 top-3.5 text-slate-600 group-focus-within:text-blue-400 w-5 h-5 transition-colors" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 ml-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <Link to="/forgot-password" title="Forgot Password" className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-all cursor-pointer">Forgot?</Link>
              </div>
              <div className="relative group">
                <input
                  type="password"
                  required
                  className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] focus:border-blue-500/30 focus:bg-white/[0.06] rounded-xl py-3.5 pl-12 pr-4 text-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-slate-600"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-4 top-3.5 text-slate-600 group-focus-within:text-blue-400 w-5 h-5 transition-colors" />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 rounded-xl flex items-center justify-center font-bold text-base shadow-xl shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-4"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>Sign In <ArrowRight className="w-5 h-5 ml-2" /></>
              )}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-slate-500 font-medium text-sm">
            New to the network?{' '}
            <Link to="/register" className="text-blue-400 font-bold hover:text-blue-300 transition-all">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
