import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  actionLink, 
  onAction 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="text-center py-20 px-8 glass-card rounded-3xl border border-white/[0.04] relative overflow-hidden"
    >
      {/* Decorative background flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/[0.03] rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 max-w-sm mx-auto">
        <div className="w-20 h-20 bg-gradient-to-br from-white/[0.03] to-white/[0.01] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/[0.06] shadow-xl shadow-black/20">
          {Icon && <Icon className="w-10 h-10 text-slate-500 drop-shadow-sm" />}
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
          {title}
        </h3>
        
        <p className="text-slate-500 mb-8 text-sm leading-relaxed font-medium">
          {description}
        </p>

        {actionLink ? (
          <Link 
            to={actionLink} 
            className="inline-flex items-center justify-center px-6 py-3 bg-white/[0.06] hover:bg-white/[0.1] text-white text-sm font-bold rounded-xl transition-all border border-white/[0.08] hover:shadow-lg hover:shadow-black/20 active:scale-95"
          >
            {actionText}
          </Link>
        ) : onAction ? (
          <button 
            onClick={onAction}
            className="inline-flex items-center justify-center px-6 py-3 bg-white/[0.06] hover:bg-white/[0.1] text-white text-sm font-bold rounded-xl transition-all border border-white/[0.08] hover:shadow-lg hover:shadow-black/20 active:scale-95"
          >
            {actionText}
          </button>
        ) : null}
      </div>
    </motion.div>
  );
};

export default EmptyState;
