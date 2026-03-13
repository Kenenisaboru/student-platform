import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import { Loader2, Search, User, ArrowLeft, Users, FileText, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        
        setResults({
          users: usersRes.data,
          posts: postsRes.data.filter(p => 
            p.title.toLowerCase().includes(query.toLowerCase()) || 
            p.content.toLowerCase().includes(query.toLowerCase())
          )
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) return (
    <div className="flex justify-center py-24">
      <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-0 pb-20"
    >
      <button 
        onClick={() => navigate(-1)} 
        className="mb-8 flex items-center text-slate-500 hover:text-primary-600 font-semibold transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> 
        Back
      </button>

      <div className="flex items-center space-x-4 mb-12">
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary-600 shadow-xl shadow-primary-500/10 border border-slate-100">
          <Search className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Results for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 text-shadow-sm">"{query}"</span>
          </h1>
          <p className="text-slate-500 font-medium">Found {results.posts.length} posts and {results.users.length} students</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Posts Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center space-x-3 px-2">
            <FileText className="w-5 h-5 text-indigo-500" />
            <h2 className="text-xs font-bold text-slate-400 px-2 uppercase tracking-widest">Discussions</h2>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {results.posts.length > 0 ? (
              results.posts.map(post => (
                <motion.div key={post._id} variants={itemVariants}>
                  <PostCard post={post} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                variants={itemVariants}
                className="p-12 bg-white/50 backdrop-blur-sm rounded-[2rem] text-center border-2 border-dashed border-slate-100 shadow-sm"
              >
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                   <FileText className="w-8 h-8 text-slate-200" />
                </div>
                <p className="text-slate-400 font-bold italic">No matching posts found.</p>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Students Column */}
        <div className="space-y-8">
          <div className="flex items-center space-x-3 px-2">
            <Users className="w-5 h-5 text-primary-500" />
            <h2 className="text-xs font-bold text-slate-400 px-2 uppercase tracking-widest">Students</h2>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/70 backdrop-blur-xl rounded-[2rem] border border-white shadow-2xl shadow-slate-200/40 overflow-hidden"
          >
            {results.users.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {results.users.map(u => (
                  <Link 
                    key={u._id} 
                    to={`/profile/${u._id}`}
                    className="flex items-center space-x-4 p-5 hover:bg-slate-50 transition-all group"
                  >
                    <div className="relative">
                      <img 
                        src={u.profilePicture} 
                        className="w-14 h-14 rounded-2xl object-cover ring-4 ring-white shadow-md group-hover:scale-105 transition-transform" 
                        alt="" 
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="font-extrabold text-slate-900 truncate group-hover:text-primary-600 transition-colors uppercase text-sm tracking-tight">{u.name}</p>
                        <Sparkles className="w-3 h-3 ml-2 text-primary-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <p className="text-[11px] font-bold text-slate-400 truncate mt-0.5">{u.university}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                   <User className="w-8 h-8 text-slate-200" />
                </div>
                <p className="text-slate-400 font-bold italic">No matching students.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchResults;
