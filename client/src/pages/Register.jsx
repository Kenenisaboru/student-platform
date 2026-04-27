import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, School, Briefcase, Loader2, ArrowRight, Check, Users, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';

const benefits = [
  {
    icon: Users,
    title: "Unite Arsi Aseko Minds",
    desc: "Connect with peers across Ethiopian universities.",
    color: "from-blue-500/20 to-indigo-500/10",
    borderColor: "group-hover:border-blue-500/50"
  },
  {
    icon: Briefcase,
    title: "Career Opportunities",
    desc: "Access jobs, internships, and mentorship programs.",
    color: "from-emerald-500/20 to-blue-500/10",
    borderColor: "group-hover:border-emerald-500/50"
  },
  {
    icon: Sparkles,
    title: "Community Growth",
    desc: "Be part of a thriving ecosystem of excellence.",
    color: "from-purple-500/20 to-indigo-500/10",
    borderColor: "group-hover:border-purple-500/50"
  }
];

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
    <div className="min-h-screen bg-[#060a14] selection:bg-blue-500/30 selection:text-blue-200 font-sans">

      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[5%] left-[-10%] w-[45%] h-[45%] bg-emerald-600/10 rounded-full blur-[150px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] right-[30%] w-[35%] h-[35%] bg-indigo-600/5 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-fit lg:min-h-screen flex items-center overflow-hidden border-b border-white/[0.03] py-20 lg:py-0">

        <div className="container mx-auto px-4 lg:px-8 z-10 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-10 lg:py-0">

          {/* Left Content */}
          <div className="relative order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5" /> Join the Community
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tighter">
                Begin Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Arsi Aseko</span> Journey
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl leading-relaxed font-medium opacity-90">
                Join thousands of Arsi Aseko students across Ethiopia&apos;s top universities. Connect, grow, and achieve together.
              </p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 gap-6 mb-10"
            >
              {[
                { label: 'Active Members', val: '5,000+' },
                { label: 'Universities', val: '40+' },
                { label: 'Success Stories', val: '500+' },
                { label: 'Mentors', val: '200+' },
              ].map((s, i) => (
                <div key={s.label}>
                  <div className="text-2xl md:text-3xl font-black text-white">{s.val}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Benefits List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              {[
                'Access to job opportunities and internships',
                'Mentorship from industry professionals',
                'Connect with peers across Ethiopia',
                'Exclusive community resources and events'
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  <span className="text-slate-300 font-medium">{benefit}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Form - Glassmorphism Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="w-full max-w-[500px] mx-auto order-1 lg:order-2 lg:ml-auto"
          >
            <div className="group relative">
              {/* Outer Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-indigo-500/20 rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

              <div className="relative bg-[#0a0f1e]/80 backdrop-blur-3xl p-8 lg:p-10 rounded-[2.5rem] border border-white/[0.08] shadow-2xl">
                <div className="mb-8 text-center">
                  <h3 className="text-3xl font-black text-white mb-2 tracking-tight">Create Account</h3>
                  <p className="text-slate-400 font-medium text-sm">Join the Arsi Aseko community today</p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-red-500/10 text-red-400 rounded-2xl text-sm border border-red-500/20 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="font-semibold">{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                    <div className="relative group/input">
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] focus:border-emerald-500/50 focus:bg-white/[0.06] rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-emerald-400 w-5 h-5 transition-colors" />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group/input">
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] focus:border-emerald-500/50 focus:bg-white/[0.06] rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                        placeholder="you@arsiaseko.edu.et"
                        value={formData.email}
                        onChange={handleChange}
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-emerald-400 w-5 h-5 transition-colors" />
                    </div>
                  </div>

                  {/* University & Department */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">University</label>
                      <div className="relative group/input">
                        <input
                          type="text"
                          name="university"
                          required
                          className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] focus:border-emerald-500/50 focus:bg-white/[0.06] rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                          placeholder="Your University"
                          value={formData.university}
                          onChange={handleChange}
                        />
                        <School className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-emerald-400 w-5 h-5 transition-colors" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Department</label>
                      <div className="relative group/input">
                        <input
                          type="text"
                          name="department"
                          required
                          className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] focus:border-emerald-500/50 focus:bg-white/[0.06] rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                          placeholder="Your Department"
                          value={formData.department}
                          onChange={handleChange}
                        />
                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-emerald-400 w-5 h-5 transition-colors" />
                      </div>
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Create Password</label>
                    <div className="relative group/input">
                      <input
                        type="password"
                        name="password"
                        required
                        className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] focus:border-emerald-500/50 focus:bg-white/[0.06] rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-emerald-400 w-5 h-5 transition-colors" />
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05]"
                    >
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Password Strength</div>
                      <div className="space-y-2">
                        {[
                          { label: '8+ characters', check: passwordStrength.length },
                          { label: 'Uppercase letter', check: passwordStrength.uppercase },
                          { label: 'Lowercase letter', check: passwordStrength.lowercase },
                          { label: 'Number', check: passwordStrength.number },
                          { label: 'Special character (!@#$%)', check: passwordStrength.special },
                        ].map((item, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full transition-colors ${item.check ? 'bg-emerald-400' : 'bg-slate-600'}`}></div>
                            <span className={`text-xs font-medium ${item.check ? 'text-emerald-400' : 'text-slate-500'}`}>{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-4 rounded-2xl flex items-center justify-center font-black text-lg shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all mt-8 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <span className="flex items-center gap-2">Create My Account <ArrowRight className="w-5 h-5" /></span>
                    )}
                  </motion.button>
                </form>

                {/* Login Link */}
                <div className="mt-8 text-center">
                  <p className="text-slate-500 font-medium text-[13px]">
                    Already have an account? {' '}
                    <Link to="/login" className="text-white hover:text-emerald-400 font-bold transition-all underline decoration-emerald-500/30 underline-offset-4">
                      Sign In
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 tracking-tighter"
            >
              Why Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Arsi Aseko</span>
            </motion.h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">Everything you need to succeed in your academic and professional journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group relative bg-gradient-to-br ${benefit.color} backdrop-blur-2xl p-8 rounded-[2rem] border border-white/[0.04] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] ${benefit.borderColor}`}
              >
                <div className="w-16 h-16 rounded-[1.5rem] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 group-hover:bg-emerald-500/10 transition-all duration-500">
                  <benefit.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">{benefit.title}</h3>
                <p className="text-slate-400 text-base leading-relaxed font-medium group-hover:text-slate-300 transition-colors">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Register;
