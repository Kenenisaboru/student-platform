import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, Check, Loader2, Sparkles, ShieldCheck, Globe } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await API.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#060a14] relative overflow-hidden">
      <Helmet>
        <title>Identity Recovery | Arsi Aseko University</title>
      </Helmet>

      {/* Narrative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none"></div>
      <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg z-10"
      >
        <div className="bg-[#0a0f1e]/80 backdrop-blur-3xl rounded-[3rem] p-10 sm:p-14 border border-white/[0.08] shadow-2xl relative overflow-hidden">
          <Link to="/login" className="inline-flex items-center text-slate-500 hover:text-white font-black text-[10px] uppercase tracking-[0.3em] mb-12 transition-all group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Terminal
          </Link>

          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div 
                key="sent"
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="text-center py-6"
              >
                <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-xl">
                  <Check className="w-10 h-10 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">Signal Dispatched.</h2>
                <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">
                  We've transmitted an identity recovery link to:<br />
                  <span className="text-white font-black tracking-tight mt-2 block bg-white/[0.03] py-2 rounded-xl border border-white/[0.05]">{email}</span>
                </p>
                <div className="pt-8 border-t border-white/[0.05]">
                  <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
                    No transmission received? {' '}
                    <button onClick={() => setSent(false)} className="text-blue-400 hover:text-blue-300 transition-colors">
                      Retry Uplink
                    </button>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">
                       Security Protocol
                     </div>
                     <ShieldCheck className="w-3.5 h-3.5 text-blue-500/50" />
                  </div>
                  <h1 className="text-4xl font-black text-white mb-4 tracking-tighter leading-none">Recover Identity.</h1>
                  <p className="text-slate-500 font-bold text-xs uppercase tracking-widest leading-relaxed">
                    Enter your registered email node to receive a cryptographic reset signal.
                  </p>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest mb-8 flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                    {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] ml-1">Email Node Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-700 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="identity@university.edu"
                        className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] focus:border-blue-500/40 rounded-2xl py-4.5 pl-14 pr-6 text-sm font-black text-white placeholder:text-slate-800 outline-none transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-white text-[#060a14] py-5 rounded-[1.8rem] font-black shadow-2xl shadow-white/5 disabled:opacity-30 transition-all text-xs uppercase tracking-[0.2em] border border-white/20 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <><Globe className="w-4 h-4" /> Dispatch Reset Signal</>
                    )}
                  </motion.button>
                </form>

                <div className="mt-12 pt-8 border-t border-white/[0.05] flex items-center justify-center gap-3">
                   <Sparkles className="w-4 h-4 text-blue-500/30" />
                   <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">AAU Secure Authentication Node</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

