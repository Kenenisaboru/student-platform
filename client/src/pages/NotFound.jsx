import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="glass-card max-w-lg w-full rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden text-white"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="w-24 h-24 bg-white/[0.04] border border-white/[0.08] rounded-3xl mx-auto flex items-center justify-center mb-8 rotate-12 shadow-2xl">
            <Compass className="w-12 h-12 text-slate-500 -rotate-12" />
          </div>
          
          <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-500 mb-2">404</h1>
          <h2 className="text-2xl font-extrabold tracking-tight mb-4">Lost in Space</h2>
          
          <p className="text-slate-400 font-medium mb-8">
            The page you're looking for has drifted into the cosmic void. Let's get you back to familiar grounds.
          </p>
          
          <Link 
            to="/" 
            className="inline-flex items-center justify-center px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl font-bold shadow-xl shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
