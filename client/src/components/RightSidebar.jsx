import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Sparkles, BookOpen, ExternalLink, BarChart3, Clock } from 'lucide-react';
import API from '../api/axios';
import socket from '../utils/socket';
import { formatDistanceToNow } from 'date-fns';

const RightSidebar = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [trendingTags, setTrendingTags] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalPosts: 0, totalTags: 0, activeToday: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, tagsRes, statsRes] = await Promise.all([
          API.get('/users/active').catch(() => ({ data: [] })),
          API.get('/posts/trending-tags').catch(() => ({ data: [] })),
          API.get('/posts/community-stats').catch(() => ({ data: { totalStudents: 0, totalPosts: 0, totalTags: 0, activeToday: 0 } }))
        ]);
        const usersData = Array.isArray(usersRes.data) ? usersRes.data : [];
        const tagsData = Array.isArray(tagsRes.data) ? tagsRes.data : [];
        
        setTopUsers(usersData.slice(0, 6));
        setTrendingTags(tagsData.slice(0, 5));
        setStats(statsRes.data || { totalStudents: 0, totalPosts: 0, totalTags: 0, activeToday: 0 });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    // Listen for real-time online status updates
    socket.on('user_online', ({ userId, isOnline }) => {
      setTopUsers(prev => prev.map(u => {
        if (u._id === userId) {
          return { ...u, isOnline, lastSeen: new Date() };
        }
        return u;
      }));
    });

    return () => {
      socket.off('user_online');
    };
  }, []);

  return (
    <aside className="hidden xl:flex flex-col w-[280px] shrink-0 sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto pl-2 pb-8 space-y-5 scrollbar-thin" id="right-sidebar">
      
      {/* Community Stats */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 bg-blue-500/10 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="font-bold text-white text-sm">Community Pulse</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
            <p className="text-2xl font-extrabold text-white">{stats.totalStudents}</p>
            <p className="text-[11px] font-medium text-slate-500">Students</p>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
            <p className="text-2xl font-extrabold text-white">{stats.totalPosts}</p>
            <p className="text-[11px] font-medium text-slate-500">Discussions</p>
          </div>
        </div>
      </div>

      {/* Active Students */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-500/10 rounded-xl flex items-center justify-center">
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="font-bold text-white text-sm">Activity Hub</h3>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            LIVE
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-9 h-9 bg-white/5 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-20 bg-white/5 rounded" />
                  <div className="h-2 w-16 bg-white/5 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : topUsers.length > 0 ? (
          <div className="space-y-1">
            {topUsers.map((u) => (
              <Link
                key={u._id}
                to={`/profile/${u._id}`}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-all group"
              >
                <div className="relative">
                  <img
                    src={u.profilePicture}
                    alt={u.name}
                    className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/10 group-hover:ring-blue-500/30 transition-all border border-white/5"
                  />
                  {u.isOnline ? (
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#111827]" />
                  ) : (
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-slate-700 rounded-full border-2 border-[#111827]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[13px] text-slate-300 truncate group-hover:text-white transition-colors">
                    {u.name}
                  </p>
                  <p className="text-[10px] text-slate-600 truncate flex items-center gap-1">
                    {u.isOnline ? (
                      <span className="text-emerald-500 font-bold uppercase tracking-tighter">Online</span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />
                        {u.lastSeen ? formatDistanceToNow(new Date(u.lastSeen), { addSuffix: true }) : 'Offline'}
                      </span>
                    )}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-slate-600 text-sm text-center py-4 italic">No active users yet</p>
        )}
      </div>

      {/* Trending Tags */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="font-bold text-white text-sm">Now Trending</h3>
        </div>

        {trendingTags.length > 0 ? (
          <div className="space-y-1">
            {trendingTags.map((item, i) => (
              <Link
                key={item.tag}
                to={`/search?q=${item.tag}`}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.04] transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-black text-slate-700 w-4 group-hover:text-purple-400 transition-colors">#{i + 1}</span>
                  <span className="text-[13px] font-bold text-slate-300 group-hover:text-white transition-colors">
                    #{item.tag}
                  </span>
                </div>
                <span className="text-[10px] bg-white/[0.04] px-2 py-0.5 rounded-lg text-slate-500 font-bold group-hover:bg-purple-500/10 group-hover:text-purple-400 transition-all">
                  {item.posts}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-slate-600 text-sm text-center py-4 italic">No trending tags yet. Start posting!</p>
        )}
      </div>

      {/* Study Resources */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600/5 to-purple-600/5 border border-indigo-500/10 relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-20 h-20 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all" />
        <div className="flex items-center gap-2.5 mb-3">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-white text-sm tracking-tight text-white group-hover:text-indigo-300 transition-colors">Resource Vault</h3>
        </div>
        <p className="text-[12px] text-slate-500 leading-relaxed mb-4 font-medium">
          Access curated past exams, department notes, and study guides from the community.
        </p>
        <Link
          to="/search?q=study"
          className="w-full text-[12px] font-bold text-white bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/20"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Browse Files
        </Link>
      </div>

      {/* Footer */}
      <div className="px-5 pt-2">
        <p className="text-[10px] text-slate-700 leading-relaxed font-bold uppercase tracking-widest">
          © {new Date().getFullYear()} Arsi Aseko Network · V2.0
        </p>
      </div>
    </aside>
  );
};

export default RightSidebar;
