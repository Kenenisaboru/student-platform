import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { motion } from 'framer-motion';
import { Check, X, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#060a14]">
      <Helmet>
        <title>Verify Email | Arsi Aseko Student Network</title>
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl p-8 border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl text-center">
          {status === 'loading' && (
            <div className="py-8">
              <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-4" />
              <h2 className="text-lg font-bold text-white mb-2">Verifying your email...</h2>
              <p className="text-slate-400 text-sm">Please wait a moment</p>
            </div>
          )}

          {status === 'success' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Email Verified! 🎉</h2>
              <p className="text-slate-400 text-sm mb-6">{message}</p>
              <Link to="/login" className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all">
                Go to Login
              </Link>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="py-8">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
              <p className="text-slate-400 text-sm mb-6">{message}</p>
              <Link to="/login" className="inline-flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.1] text-white px-6 py-3 rounded-xl font-bold text-sm border border-white/[0.06] transition-all">
                Back to Login
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
