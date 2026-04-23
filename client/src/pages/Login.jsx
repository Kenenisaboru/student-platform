import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, ArrowRight, MessageSquare, BookOpen, Bell, Users, Play, Sparkles, ShieldCheck, Zap, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer';

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?auto=format&fit=crop&w=1920&q=80",
    title: "Welcome to Arsi Aseko University Students Platform",
    subtitle: "Join the digital hub connecting students across all departments and campuses."
  },
  {
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1920&q=80",
    title: "Innovate and Collaborate",
    subtitle: "Build your future with state-of-the-art resources and community support."
  },
  {
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80",
    title: "Your Campus, Your Voice",
    subtitle: "Stay updated with official announcements and university events."
  }
];

const features = [
  {
    icon: MessageSquare,
    title: "Smart Chat",
    desc: "Real-time messaging with your peers and study groups.",
    color: "from-blue-500/20 to-indigo-500/10",
    borderColor: "group-hover:border-blue-500/50"
  },
  {
    icon: BookOpen,
    title: "Share Resources",
    desc: "Access and share course materials, notes, and research papers.",
    color: "from-purple-500/20 to-indigo-500/10",
    borderColor: "group-hover:border-purple-500/50"
  },
  {
    icon: Bell,
    title: "Announcements",
    desc: "Stay updated with the latest university news and department notifications.",
    color: "from-indigo-500/20 to-blue-500/10",
    borderColor: "group-hover:border-indigo-500/50"
  }
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

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

  const scrollToFeatures = () => {
    document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#060a14] selection:bg-blue-500/30 selection:text-blue-200 font-sans">

      {/* Dynamic Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-blob"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[45%] h-[45%] bg-purple-600/10 rounded-full blur-[150px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] left-[30%] w-[35%] h-[35%] bg-indigo-600/5 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[100vh] lg:min-h-screen flex items-center overflow-hidden border-b border-white/[0.03]">

        {/* Background Images Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 z-0"
          >
            <img
              src={heroSlides[currentSlide].image}
              className="w-full h-full object-cover scale-105"
              alt="Background"
            />
            <div className="absolute inset-0 bg-[#060a14]/60 mix-blend-multiply"></div>
          </motion.div>
        </AnimatePresence>

        {/* Overlays */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#060a14] via-[#060a14]/90 to-transparent" />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#060a14] via-transparent to-transparent" />

        <div className="container mx-auto px-4 lg:px-8 z-10 grid lg:grid-cols-2 gap-16 items-center py-20 lg:py-0">

          {/* Left Content */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5" /> Premium University Network
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-[1.1] tracking-tighter">
                  {heroSlides[currentSlide].title.split(' ').map((word, i) => (
                    <span key={i} className={i >= 3 ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400" : ""}>
                      {word}{' '}
                    </span>
                  ))}
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-xl leading-relaxed font-medium opacity-90">
                  {heroSlides[currentSlide].subtitle}
                </p>
              </motion.div>
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-5"
            >
              <Link to="/register" className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] active:scale-95 overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Start Your Journey <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
              <button
                onClick={scrollToFeatures}
                className="px-8 py-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 text-white rounded-2xl font-bold text-lg hover:bg-white/[0.08] transition-all hover:border-white/20 active:scale-95 flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Play className="w-3 h-3 fill-white ml-0.5" />
                </div>
                Explore Ecosystem
              </button>
            </motion.div>

            {/* Quick Stats */}
            <div className="mt-16 grid grid-cols-3 gap-8">
              {[
                { label: 'Students', val: '5,000+' },
                { label: 'Resources', val: '12k+' },
                { label: 'Mentors', val: '150+' },
              ].map((s, i) => (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 + (i * 0.1) }}
                  key={s.label}
                >
                  <div className="text-2xl font-black text-white">{s.val}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Form - Glassmorphism Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="w-full max-w-[460px] mx-auto lg:ml-auto"
          >
            <div className="group relative">
              {/* Outer Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

              <div className="relative bg-[#0a0f1e]/80 backdrop-blur-3xl p-10 lg:p-12 rounded-[2.5rem] border border-white/[0.08] shadow-2xl">
                <div className="mb-10 text-center">
                  <h3 className="text-3xl font-black text-white mb-3 tracking-tight">Student Login</h3>
                  <p className="text-slate-400 font-medium text-sm">Welcome back to the AAUSP Portal</p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 p-4 bg-red-500/10 text-red-500 rounded-2xl text-sm border border-red-500/20 flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="font-semibold">{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Identification</label>
                    <div className="relative group/input">
                      <input
                        type="email"
                        required
                        className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] focus:border-blue-500/50 focus:bg-white/[0.06] rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                        placeholder="yourname@arsiaseko.edu.et"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-blue-400 w-5 h-5 transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1">
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Secret Key</label>
                      <Link to="/forgot-password" title="Recover Access" className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-all">Forgot Access?</Link>
                    </div>
                    <div className="relative group/input">
                      <input
                        type="password"
                        required
                        className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] focus:border-blue-500/50 focus:bg-white/[0.06] rounded-2xl py-4 pl-12 pr-4 text-white outline-none transition-all duration-300 placeholder:text-slate-600 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within/input:text-blue-400 w-5 h-5 transition-colors" />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-[#060a14] py-4 rounded-2xl flex items-center justify-center font-black text-lg shadow-xl shadow-white/5 hover:bg-blue-50 transition-all mt-8 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                      <span className="flex items-center gap-2">Enter Portal <ArrowRight className="w-5 h-5" /></span>
                    )}
                  </motion.button>
                </form>

                <div className="mt-10 pt-8 border-t border-white/[0.04]">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Daily Inspiration</p>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/5 border border-blue-500/10">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                      <span className="text-[9px] font-bold text-blue-400 uppercase">Academic Wisdom</span>
                    </div>
                  </div>
                  <div className="relative p-6 rounded-2xl bg-gradient-to-br from-blue-600/5 to-indigo-600/5 border border-white/5 overflow-hidden group">
                    <Quote className="absolute -top-2 -right-2 w-16 h-16 text-blue-500/5 rotate-12 group-hover:scale-110 transition-transform duration-700" />
                    <div className="relative z-10">
                      <p className="text-white/90 text-sm font-medium italic leading-relaxed mb-4">
                        "Education is the most powerful weapon which you can use to change the world. Your journey at Arsi Aseko starts with a single step towards excellence."
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 p-[1px]">
                          <div className="w-full h-full rounded-full bg-[#0a0f1e] flex items-center justify-center">
                            <Users className="w-3.5 h-3.5 text-blue-400" />
                          </div>
                        </div>
                        <div>
                          <p className="text-white text-[10px] font-black uppercase tracking-widest">AAU Student Moto</p>
                          <p className="text-slate-500 text-[9px] font-bold">Official Motivation Node</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-slate-500 font-medium text-[13px]">
                    No account yet? {' '}
                    <Link to="/register" className="text-white hover:text-blue-400 font-bold transition-all underline decoration-blue-500/30 underline-offset-4">
                      Request Enrollment
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-12 hidden lg:flex flex-col items-center gap-4">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] [writing-mode:vertical-lr] rotate-180">Discovery</div>
          <div className="w-[1px] h-20 bg-gradient-to-b from-blue-500/50 to-transparent"></div>
        </div>
      </section>

      {/* Featured Ecosystem - Bento/Grid with Glassmorphism */}
      <section id="features-section" className="py-32 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tighter"
            >
              The Pro Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Toolkit</span>
            </motion.h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">A unified workspace for the modern academic experience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group relative bg-gradient-to-br ${feature.color} backdrop-blur-2xl p-10 rounded-[2.5rem] border border-white/[0.04] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] ${feature.borderColor}`}
              >
                <div className="w-16 h-16 rounded-[1.5rem] bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 group-hover:bg-blue-500/10 transition-all duration-500">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-slate-400 text-base leading-relaxed font-medium group-hover:text-slate-300 transition-colors">{feature.desc}</p>

                {/* Subtle corner glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community - Professional Bento Grid Layout */}
      <section className="py-32 px-4 relative bg-[#0a0f1e]/50 border-y border-white/[0.03]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-8 mb-16 px-4">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                <Users className="w-3 h-3" /> Campus Culture
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Vibrant Student <span className="text-blue-500">Core.</span></h2>
            </div>
            <p className="text-slate-500 font-medium max-w-sm lg:text-right italic">"Arsi Aseko UNIversity students is where visionaries meets."</p>
          </div>

          {/* Bento Grid Redesign */}
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-3 gap-5 h-auto lg:h-[700px]">
            {/* Main Feature - Large Tall */}
            <motion.div
              whileHover={{ scale: 0.99 }}
              className="md:col-span-2 md:row-span-3 relative rounded-[2.5rem] overflow-hidden group border border-white/[0.08]"
            >
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt="Collaboration" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060a14] via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-10 left-10 right-10">
                <div className="text-3xl font-black text-white mb-2">United Innovation</div>
                <p className="text-slate-300 text-sm font-medium">Cross-departmental collaboration at its finest.</p>
              </div>
            </motion.div>

            {/* Top Right High */}
            <motion.div
              whileHover={{ scale: 0.99 }}
              className="md:col-span-2 md:row-span-1 relative rounded-[2rem] overflow-hidden group border border-white/[0.08]"
            >
              <img src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="Library" />
              <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay group-hover:opacity-0 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent p-8 flex items-center">
                <h4 className="text-xl font-bold text-white tracking-tight">The Neural Library</h4>
              </div>
            </motion.div>

            {/* Bottom Left Square */}
            <motion.div
              whileHover={{ scale: 0.99 }}
              className="md:col-span-1 md:row-span-2 relative rounded-[2.5rem] overflow-hidden group border border-white/[0.08]"
            >
              <img src="https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Event" />
              <div className="absolute inset-0 bg-purple-600/10 mix-blend-overlay" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <ShieldCheck className="text-white/40 mb-3 w-6 h-6" />
                <p className="text-white font-bold text-sm">Official Campus Gatherings</p>
              </div>
            </motion.div>

            {/* Bottom Right - Dynamic Content */}
            <motion.div
              whileHover={{ scale: 0.99 }}
              className="md:col-span-1 md:row-span-2 bg-[#0d1428] p-8 rounded-[2.5rem] border border-white/[0.08] flex flex-col justify-center relative overflow-hidden group"
            >
              <div className="relative z-10">
                <div className="text-4xl font-black text-white mb-2">15+</div>
                <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-6">Departments Integrated</div>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">From Engenering  to BUsness, experience a seamless academic flow.</p>
              </div>
              {/* Decorative background circle */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Integration Banner */}
      <section className="py-24 px-4 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Secure Your Digital ID</h2>
          <p className="text-blue-100 text-lg mb-10 opacity-90 max-w-2xl mx-auto font-medium">Join Arsi Aseko's secure network today and access global opportunities with your verified student profile.</p>
          <Link to="/register" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 rounded-[2rem] font-black text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all">
            Complete Registration <Sparkles className="w-6 h-6 text-blue-500" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Login;
