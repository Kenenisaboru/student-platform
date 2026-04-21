import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import { Loader2, Search, User, ArrowLeft, Users, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import EmptyState from '../components/EmptyState';

const SearchResults = () => {
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const [usersRes, postsRes] = await Promise.all([
          API.get(`/users/search?search=${query}`),
          API.get('/posts')
        ]);
        
        // Both endpoints return { users/posts: [], ... } objects
        const users = usersRes.data.users || [];
        const posts = postsRes.data.posts || [];

        setResults({
          users,
          posts: posts.filter(p =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.content.toLowerCase().includes(query.toLowerCase())
          )
        });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchResults();
  }, [query]);

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
  const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4 sm:py-8 px-2 sm:px-0 pb-20">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-slate-500 hover:text-blue-400 font-semibold transition-colors group text-sm">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <div className="flex items-center space-x-3 mb-8">
        <div className="w-11 h-11 glass-card rounded-xl flex items-center justify-center text-blue-400">
          <Search className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Results for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">"{query}"</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm">{results.posts.length} posts · {results.users.length} students</p>
        </div>
      </div>

      {/* Students Row */}
      {results.users.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center space-x-2 px-1 mb-3">
            <Users className="w-4 h-4 text-blue-400" />
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Students</h2>
          </div>
          <div className="glass-card rounded-xl overflow-hidden divide-y divide-white/[0.03]">
            {results.users.map(u => (
              <Link key={u._id} to={`/profile/${u._id}`} className="flex items-center space-x-3.5 p-4 hover:bg-white/[0.03] transition-all group">
                <div className="relative">
                  <img src={u.profilePicture} className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/[0.06] group-hover:ring-blue-500/20 transition-all" alt="" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-[1.5px] border-[#0a0f1e]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <p className="font-bold text-white truncate group-hover:text-blue-400 transition-colors text-sm">{u.name}</p>
                    <Sparkles className="w-3 h-3 ml-1.5 text-blue-400/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-[12px] font-medium text-slate-600 truncate">{u.university}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Posts */}
      <div>
        <div className="flex items-center space-x-2 px-1 mb-3">
          <FileText className="w-4 h-4 text-indigo-400" />
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Discussions</h2>
        </div>
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
          {results.posts.length > 0 ? (
            results.posts.map(post => (
              <motion.div key={post._id} variants={itemVariants}>
                <PostCard post={post} />
              </motion.div>
            ))
          ) : (
            <EmptyState 
              icon={FileText}
              title="No Discussions Found"
              description={`We couldn't find any posts matching "${query}". Try searching for something else like "exam" or "internship".`}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SearchResults;
