import { motion } from 'framer-motion';

const LoadingPage = () => {
  return (
    <div className="min-h-screen bg-[#060a14] flex flex-col items-center justify-center p-4">
      <div className="relative">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-16 h-16 border-2 border-blue-500/10 border-t-blue-500 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg backdrop-blur-xl border border-white/[0.05] flex items-center justify-center text-[10px] font-black text-white">
                AAU
            </div>
        </div>
      </div>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-slate-500 font-bold text-xs uppercase tracking-[0.3em]"
      >
        Synchronizing...
      </motion.p>
    </div>
  );
};

export default LoadingPage;
