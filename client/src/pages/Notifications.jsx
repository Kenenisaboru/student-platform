import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Bell, Heart, MessageCircle, UserPlus, Loader2, Check, Zap, Clock, ArrowRight } from 'lucide-react';
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

  const getLabel = (type) => {
    switch (type) {
      case 'like': return 'liked your post';
      case 'comment': return 'commented on your post';
      case 'follow': return 'started following you';
      default: return 'interacted with your post';
    }
  };

  const todayNotifs = notifications.filter(n => isToday(new Date(n.createdAt)));
  const yesterdayNotifs = notifications.filter(n => isYesterday(new Date(n.createdAt)));
  const earlierNotifs = notifications.filter(n => !isToday(new Date(n.createdAt)) && !isYesterday(new Date(n.createdAt)));

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const itemVariants = { hidden: { opacity: 0, scale: 0.98 }, show: { opacity: 1, scale: 1 } };

  const RenderSection = ({ title, items }) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-10">
        <div className="flex items-center gap-4 mb-5 px-4">
           <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
           <div className="h-px flex-1 bg-white/[0.04]"></div>
        </div>
        <div className="space-y-2">
          {items.map((notif) => (
            <motion.div 
              key={notif._id} 
              variants={itemVariants}
              className={`group relative p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-white/10 transition-all duration-300 flex items-start gap-4 ${!notif.read ? 'border-l-2 border-l-blue-500' : 'opacity-75 hover:opacity-100'}`}
            >
              <div className="relative shrink-0">
                <Link to={`/profile/${notif.sender?._id}`}>
                  <img src={notif.sender?.profilePicture} className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-blue-500/30 transition-all" alt="" />
                </Link>
                <div className="absolute -bottom-1 -right-1 p-1 rounded-md bg-[#060a14] border border-white/10">
                   {getIcon(notif.type)}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <p className="text-sm text-white/90">
                    <Link to={`/profile/${notif.sender?._id}`} className="font-bold hover:text-blue-400 transition-colors">{notif.sender?.name}</Link>
                    <span className="text-slate-500 ml-1.5">{getLabel(notif.type)}</span>
                  </p>
                  <span className="text-[10px] text-slate-600 font-medium whitespace-nowrap">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </span>
                </div>

                {notif.post && (
                  <Link to={`/post/${notif.post._id}`} className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] rounded-lg text-xs text-slate-500 hover:text-slate-300 transition-all">
                    <p className="line-clamp-1">{notif.post.title}</p>
                    <ArrowRight className="w-3 h-3 shrink-0" />
                  </Link>
                )}
              </div>

              {!notif.read && (
                 <div className="shrink-0 flex items-center justify-center pt-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 px-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Notifications</h1>
        </div>
        
        <AnimatePresence>
          {notifications.some(n => !n.read) && (
            <motion.button 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
              onClick={markAllRead}
              className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center transition-colors"
            >
              <Check className="w-3.5 h-3.5 mr-1.5" /> Mark all read
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="p-5 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 bg-white/[0.05] rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 bg-white/[0.05] rounded" />
                <div className="h-2 w-1/4 bg-white/[0.03] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <motion.div variants={containerVariants} initial="hidden" animate="show">
          <RenderSection title="Today" items={todayNotifs} />
          <RenderSection title="Yesterday" items={yesterdayNotifs} />
          <RenderSection title="Earlier" items={earlierNotifs} />
        </motion.div>
      ) : (
        <EmptyState 
          icon={Bell}
          title="No notifications yet"
          description="When someone interacts with your posts, you'll see it here."
          actionText="Go to Feed"
          actionLink="/"
        />
      )}
    </div>
  );
};

export default Notifications;
