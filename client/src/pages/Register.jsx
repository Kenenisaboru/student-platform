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
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  const checkPasswordStrength = (pass) => {
    setPasswordStrength({
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      lowercase: /[a-z]/.test(pass),
      number: /\d/.test(pass),
      special: /[!@#$%^&*]/.test(pass)
    });
  };

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'password') {
      checkPasswordStrength(e.target.value);
    }
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
    <div className="min-h-screen flex items-center justify-center bg-[#060a14] p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute top-0 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob"></div>
      <div className="absolute top-0 left-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-10 right-32 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-blob animation-delay-4000"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="max-w-5xl w-full relative z-10 flex flex-col lg:flex-row rounded-[2rem] shadow-2xl overflow-hidden glass-card"
      >
        {/* Left Side */}
        <div className="lg:w-1/2 p-10 lg:p-14 flex flex-col justify-center relative bg-gradient-to-br from-blue-900/20 to-indigo-900/20 z-20 overflow-hidden border-r border-white/[0.04]">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-8 flex items-center justify-center -rotate-3 shadow-xl shadow-blue-500/20"
            >
              <h1 className="text-2xl font-extrabold text-white rotate-3">AAU</h1>
            </motion.div>

            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-5 leading-tight tracking-tight">
              Shape Your Future, <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Together at AAUS.</span>
            </h2>

            <p className="text-base text-blue-200/60 mb-8 leading-relaxed font-medium">
              "Education is the passport to the future, for tomorrow belongs to those who prepare for it today."
            </p>

            <div className="space-y-5">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/[0.04] rounded-xl flex items-center justify-center backdrop-blur-md border border-white/[0.06]">
                  <School className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-base">Unite Arsi Aseko student  Minds</h3>
                  <p className="text-slate-500 text-sm">Connect with peers across our university Experiences.</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/[0.04] rounded-xl flex items-center justify-center backdrop-blur-md border border-white/[0.06]">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-base">Empower Your Career</h3>
                  <p className="text-slate-500 text-sm">Build a network that accelerates your growth at Arsi Aseko.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:w-1/2 bg-[#0a0f1e] p-8 sm:p-10 lg:p-14 flex flex-col justify-center">
          <div className="mb-7 hidden lg:block">
            <h3 className="text-2xl font-bold text-white mb-2">Join the Portal</h3>
            <p className="text-slate-500 font-medium text-sm">Create your account to get started</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-5 p-4 bg-red-500/10 text-red-400 rounded-xl text-sm border border-red-500/10 flex items-center"
            >
              <span className="font-semibold">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
              <div className="relative group">
                <input name="name" type="text" required className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] focus:border-blue-500/30 focus:bg-white/[0.06] rounded-xl py-3 pl-11 pr-4 text-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-slate-600 text-sm" placeholder="John Doe" value={formData.name} onChange={handleChange} />
                <User className="absolute left-3.5 top-3 text-slate-600 group-focus-within:text-blue-400 w-4.5 h-4.5 transition-colors" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
              <div className="relative group">
                <input name="email" type="email" required className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] focus:border-blue-500/30 focus:bg-white/[0.06] rounded-xl py-3 pl-11 pr-4 text-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-slate-600 text-sm" placeholder="student@arsiaseko.edu.et" value={formData.email} onChange={handleChange} />
                <Mail className="absolute left-3.5 top-3 text-slate-600 group-focus-within:text-blue-400 w-4.5 h-4.5 transition-colors" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">University</label>
                <div className="relative group">
                  <input name="university" type="text" required className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] focus:border-blue-500/30 focus:bg-white/[0.06] rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-slate-600" placeholder="Arsi Aseko University" value={formData.university} onChange={handleChange} />
                  <School className="absolute left-3.5 top-3 text-slate-600 group-focus-within:text-blue-400 w-4 h-4 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Department</label>
                <div className="relative group">
                  <select
                    name="department"
                    required
                    className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] focus:border-blue-500/30 focus:bg-white/[0.06] rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all duration-300 appearance-none"
                    value={formData.department}
                    onChange={handleChange}
                  >
                    <option value="" disabled className="bg-[#0a0f1e] text-slate-500">
                      Select Department
                    </option>

                    {/* Computing */}
                    <option value="Computer Science" className="bg-[#0a0f1e]">Computer Science</option>
                    <option value="Software Engineering" className="bg-[#0a0f1e]">Software Engineering</option>
                    <option value="Information Technology" className="bg-[#0a0f1e]">Information Technology</option>
                    <option value="Information Systems" className="bg-[#0a0f1e]">Information Systems</option>
                    <option value="Cyber Security" className="bg-[#0a0f1e]">Cyber Security</option>
                    <option value="Data Science" className="bg-[#0a0f1e]">Data Science</option>

                    {/* Engineering */}
                    <option value="Electrical Engineering" className="bg-[#0a0f1e]">Electrical Engineering</option>
                    <option value="Mechanical Engineering" className="bg-[#0a0f1e]">Mechanical Engineering</option>
                    <option value="Civil Engineering" className="bg-[#0a0f1e]">Civil Engineering</option>
                    <option value="Chemical Engineering" className="bg-[#0a0f1e]">Chemical Engineering</option>
                    <option value="Industrial Engineering" className="bg-[#0a0f1e]">Industrial Engineering</option>

                    {/* Health */}
                    <option value="Medicine" className="bg-[#0a0f1e]">Medicine</option>
                    <option value="Nursing" className="bg-[#0a0f1e]">Nursing</option>
                    <option value="Pharmacy" className="bg-[#0a0f1e]">Pharmacy</option>
                    <option value="Public Health" className="bg-[#0a0f1e]">Public Health</option>

                    {/* Business */}
                    <option value="Business Administration" className="bg-[#0a0f1e]">Business Administration</option>
                    <option value="Accounting and Finance" className="bg-[#0a0f1e]">Accounting and Finance</option>
                    <option value="Marketing Management" className="bg-[#0a0f1e]">Marketing Management</option>
                    <option value="Economics" className="bg-[#0a0f1e]">Economics</option>

                    {/* Social Sciences */}
                    <option value="Political Science" className="bg-[#0a0f1e]">Political Science</option>
                    <option value="Sociology" className="bg-[#0a0f1e]">Sociology</option>
                    <option value="Psychology" className="bg-[#0a0f1e]">Psychology</option>
                    <option value="Law" className="bg-[#0a0f1e]">Law</option>

                    {/* Natural Sciences */}
                    <option value="Mathematics" className="bg-[#0a0f1e]">Mathematics</option>
                    <option value="Physics" className="bg-[#0a0f1e]">Physics</option>
                    <option value="Chemistry" className="bg-[#0a0f1e]">Chemistry</option>
                    <option value="Biology" className="bg-[#0a0f1e]">Biology</option>

                    {/* Agriculture */}
                    <option value="Agronomy" className="bg-[#0a0f1e]">Agronomy</option>
                    <option value="Animal Science" className="bg-[#0a0f1e]">Animal Science</option>
                    <option value="Plant Science" className="bg-[#0a0f1e]">Plant Science</option>
                    <option value="Agricultural Economics" className="bg-[#0a0f1e]">Agricultural Economics</option>

                    {/* Education */}
                    <option value="Education" className="bg-[#0a0f1e]">Education</option>
                    <option value="Curriculum and Instruction" className="bg-[#0a0f1e]">Curriculum and Instruction</option>

                  </select>
                  <Briefcase className="absolute left-3.5 top-3 text-slate-600 group-focus-within:text-blue-400 w-4 h-4 transition-colors" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Password</label>
              <div className="relative group">
                <input name="password" type="password" required className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.06] focus:border-blue-500/30 focus:bg-white/[0.06] rounded-xl py-3 pl-11 pr-4 text-white focus:ring-2 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-slate-600 text-sm" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                <Lock className="absolute left-3.5 top-3 text-slate-600 group-focus-within:text-blue-400 w-4.5 h-4.5 transition-colors" />
              </div>

              {/* Password Strength Checklist */}
              {formData.password && (
                <div className="mt-3 grid grid-cols-2 gap-2 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                  {[
                    { key: 'length', label: '8+ Characters' },
                    { key: 'uppercase', label: 'Uppercase' },
                    { key: 'lowercase', label: 'Lowercase' },
                    { key: 'number', label: 'Number' },
                    { key: 'special', label: 'Special Icon' }
                  ].map((rule) => (
                    <div key={rule.key} className="flex items-center space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${passwordStrength[rule.key] ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-700'}`} />
                      <span className={`text-[10px] font-bold tracking-tight uppercase ${passwordStrength[rule.key] ? 'text-emerald-400' : 'text-slate-600'}`}>
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3.5 rounded-xl flex items-center justify-center font-bold text-base shadow-xl shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-2"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>Create Account <ArrowRight className="w-5 h-5 ml-2" /></>
              )}
            </motion.button>
          </form>

          <p className="mt-7 text-center text-slate-500 font-medium text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-all">
              Log in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
