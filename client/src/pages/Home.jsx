import { useState, useEffect, useCallback, useRef } from 'react';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import { Loader2, Plus, Sparkles, MessageCircle, TrendingUp, Zap, BookOpen, GraduationCap, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PostSkeleton } from '../components/Skeleton';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const fetchPosts = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      else setLoadingMore(true);

      const { data } = await API.get(`/posts?page=${pageNum}&limit=10`);
      
      const newPosts = data.posts || data;
      const more = data.hasMore !== undefined ? data.hasMore : false;

      if (append) {
        setPosts(prev => [...prev, ...newPosts]);
      } else {
        setPosts(newPosts);
      }
      setHasMore(more);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchPosts(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    observerRef.current = observer;
    return () => observer.disconnect();
  }, [loading, hasMore, loadingMore, page]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await API.delete(`/posts/${id}`);
        setPosts(posts.filter(p => p._id !== id));
        toast.success('Post deleted successfully');
      } catch (err) {
        toast.error('Failed to delete post');
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const quotes = [
    "The best way to predict your future is to create it.",
    "Education is the most powerful weapon you can use to change the world.",
    "The capacity to learn is a gift. The ability to learn is a skill.",
    "An investment in knowledge pays the best interest.",
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="max-w-2xl mx-auto px-0 pb-24">
      <Helmet>
        <title>Dashboard | Arsi Aseko University</title>
        <meta name="description" content="Connect, share, and collaborate with the Arsi Aseko University academic community." />
      </Helmet>

      {/* Pro Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[2rem] p-8 mb-8 overflow-hidden bg-[#0d1428] border border-white/[0.05] shadow-2xl group"
      >
        {/* Animated background patterns */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[60px] group-hover:bg-purple-500/20 transition-all duration-700"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
             <div className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">
               Daily Directive
             </div>
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Portal Online</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tighter leading-tight">
            Greetings, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{user?.name?.split(' ')[0] || 'Scholar'}</span>.
          </h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-md opacity-80 mb-8">
            Welcome to the Arsi Aseko University official portal. Your centralized hub for academic excellence.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3">
             <Button asChild variant="pro-white" className="w-full sm:w-auto rounded-xl font-bold text-xs px-5 py-2.5 h-auto justify-start sm:justify-center">
               <Link to="/create-post">
                  <Plus className="w-4 h-4 mr-2" /> Start Discussion
               </Link>
             </Button>
             <Button asChild variant="outline" className="w-full sm:w-auto bg-white/[0.05] border-white/10 text-white rounded-xl font-bold text-xs hover:bg-white/[0.1] px-5 py-2.5 h-auto justify-start sm:justify-center">
               <Link to="/events">
                  <Calendar className="w-4 h-4 text-blue-400 mr-2" /> Campus Events
               </Link>
             </Button>
             <Button asChild variant="outline" className="w-full sm:w-auto bg-white/[0.05] border-white/10 text-white rounded-xl font-bold text-xs hover:bg-white/[0.1] px-5 py-2.5 h-auto justify-start sm:justify-center">
               <Link to="/announcements">
                  <Zap className="w-4 h-4 text-amber-400 mr-2" /> Announcements
               </Link>
             </Button>
          </div>
        </div>
      </motion.div>

      {/* Bento-style Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-2 glass-card-hover p-6 rounded-[2rem] relative overflow-hidden group border border-white/[0.04]"
        >
          <div className="flex items-start justify-between mb-4">
             <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                <Zap className="w-5 h-5" />
             </div>
             <Sparkles className="w-4 h-4 text-slate-700" />
          </div>
          <h4 className="font-black text-white text-sm mb-2 tracking-tight uppercase tracking-[0.05em]">Perspective</h4>
          <p className="text-slate-400 text-xs italic leading-relaxed font-medium">"{randomQuote}"</p>
          <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-card-hover p-6 rounded-[2rem] border border-white/[0.04] bg-blue-600/5 flex flex-col justify-between"
        >
          <TrendingUp className="w-5 h-5 text-blue-400 mb-4" />
          <div>
             <h4 className="font-black text-white text-xs mb-1 tracking-widest uppercase">Academics</h4>
             <p className="text-[10px] text-slate-500 font-bold">Exam season approaching. Check guidelines.</p>
          </div>
        </motion.div>
      </div>

      {/* Active Discussions Tab Header */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
           <div className="w-1 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
           <h2 className="text-xl font-black text-white tracking-tighter">Unified Feed</h2>
        </div>
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.05]">
           Latest Updates
        </div>
      </div>

      {/* Posts Feed with Infinite Scroll */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
        </div>
      ) : posts.length > 0 ? (
        <>
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
            {posts.map(post => (
              <PostCard key={post._id} post={post} onDelete={handleDelete} onUpdate={() => fetchPosts(1)} />
            ))}
          </motion.div>

          <div ref={loadMoreRef} className="py-12 flex justify-center">
            {loadingMore && (
              <div className="flex items-center gap-3 text-slate-500 bg-white/[0.03] px-6 py-3 rounded-2xl border border-white/[0.05]">
                <div className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <span className="text-xs font-black uppercase tracking-widest">Syncing Feed...</span>
              </div>
            )}
            {!hasMore && posts.length > 5 && (
              <div className="flex flex-col items-center gap-4 opacity-50">
                 <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-slate-500" />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 text-center px-4">
                  End of transmissions. Start a new discussion to continue.
                 </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <EmptyState 
          icon={MessageCircle}
          title="Static Void Found"
          description="The community is waiting for your insight. Be the pioneer and launch the first discussion."
          actionText="Initialize Thread"
          actionLink="/create-post"
        />
      )}
    </div>
  );
};

export default Home;
