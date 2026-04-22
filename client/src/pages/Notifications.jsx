import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Bell, Heart, MessageCircle, UserPlus, Loader2, Check, Sparkles, Zap, ShieldCheck, Clock, Layers, ArrowRight } from 'lucide-react';
import { formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import EmptyState from '../components/EmptyState';
import Skeleton from '../components/Skeleton';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/notifications');
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await API.put('/notifications/read');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'like': return <Heart className="w-4 h-4 text-rose-400 fill-current" />;
      case 'comment': return <MessageCircle className="w-4 h-4 text-blue-400" />;
      case 'follow': return <UserPlus className="w-4 h-4 text-emerald-400" />;
      default: return <Zap className="w-4 h-4 text-amber-500 fill-current" />;
    }
  };

  // Grouping logic for "Today", "Yesterday", "Earlier"
  const todayNotifs = notifications.filter(n => isToday(new Date(n.createdAt)));
  const yesterdayNotifs = notifications.filter(n => isYesterday(new Date(n.createdAt)));
  const earlierNotifs = notifications.filter(n => !isToday(new Date(n.createdAt)) && !isYesterday(new Date(n.createdAt)));

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const itemVariants = { hidden: { opacity: 0, scale: 0.98 }, show: { opacity: 1, scale: 1 } };

  const RenderSection = ({ title, items }) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6 px-4">
           <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.3em]">{title}</h3>
           <div className="h-px flex-1 bg-white/[0.04]"></div>
        </div>
        <div className="space-y-3">
          {items.map((notif) => (
            <motion.div 
              key={notif._id} 
              variants={itemVariants}
              className={`group relative p-5 sm:p-6 rounded-[2rem] bg-[#0d1428] border border-white/[0.04] hover:border-white/10 transition-all duration-300 flex items-start gap-5 overflow-hidden ${!notif.read ? 'shadow-[0_0_20px_rgba(59,130,246,0.05)]' : 'opacity-80 hover:opacity-100'}`}
            >
              {/* Active Indicator Line */}
              {!notif.read && <div className="absolute left-0 top-6 bottom-6 w-1 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>}

              <div className="relative shrink-0">
                <Link to={`/profile/${notif.sender?._id}`}>
                  <img src={notif.sender?.profilePicture} className="w-11 h-11 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-blue-500/30 transition-all duration-500 shadow-xl" alt="" />
                </Link>
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-[#060a14] border border-white/10 shadow-lg scale-90 group-hover:scale-100 transition-transform">
                   {getIcon(notif.type)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                  <p className="text-[14px] text-white/90">
                    <Link to={`/profile/${notif.sender?._id}`} className="font-black hover:text-blue-400 transition-colors tracking-tight">{notif.sender?.name}</Link>
                    <span className="text-slate-500 font-bold ml-2">
                      {notif.type === 'like' && 'has validated your post'}
                      {notif.type === 'comment' && 'contributed to your discussion'}
                      {notif.type === 'follow' && 'is following your research segment'}
                    </span>
                  </p>
                  <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest whitespace-nowrap bg-white/[0.02] px-2 py-0.5 rounded-md border border-white/[0.04]">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </span>
                </div>

                {notif.post && (
                  <Link to={`/post/${notif.post._id}`} className="inline-flex items-center gap-3 mt-3 px-4 py-2.5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] rounded-xl group/post transition-all">
                    <div className="flex items-center gap-2">
                       <Layers className="w-3.5 h-3.5 text-blue-500/50" />
                       <p className="text-xs font-black text-slate-500 group-hover/post:text-slate-300 transition-colors line-clamp-1">{notif.post.title}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-700 group-hover/post:text-blue-400 group-hover/post:translate-x-1 transition-all" />
                  </Link>
                )}
              </div>

              {!notif.read && (
                 <div className="shrink-0 flex items-center justify-center p-2">
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse"></div>
                 </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 pb-24">
      {/* Narrative Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 px-4">
        <div>
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">
             <Layers className="w-3 h-3" /> System Feed
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">Notifications.</h1>
          <p className="text-slate-500 font-medium text-sm mt-2">Real-time status updates from your campus ecosystem.</p>
        </div>
        
        <AnimatePresence>
          {notifications.some(n => !n.read) && (
            <motion.button 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              onClick={markAllRead}
              className="bg-white text-[#060a14] px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center shadow-2xl active:scale-95 transition-all border border-white/20"
            >
              <ShieldCheck className="w-4 h-4 mr-2" /> Sync All Signal
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="p-8 bg-white/[0.02] border border-white/[0.04] rounded-[2rem] flex items-center gap-6 animate-pulse">
              <div className="w-12 h-12 bg-white/[0.05] rounded-2xl shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-3 w-1/3 bg-white/[0.05] rounded" />
                <div className="h-2 w-1/4 bg-white/[0.03] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          <RenderSection title="Today's Transmission" items={todayNotifs} />
          <RenderSection title="Previous Cycle" items={yesterdayNotifs} />
          <RenderSection title="Archive" items={earlierNotifs} />
        </motion.div>
      ) : (
        <EmptyState 
          icon={Bell}
          title="Static Frequency"
          description="Your signal hub is currently in high-level standby. No recent transmissions detected in your academic sector."
          actionText="Go to Main Feed"
          actionLink="/"
        />
      )}
    </div>
  );
};

export default Notifications;
