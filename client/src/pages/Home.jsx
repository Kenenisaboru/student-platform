import { useState, useEffect, useCallback, useRef } from 'react';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import { Loader2, Plus, Sparkles, MessageCircle, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PostSkeleton } from '../components/Skeleton';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import EmptyState from '../components/EmptyState';

const Home = () => {
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
      
      // Handle both paginated and non-paginated response
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

  // Infinite scroll observer
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
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const quotes = [
    "The best way to predict your future is to create it.",
    "Education is the most powerful weapon you can use to change the world.",
    "The capacity to learn is a gift. The ability to learn is a skill.",
    "An investment in knowledge pays the best interest.",
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="max-w-2xl mx-auto px-0 pb-12">
      <Helmet>
        <title>Home | Communication Platform</title>
        <meta name="description" content="Connect, share, and collaborate with your academic community." />
      </Helmet>

      {/* Welcome Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.97, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="rounded-2xl p-6 sm:p-8 mb-6 overflow-hidden relative border border-white/[0.06] bg-gradient-to-br from-blue-600/10 via-indigo-600/8 to-purple-600/5"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-lg">
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/10 text-[11px] font-bold mb-3 text-blue-400 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 mr-1.5" /> Welcome to the Network
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 text-white tracking-tight leading-tight">
              Communication <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Platform</span>
            </h1>
            <p className="text-slate-400 text-[13px] sm:text-sm leading-relaxed">
              A premium space to connect with your peers. Share ideas, collaborate on projects, and grow your professional network together.
            </p>
          </div>
          <div className="hidden md:flex relative w-24 h-24 justify-center items-center shrink-0">
             <div className="w-20 h-20 bg-white/[0.04] rounded-2xl backdrop-blur-lg border border-white/[0.06] shadow-xl flex items-center justify-center rotate-6">
               <h1 className="text-3xl font-black text-white -rotate-6">CP</h1>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full -ml-10 -mb-10 blur-2xl"></div>
      </motion.div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="glass-card-hover p-4 rounded-xl flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0"><Zap className="w-4 h-4" /></div>
          <div>
            <h4 className="font-bold text-white text-[13px]">Quote of the Day</h4>
            <p className="text-slate-500 text-[12px] italic mt-0.5 leading-relaxed">"{randomQuote}"</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="glass-card-hover p-4 rounded-xl flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0"><TrendingUp className="w-4 h-4" /></div>
          <div>
            <h4 className="font-bold text-white text-[13px]">Study Tip</h4>
            <p className="text-slate-500 text-[12px] mt-0.5 leading-relaxed">Use the Focus Hub (bottom right) to manage your study sessions!</p>
          </div>
        </motion.div>
      </div>

      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 px-1">
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Recent Discussions</h2>
        <Link to="/create-post"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center group w-full sm:w-auto hover:shadow-blue-500/30 active:scale-95 text-sm">
          <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" /> Start Discussion
        </Link>
      </div>

      {/* Posts Feed with Infinite Scroll */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
        </div>
      ) : posts.length > 0 ? (
        <>
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
            {posts.map(post => (
              <PostCard key={post._id} post={post} onDelete={handleDelete} onUpdate={() => fetchPosts(1)} />
            ))}
          </motion.div>

          {/* Infinite Scroll Trigger */}
          <div ref={loadMoreRef} className="py-8 flex justify-center">
            {loadingMore && (
              <div className="flex items-center gap-3 text-slate-500">
                <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <span className="text-sm font-medium">Loading more...</span>
              </div>
            )}
            {!hasMore && posts.length > 5 && (
              <p className="text-slate-600 text-sm font-medium">You've reached the end 🎉</p>
            )}
          </div>
        </>
      ) : (
        <EmptyState 
          icon={MessageCircle}
          title="No Discussions Yet"
          description="Be the first to share an idea! Start a conversation with your community today."
          actionText="Create a post"
          actionLink="/create-post"
        />
      )}
    </div>
  );
};

export default Home;
