import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const VerifyEmailPending = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const email = user?.email || localStorage.getItem('pendingEmail') || '';

  const handleResend = async () => {
    if (!email) {
      toast.error('No email on file. Please register again.');
      return;
    }
    setLoading(true);
    try {
      await API.post('/auth/resend-verification', { email });
      toast.success('Verification email sent! Check your inbox.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-[#060a14] p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-card rounded-3xl p-10 text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/20 flex items-center justify-center"
        >
          <Mail className="w-8 h-8 text-blue-400" />
        </motion.div>

        <h1 className="text-2xl font-bold text-white">Verify your email</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          We sent a verification link to{' '}
          <span className="text-blue-400 font-medium">{email || 'your email'}</span>.
          Click the link in that email to activate your account.
        </p>

        <button
          type="button"
          onClick={handleResend}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Resend verification email'}
        </button>

        <div className="flex flex-col gap-2 text-sm">
          <Link to="/login" className="text-slate-500 hover:text-white flex items-center justify-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
          {user && (
            <button type="button" onClick={logout} className="text-slate-500 hover:text-white">
              Sign out
            </button>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default VerifyEmailPending;
