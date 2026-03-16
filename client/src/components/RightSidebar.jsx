import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Sparkles, BookOpen, ExternalLink, BarChart3 } from 'lucide-react';
import API from '../api/axios';

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
        setTopUsers(usersRes.data.slice(0, 5));
        setTrendingTags(tagsRes.data.slice(0, 5));
        setStats(statsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
            <h3 className="font-bold text-white text-sm">Active Now</h3>
          </div>
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
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
                    className="w-9 h-9 rounded-lg object-cover ring-1 ring-white/10 group-hover:ring-blue-500/30 transition-all"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-[1.5px] border-[#0a0f1e]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[13px] text-slate-300 truncate group-hover:text-white transition-colors">
                    {u.name}
                  </p>
                  <p className="text-[11px] text-slate-600 truncate">{u.university}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-slate-600 text-sm text-center py-4 italic">No active users yet</p>
        )}
      </div>

      {/* Trending Tags — Real Data */}
      <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.05] backdrop-blur-sm">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 bg-purple-500/10 rounded-xl flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="font-bold text-white text-sm">Trending</h3>
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
                  <span className="text-[11px] font-bold text-slate-600 w-4">{i + 1}</span>
                  <span className="text-[13px] font-semibold text-slate-300 group-hover:text-white transition-colors">
                    #{item.tag}
                  </span>
                </div>
                <span className="text-[11px] text-slate-600 font-medium">
                  {item.posts} {item.posts === 1 ? 'post' : 'posts'}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-slate-600 text-sm text-center py-4 italic">No trending tags yet. Start posting!</p>
        )}
      </div>

      {/* Study Resources */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-600/5 to-purple-600/5 border border-indigo-500/10">
        <div className="flex items-center gap-2.5 mb-3">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <h3 className="font-bold text-white text-sm">Study Hub</h3>
        </div>
        <p className="text-[12px] text-slate-500 leading-relaxed mb-3">
          Access curated resources, past exams, and study guides from the community.
        </p>
        <Link
          to="/search?q=study"
          className="w-full text-[12px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/15 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Browse Resources
        </Link>
      </div>

      {/* Footer */}
      <div className="px-4 pt-4">
        <p className="text-[10px] text-slate-700 leading-relaxed">
          © {new Date().getFullYear()} Arsi Aseko Network · <span className="text-slate-600">Nexus Pro</span>
        </p>
      </div>
    </aside>
  );
};

export default RightSidebar;
