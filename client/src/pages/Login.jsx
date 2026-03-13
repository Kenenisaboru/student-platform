import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 p-4 sm:p-8 relative overflow-hidden">
      {/* Background Decorative Shapes */}
      <div className="absolute top-0 left-10 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-10 left-32 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-6xl w-full relative z-10 flex flex-col lg:flex-row rounded-[2rem] shadow-2xl overflow-hidden bg-white/5 backdrop-blur-3xl border border-white/10"
      >
        {/* Left Side: Motivational Letter */}
        <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center relative bg-gradient-to-bl from-primary-900/40 to-indigo-900/40 z-20 overflow-hidden">
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-tr from-primary-600 to-purple-600 rounded-2xl mb-10 flex items-center justify-center rotate-3 shadow-xl shadow-primary-500/30"
            >
              <h1 className="text-3xl font-extrabold text-white -rotate-3">AAN</h1>
            </motion.div>

            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Welcome Back <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-purple-300">Innovator.</span>
            </h2>
            
            <p className="text-lg text-primary-100/90 mb-10 leading-relaxed font-medium">
              "The beautiful thing about learning is that no one can take it away from you."
            </p>

            <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
              <div className="flex items-center space-x-4 mb-3">
                <div className="flex -space-x-3">
                  <img className="w-10 h-10 rounded-full border-2 border-slate-800 object-cover" src="https://i.pravatar.cc/100?img=1" alt="User 1" />
                  <img className="w-10 h-10 rounded-full border-2 border-slate-800 object-cover" src="https://i.pravatar.cc/100?img=2" alt="User 2" />
                  <img className="w-10 h-10 rounded-full border-2 border-slate-800 object-cover" src="https://i.pravatar.cc/100?img=3" alt="User 3" />
                </div>
                <p className="text-white font-semibold text-sm">Join 1,000+ active students</p>
              </div>
              <p className="text-primary-200/80 text-sm">Your friends and study partners are waiting for you inside.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="lg:w-1/2 bg-white p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-10 hidden lg:block">
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h3>
            <p className="text-slate-500 font-medium">Access your Arsi Aseko Network account</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center"
            >
              <span className="font-semibold">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  className="w-full bg-slate-50 hover:bg-white border border-slate-200 focus:border-primary-500 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary-500 w-5 h-5 transition-colors" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 ml-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-all">Forgot?</a>
              </div>
              <div className="relative group">
                <input
                  type="password"
                  required
                  className="w-full bg-slate-50 hover:bg-white border border-slate-200 focus:border-primary-500 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary-500 w-5 h-5 transition-colors" />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white py-4 rounded-2xl flex items-center justify-center font-bold text-lg shadow-xl shadow-primary-600/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-6"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>Sign In <ArrowRight className="w-5 h-5 ml-2" /></>
              )}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-slate-600 font-medium">
            New to the network?{' '}
            <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700 hover:underline transition-all">
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

