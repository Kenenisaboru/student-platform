import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Bell, Heart, MessageCircle, UserPlus, Loader2, Check } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';

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
      case 'comment': return <MessageCircle className="w-5 h-5 text-blue-500 fill-current" />;
      case 'follow': return <UserPlus className="w-5 h-5 text-green-500" />;
      default: return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        {notifications.some(n => !n.read) && (
          <button 
            onClick={markAllRead}
            className="text-primary-600 font-semibold hover:underline text-sm flex items-center"
          >
            <Check className="w-4 h-4 mr-1" /> Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        </div>
      ) : notifications.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {notifications.map((notif) => (
            <div 
              key={notif._id} 
              className={`p-4 border-b border-slate-100 flex items-start space-x-4 transition-colors ${!notif.read ? 'bg-primary-50/30' : 'hover:bg-slate-50'}`}
            >
              <div className="mt-1">{getIcon(notif.type)}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Link to={`/profile/${notif.sender._id}`}>
                    <img 
                      src={notif.sender.profilePicture} 
                      className="w-8 h-8 rounded-full object-cover" 
                      alt="" 
                    />
                  </Link>
                  <p className="text-slate-900">
                    <Link to={`/profile/${notif.sender._id}`} className="font-bold hover:underline">
                      {notif.sender.name}
                    </Link>
                    {' '}
                    {notif.type === 'like' && 'liked your post'}
                    {notif.type === 'comment' && 'commented on your post'}
                    {notif.type === 'follow' && 'started following you'}
                    {notif.post && (
                      <Link to={`/post/${notif.post._id}`} className="font-medium text-primary-600 block mt-0.5 italic">
                        "{notif.post.title}"
                      </Link>
                    )}
                  </p>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                </p>
              </div>
              {!notif.read && <div className="w-2 h-2 bg-primary-500 rounded-full mt-2"></div>}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500">No notifications yet.</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
