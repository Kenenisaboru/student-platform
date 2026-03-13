import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, School, Briefcase, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    university: '',
    department: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 p-4 sm:p-8 relative overflow-hidden">
      {/* Background Decorative Shapes */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 left-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-10 right-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-6xl w-full relative z-10 flex flex-col lg:flex-row rounded-[2rem] shadow-2xl overflow-hidden bg-white/5 backdrop-blur-3xl border border-white/10"
      >
        {/* Left Side: Motivational Letter */}
        <div className="lg:w-1/2 p-10 lg:p-16 flex flex-col justify-center relative bg-gradient-to-br from-primary-900/40 to-indigo-900/40 z-20 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-tr from-primary-500 to-indigo-500 rounded-2xl mb-10 flex items-center justify-center -rotate-3 shadow-xl shadow-indigo-500/30"
            >
              <h1 className="text-3xl font-extrabold text-white rotate-3">AAN</h1>
            </motion.div>

            <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
              Shape Your Future, <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-indigo-300">Together.</span>
            </h2>
            
            <p className="text-lg text-primary-100/90 mb-10 leading-relaxed font-medium">
              "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
            </p>

            <div className="space-y-6">
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg">
                  <School className="w-6 h-6 text-primary-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">Unite Academic Minds</h3>
                  <p className="text-primary-200/80 text-sm">Connect with peers across Arsi Aseko universities.</p>
                </div>
              </div>
              <div className="flex items-center space-x-5">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 shadow-lg">
                  <Briefcase className="w-6 h-6 text-indigo-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">Launch Your Career</h3>
                  <p className="text-primary-200/80 text-sm">Build a network that accelerates your professional growth.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:w-1/2 bg-white p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="mb-8 hidden lg:block">
            <h3 className="text-3xl font-bold text-slate-900 mb-2">Join the Network</h3>
            <p className="text-slate-500 font-medium">Create your account to get started</p>
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
              <div className="relative group">
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full bg-slate-50 hover:bg-white border border-slate-200 focus:border-primary-500 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                />
                <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary-500 w-5 h-5 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full bg-slate-50 hover:bg-white border border-slate-200 focus:border-primary-500 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300"
                  placeholder="student@uni.edu"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary-500 w-5 h-5 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">University</label>
                <div className="relative group">
                  <input
                    name="university"
                    type="text"
                    required
                    className="w-full bg-slate-50 hover:bg-white border border-slate-200 focus:border-primary-500 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-800 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300"
                    placeholder="AAU, etc."
                    value={formData.university}
                    onChange={handleChange}
                  />
                  <School className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary-500 w-4 h-4 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Department</label>
                <div className="relative group">
                  <input
                    name="department"
                    type="text"
                    required
                    className="w-full bg-slate-50 hover:bg-white border border-slate-200 focus:border-primary-500 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 text-sm text-slate-800 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300"
                    placeholder="CS, Medicine..."
                    value={formData.department}
                    onChange={handleChange}
                  />
                  <Briefcase className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary-500 w-4 h-4 transition-colors" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Password</label>
              <div className="relative group">
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full bg-slate-50 hover:bg-white border border-slate-200 focus:border-primary-500 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 text-slate-800 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                />
                <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary-500 w-5 h-5 transition-colors" />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white py-4 rounded-2xl flex items-center justify-center font-bold text-lg shadow-xl shadow-primary-600/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-4"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>Create Account <ArrowRight className="w-5 h-5 ml-2" /></>
              )}
            </motion.button>
          </form>

          <p className="mt-8 text-center text-slate-600 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 hover:underline transition-all">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
