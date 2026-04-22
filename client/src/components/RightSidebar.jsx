import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Sparkles, BookOpen, ExternalLink, BarChart3, Clock, Smartphone, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';
import socket from '../utils/socket';
import { formatDistanceToNow } from 'date-fns';
import ProBadge from './ProBadge';


const RightSidebar = () => {
  const [topUsers, setTopUsers] = useState([]);
  const [trendingTags, setTrendingTags] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalPosts: 0, totalTags: 0, activeToday: 0 });
  const [loading, setLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, tagsRes, statsRes, leaderRes] = await Promise.all([
          API.get('/users/active').catch(() => ({ data: [] })),
          API.get('/posts/trending-tags').catch(() => ({ data: [] })),
          API.get('/posts/community-stats').catch(() => ({ data: { totalStudents: 0, totalPosts: 0, totalTags: 0, activeToday: 0 } })),
          API.get('/users/leaderboard').catch(() => ({ data: [] }))
        ]);
        const usersData = Array.isArray(usersRes.data) ? usersRes.data : [];
        const tagsData = Array.isArray(tagsRes.data) ? tagsRes.data : [];
        const leaderData = Array.isArray(leaderRes.data) ? leaderRes.data : [];
        
        setTopUsers(usersData.slice(0, 5));
        setTrendingTags(tagsData.slice(0, 5));
        setLeaderboard(leaderData);
        setStats(statsRes.data || { totalStudents: 0, totalPosts: 0, totalTags: 0, activeToday: 0 });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();

    socket.on('user_online', ({ userId, isOnline }) => {
      setTopUsers(prev => prev.map(u => {
        if (u._id === userId) {
          return { ...u, isOnline, lastSeen: new Date() };
        }
        return u;
      }));
    });

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      socket.off('user_online');
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <aside className="hidden xl:flex flex-col w-[300px] shrink-0 sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto pl-4 pb-12 space-y-6 scrollbar-thin" id="right-sidebar">
      
      {/* High-Performance Stats Bento */}
      <div className="p-6 rounded-[2.5rem] glass border border-white/[0.05] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-700" />
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-600/20">
            <BarChart3 className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="font-black text-white text-xs uppercase tracking-[0.2em]">Platform Metrics</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-blue-500/20 transition-all">
            <p className="text-2xl font-black text-white tracking-tighter tabular-nums">{stats.totalStudents || '1.2k'}</p>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">Total Scholars</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-blue-500/20 transition-all">
            <p className="text-2xl font-black text-white tracking-tighter tabular-nums">{stats.totalPosts || '4.5k'}</p>
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">Discussions</p>
          </div>
        </div>
      </div>

      {/* Live Member Pulse */}
      <div className="p-6 rounded-[2.5rem] glass border border-white/[0.05] relative overflow-hidden group">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600/10 rounded-xl flex items-center justify-center border border-emerald-600/20">
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="font-black text-white text-xs uppercase tracking-[0.2em]">Active Pulse</h3>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/10">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter">Live Hub</span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-10 h-10 bg-white/[0.04] rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-2.5 w-24 bg-white/[0.04] rounded" />
                  <div className="h-2 w-16 bg-white/[0.02] rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {topUsers.map((u) => (
              <Link
                key={u._id}
                to={`/profile/${u._id}`}
                className="flex items-center gap-4 group/item hover:bg-white/[0.02] p-1 rounded-2xl transition-all"
              >
                <div className="relative shrink-0">
                  <img
                    src={u.profilePicture}
                    alt={u.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/10 group-hover/item:ring-blue-500/30 transition-all duration-300"
                  />
                  {u.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[3px] border-[#0d1428] shadow-sm shadow-emerald-500/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-black text-[13px] text-white/80 truncate group-hover/item:text-white tracking-tight">
                      {u.name}
                    </p>
                    {u.isVerified && <ProBadge className="scale-[0.5] origin-left" />}
                  </div>
                  <p className="text-[9px] font-bold text-slate-600 truncate uppercase tracking-widest mt-0.5">
                    {u.isOnline ? (
                      <span className="text-emerald-500/80">Broadcasting Now</span>
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
            {topUsers.length === 0 && <p className="text-slate-700 text-[11px] font-black uppercase text-center py-4 tracking-widest italic">Quiet Terminal</p>}
          </div>
        )}
      </div>

      {/* Narrative Trending Tags */}
      <div className="p-6 rounded-[2.5rem] glass border border-white/[0.05] relative overflow-hidden group">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-purple-600/10 rounded-xl flex items-center justify-center border border-purple-600/20">
            <Sparkles className="w-4 h-4 text-purple-400 text-gradient" />
          </div>
          <h3 className="font-black text-white text-xs uppercase tracking-[0.2em]">Viral Topics</h3>
        </div>

        <div className="space-y-1">
          {trendingTags.length > 0 ? (
            trendingTags.map((item, i) => (
              <Link
                key={item.tag}
                to={`/search?q=${item.tag}`}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-white/[0.03] transition-all group/tag"
              >
                <div className="flex items-center gap-3">
                  <span className="text-[14px] font-black text-slate-800 w-4 group-hover/tag:text-purple-400 transition-colors">0{i + 1}</span>
                  <span className="text-[13px] font-black text-white/80 group-hover/tag:text-white transition-colors tracking-tight">
                    #{item.tag}
                  </span>
                </div>
                <div className="text-[9px] bg-white/[0.04] px-2 py-1 rounded-lg text-slate-600 font-black group-hover/tag:bg-purple-500/10 group-hover:text-purple-400 transition-all">
                  {item.posts}
                </div>
              </Link>
            ))
          ) : (
            <p className="text-slate-700 text-[11px] font-black uppercase text-center py-4 tracking-widest italic">Feed Inactive</p>
          )}
        </div>
      </div>

      {/* Department Dominance Leaderboard */}
      <div className="p-6 rounded-[2.5rem] glass border border-white/[0.05] relative overflow-hidden group">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-amber-600/10 rounded-xl flex items-center justify-center border border-amber-600/20">
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="font-black text-white text-xs uppercase tracking-[0.2em]">Campus Dominance</h3>
        </div>

        <div className="space-y-5">
          {leaderboard.length > 0 ? (
            leaderboard.slice(0,4).map((dept, i) => (
              <div key={dept._id} className="relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-black ${i === 0 ? 'text-amber-400' : 'text-slate-700'}`}>TOP {i + 1}</span>
                    <span className="text-[12px] font-black text-white truncate max-w-[140px] tracking-tight">{dept._id}</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden p-0.5 border border-white/[0.02]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(dept.students / leaderboard[0].students) * 100}%` }}
                    className={`h-full rounded-full ${i === 0 ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'bg-blue-600'}`}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-700 text-[11px] font-black uppercase text-center py-4 tracking-widest italic">Calibrating Ranks...</p>
          )}
        </div>
      </div>

      {/* PWA Pro Mobile Card */}
      {isInstallable && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 relative overflow-hidden group"
        >
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="w-5 h-5 text-blue-400" />
            <h3 className="font-black text-white text-xs uppercase tracking-[0.2em]">Native Portal</h3>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed mb-6 font-medium">
            Transform your browser session into a high-performance native application.
          </p>
          <button
            onClick={() => {
              if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                  if (choiceResult.outcome === 'accepted') setIsInstallable(false);
                  setDeferredPrompt(null);
                });
              }
            }}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20 active:scale-95 border border-white/10"
          >
            Deploy Native App
          </button>
        </motion.div>
      )}

      {/* Pro Study Hub Card */}
      <div className="p-6 rounded-[2.5rem] bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 relative overflow-hidden group">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <h3 className="font-black text-white text-xs uppercase tracking-[0.2em]">Research Core</h3>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed mb-6 font-medium">
          Access the community-driven database of validated research and course materials.
        </p>
        <Link
          to="/library"
          className="w-full py-4 bg-white/[0.05] hover:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-white/10 active:scale-95 group-hover:border-indigo-400/30"
        >
          <ExternalLink className="w-3.5 h-3.5" /> Open Library
        </Link>
      </div>

      <div className="px-6">
        <p className="text-[9px] text-slate-700 font-black uppercase tracking-[0.4em] leading-relaxed">
          Arsi Aseko University Platform <br />
          Enterprise Student Environment
        </p>
      </div>
    </aside>
  );
};

export default RightSidebar;
