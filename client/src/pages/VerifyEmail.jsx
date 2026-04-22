import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const { data } = await API.get(`/auth/verify-email/${token}`);
        setStatus('success');
        setMessage(data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed');
      }
    };
    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#060a14] relative overflow-hidden">
      <Helmet>
        <title>Email Verification | Arsi Aseko University</title>
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
        <div className="bg-[#0a0f1e]/80 backdrop-blur-3xl rounded-[3rem] p-10 sm:p-14 border border-white/[0.08] shadow-2xl relative overflow-hidden text-center">
          <AnimatePresence mode="wait">
            {status === 'loading' && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-12"
              >
                <div className="relative w-20 h-20 mx-auto mb-8">
                   <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                   <Loader2 className="w-20 h-20 text-blue-500 animate-spin relative z-10" />
                </div>
                <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">Validating Signal...</h2>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest leading-relaxed">Verifying your university email node within the ecosystem.</p>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-8"
              >
                <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-xl">
                  <Check className="w-10 h-10 text-emerald-400" />
                </div>
                <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Verification Complete.</h2>
                <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">
                  {message || 'Your scholarly identity has been successfully authenticated.'}
                </p>
                
                <Link to="/login" className="inline-flex items-center justify-center bg-white text-[#060a14] px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all border border-white/20">
                  Access Portal
                </Link>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-8"
              >
                <div className="w-20 h-20 bg-rose-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-rose-500/20 shadow-xl">
                  <X className="w-10 h-10 text-rose-400" />
                </div>
                <h2 className="text-4xl font-black text-white mb-4 tracking-tighter">Validation Failed.</h2>
                <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">
                  {message || 'The verification link is corrupted, expired, or already utilized.'}
                </p>
                
                <Link to="/login" className="inline-flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] text-white px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] border border-white/[0.08] transition-all">
                  Back to Terminal
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 pt-8 border-t border-white/[0.05] flex items-center justify-center gap-3">
             <Sparkles className="w-4 h-4 text-blue-500/30" />
             <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">AAU Secure Authentication Node</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;

