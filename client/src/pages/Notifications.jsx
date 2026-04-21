import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Bell, Heart, MessageCircle, UserPlus, Loader2, Check, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
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
      case 'like': return <Heart className="w-4 h-4 text-pink-400 fill-current" />;
      case 'comment': return <MessageCircle className="w-4 h-4 text-blue-400 fill-current" />;
      case 'follow': return <UserPlus className="w-4 h-4 text-emerald-400" />;
      default: return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } };
  const itemVariants = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } };

  return (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto py-4 sm:py-8 px-2 sm:px-0 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">Activity</h1>
            <p className="text-slate-500 font-medium text-[13px]">Stay updated with your network</p>
          </div>
        </div>
        
        <AnimatePresence>
          {notifications.some(n => !n.read) && (
            <motion.button initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={markAllRead}
              className="bg-white/[0.04] border border-white/[0.06] hover:border-blue-500/20 text-slate-300 font-bold px-4 py-2 rounded-xl text-sm flex items-center transition-all">
              <Check className="w-3.5 h-3.5 mr-2 text-blue-400" /> Mark all read
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="glass-card rounded-2xl p-4 sm:p-6 flex items-center space-x-4">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="w-1/3 h-4" />
                <Skeleton className="w-1/4 h-2.5" />
              </div>
            </div>
          ))}
        </div>
      ) : notifications.length > 0 ? (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="glass-card rounded-2xl overflow-hidden divide-y divide-white/[0.03]">
          {notifications.map((notif) => (
            <motion.div key={notif._id} variants={itemVariants}
              className={`p-4 sm:p-6 flex items-start space-x-3 sm:space-x-4 transition-all duration-300 relative group ${!notif.read ? 'bg-blue-500/[0.03]' : 'hover:bg-white/[0.02]'}`}>
              {!notif.read && <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 rounded-full my-4"></div>}
              
              <div className="mt-0.5 flex-shrink-0 bg-white/[0.03] p-2 rounded-lg border border-white/[0.04] group-hover:scale-110 transition-transform duration-300">
                {getIcon(notif.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2.5 mb-1">
                  <Link to={`/profile/${notif.sender?._id}`} className="flex-shrink-0">
                    <img src={notif.sender?.profilePicture || '/default-avatar.png'} className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/[0.06]" alt="" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white leading-tight">
                      <Link to={`/profile/${notif.sender?._id}`} className="font-bold hover:text-blue-400 transition-colors">{notif.sender?.name || 'Deleted User'}</Link>
                      <span className="text-slate-500 font-medium ml-1">
                        {notif.type === 'like' && 'liked your post'}
                        {notif.type === 'comment' && 'commented on your post'}
                        {notif.type === 'follow' && 'started following you'}
                      </span>
                    </p>
                    <p className="text-[10px] font-bold text-slate-600 mt-0.5 uppercase tracking-widest flex items-center">
                      <Sparkles className="w-2.5 h-2.5 mr-1 text-blue-400/50" />
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {notif.post && (
                  <Link to={`/post/${notif.post._id}`} className="block mt-2 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:border-blue-500/10 hover:bg-white/[0.03] transition-all">
                    <p className="text-[13px] font-semibold text-slate-400 italic flex items-center">
                      <MessageCircle className="w-3 h-3 mr-2 text-blue-400/50" /> "{notif.post.title || 'View Post'}"
                    </p>
                  </Link>
                )}
              </div>
              
              {!notif.read && (
                <div className="flex-shrink-0 animate-pulse">
                  <div className="w-2 h-2 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState 
          icon={Bell}
          title="Quiet as a library..."
          description="It's peaceful here. No notifications yet, but stick around—the community moves fast!"
          actionText="Back to Feed"
          actionLink="/"
        />
      )}
    </motion.div>
  );
};

export default Notifications;
