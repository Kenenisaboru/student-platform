import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Bell, Heart, MessageCircle, UserPlus, Loader2, Check, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

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

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'like': return <Heart className="w-5 h-5 text-pink-500 fill-current" />;
      case 'comment': return <MessageCircle className="w-5 h-5 text-indigo-500 fill-current" />;
      case 'follow': return <UserPlus className="w-5 h-5 text-emerald-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-0 pb-20"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Activity</h1>
            <p className="text-slate-500 font-medium text-sm">Stay updated with your network</p>
          </div>
        </div>
        
        <AnimatePresence>
          {notifications.some(n => !n.read) && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={markAllRead}
              className="bg-white border-2 border-slate-100 hover:border-primary-100 text-slate-700 font-bold px-5 py-2.5 rounded-2xl shadow-sm text-sm flex items-center transition-all group"
            >
              <Check className="w-4 h-4 mr-2 text-primary-500" /> Mark all as read
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        </div>
      ) : notifications.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/40 overflow-hidden divide-y divide-slate-50"
        >
          {notifications.map((notif) => (
            <motion.div 
              key={notif._id} 
              variants={itemVariants}
              className={`p-6 sm:p-8 flex items-start space-x-4 sm:space-x-6 transition-all duration-300 relative group ${!notif.read ? 'bg-primary-50/20' : 'hover:bg-slate-50/50'}`}
            >
              {!notif.read && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-500 rounded-full my-6"></div>
              )}
              
              <div className="mt-1 flex-shrink-0 bg-white p-2.5 rounded-xl shadow-sm border border-slate-50 group-hover:scale-110 transition-transform duration-300">
                {getIcon(notif.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Link to={`/profile/${notif.sender._id}`} className="flex-shrink-0 group/avatar">
                    <img 
                      src={notif.sender.profilePicture} 
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-sm transition-all group-hover/avatar:ring-primary-100" 
                      alt="" 
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 leading-tight">
                      <Link to={`/profile/${notif.sender._id}`} className="font-extrabold hover:text-primary-600 transition-colors">
                        {notif.sender.name}
                      </Link>
                      <span className="text-slate-600 font-medium mx-1.5">
                        {notif.type === 'like' && 'liked your thought'}
                        {notif.type === 'comment' && 'shared a thought on your post'}
                        {notif.type === 'follow' && 'started following your journey'}
                      </span>
                    </p>
                    <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-widest flex items-center">
                      <Sparkles className="w-3 h-3 mr-1 text-primary-300" />
                      {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>

                {notif.post && (
                  <Link to={`/post/${notif.post._id}`} className="block mt-3 p-4 bg-white/50 border border-slate-100/50 rounded-2xl hover:border-primary-100 hover:bg-white transition-all duration-300 group/post">
                    <p className="text-sm font-bold text-slate-700 italic flex items-center">
                      <MessageCircle className="w-3.5 h-3.5 mr-2 text-indigo-400 group-hover/post:rotate-12 transition-transform" />
                      "{notif.post.title}"
                    </p>
                  </Link>
                )}
              </div>
              
              {!notif.read && (
                <div className="flex-shrink-0 animate-pulse">
                  <div className="w-2.5 h-2.5 bg-primary-500 rounded-full shadow-lg shadow-primary-500/50"></div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 bg-white/50 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-slate-100 shadow-sm"
        >
          <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Bell className="w-12 h-12 text-slate-200" />
          </div>
          <h3 className="text-xl font-bold text-slate-400 tracking-tight">Quiet as a library...</h3>
          <p className="text-slate-400 font-medium mt-2">No notifications yet. Explore and interact to see updates!</p>
          <Link to="/" className="inline-flex items-center justify-center mt-8 bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-lg">
            Back to Feed
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Notifications;
