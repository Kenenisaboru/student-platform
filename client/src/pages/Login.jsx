import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, ArrowRight, Sparkles, MessageSquare, Users, BookOpen, Cpu, ShieldCheck, Zap, Heart, Star, Layout } from 'lucide-react';
import { motion, useScroll, useSpring } from 'framer-motion';
import Footer from '../components/Footer';

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
    <div className="min-h-screen bg-[#060a14] selection:bg-blue-500/30 selection:text-blue-200">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 z-[100] origin-left scale-x-0" />

      {/* Hero Section (Existing Login) */}
      <section className="min-h-screen flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
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
          {/* ... existing left and right sides ... */}
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
              <h1 className="text-2xl font-extrabold text-white -rotate-3">CP</h1>
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
                  onClick={() => handleQuickLogin('kenenisaboru998@gmail.com', 'AdminPassword123!')}
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
            <p className="text-slate-500 font-medium text-sm">Access your Communication Platform account</p>
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

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500/50"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Explore More</span>
          <motion.div 
            animate={{ y: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-0.5 h-6 bg-gradient-to-b from-blue-500 to-transparent rounded-full"
          />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 mr-2" /> Unmatched Features
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold text-white mb-6 tracking-tight"
          >
            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Exceed.</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: MessageSquare, color: 'blue', title: 'Smart Chat', desc: 'Secure, real-time messaging designed for academic collaboration.' },
            { icon: Users, color: 'indigo', title: 'Tribe Building', desc: 'Find your peers based on university, major, and shared interests.' },
            { icon: BookOpen, color: 'purple', title: 'Resource Hub', desc: 'Share research papers, notes, and study guides instantly.' },
            { icon: Cpu, color: 'emerald', title: 'AI Optimized', desc: 'Intelligent focus tools and automated study summaries.' }
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-hover p-8 rounded-[2rem] border border-white/[0.04] group hover:border-blue-500/20 transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl bg-${feature.color}-500/10 flex items-center justify-center text-${feature.color}-400 mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Community / Inspiration Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-blue-600/10 rounded-full blur-[120px] opacity-20" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-6xl font-black text-white mb-8 tracking-tighter leading-tight"
          >
            "A digital campus where <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500">ideas spark</span> and legacies begin."
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed"
          >
            We are more than just a network; we are the foundation for the next generation of pioneers. Connect with thousands of students across the globe.
          </motion.p>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-24 px-4 sm:px-8 bg-white/[0.01] border-y border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Start your journey in <span className="text-blue-400">minutes.</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative text-center md:text-left"
            >
              <div className="text-[8rem] font-black text-white/[0.02] absolute -top-16 left-0 md:-left-4 select-none">1</div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 mb-6 mx-auto md:mx-0">
                  <Layout className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Join the Network</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Create your unified student profile in 30 seconds. No complex forms, just excellence.</p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative text-center md:text-left"
            >
              <div className="text-[8rem] font-black text-white/[0.02] absolute -top-16 left-0 md:-left-4 select-none">2</div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 mb-6 mx-auto md:mx-0">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Find Your Circle</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Connect with your university department and join active discussion focus hubs.</p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative text-center md:text-left"
            >
              <div className="text-[8rem] font-black text-white/[0.02] absolute -top-16 left-0 md:-left-4 select-none">3</div>
              <div className="relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-purple-500/20 mb-6 mx-auto md:mx-0">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Excel Together</h3>
                <p className="text-slate-500 font-medium leading-relaxed">Share resources, ask questions, and collaborate in real-time with smarter tools.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Smart Intelligence / AI Section */}
      <section className="py-24 px-4 sm:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Cpu className="w-3.5 h-3.5 mr-2" /> Future Ready
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6 leading-tight">
              Study smarter with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Intelligent Tools.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed font-medium">
              We're integrating cutting-edge AI to help you summarize long research papers, generate study quizzes, and find the perfect collaborators for your specific research goals.
            </p>
            <div className="space-y-4">
              {[
                { icon: ShieldCheck, title: 'Privacy First', desc: 'Secure AI processing that keeps your data anonymous.' },
                { icon: Zap, title: 'Instant Summaries', desc: 'Convert 50-page PDFs into 5-minute executive summaries.' }
              ].map(item => (
                <div key={item.title} className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-slate-500 text-xs font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative z-10 glass-card p-2 rounded-[2.5rem] border border-white/[0.1] shadow-2xl">
              <div className="bg-[#0a0f1e] rounded-[2rem] overflow-hidden aspect-square sm:aspect-video flex items-center justify-center relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20 opacity-50"></div>
                <Cpu className="w-32 h-32 text-indigo-500/30 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-white font-black text-xl tracking-tighter uppercase opacity-40">Intelligence Hub</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] -z-10"></div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">Student <span className="text-blue-400">Success.</span></h2>
            <p className="text-slate-500 font-medium italic">Building bridges across global universities.</p>
          </div>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Amara K.', univ: 'Global Tech University', text: 'This platform transformed the way I collaborate on my engineering projects. The real-time sharing is a lifesaver.' },
            { name: 'Kenenisa B.', univ: 'Science & Art Institute', text: 'Connecting with students in my department across other campuses gave me a huge perspective boost.' },
            { name: 'Sara L.', univ: 'International Academy', text: 'The focus hubs help me manage my study groups perfectly. Its modern, fast, and exactly what we needed.' }
          ].map((t, i) => (
            <motion.div 
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 glass-card rounded-[2.5rem] border border-white/[0.04]"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm leading-none">{t.name}</h4>
                  <p className="text-slate-600 text-[10px] uppercase font-bold tracking-widest mt-1">{t.univ}</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm italic leading-relaxed">"{t.text}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto rounded-[3rem] p-10 sm:p-16 text-center relative overflow-hidden shadow-2xl shadow-blue-500/10 border border-white/[0.05] bg-gradient-to-br from-blue-600 to-indigo-700"
        >
          <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]"></div>
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-6xl font-black text-white mb-6 tracking-tighter">Ready to join the <br className="sm:hidden" />future of learning?</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto font-medium leading-relaxed opacity-80">
              Stop operating in silo. Create your account today and unlock the power of a centralized student network.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all shadow-xl active:scale-95">
                Join Now for Free
              </Link>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full sm:w-auto px-8 py-4 bg-white/10 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all border border-white/10 active:scale-95"
              >
                Sign In to Account
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Login;
