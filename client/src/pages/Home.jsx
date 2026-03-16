import { useState, useEffect, useCallback, useRef } from 'react';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import { Loader2, Plus, Sparkles, MessageCircle, TrendingUp, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PostSkeleton } from '../components/Skeleton';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const { data } = await API.get('/posts');
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await API.delete(`/posts/${id}`);
        setPosts(posts.filter(p => p._id !== id));
        toast.success('Post deleted successfully');
      } catch (err) {
        toast.error('Failed to delete post');
        console.error(err);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
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
        <title>Home | Arsi Aseko Student Network</title>
        <meta name="description" content="Connect with students across Arsi Aseko universities." />
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
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/10 text-[11px] font-bold mb-3 text-blue-400 uppercase tracking-wider"
            >
              <Sparkles className="w-3 h-3 mr-1.5" />
              Welcome to Nexus
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 text-white tracking-tight leading-tight">
              Arsi Aseko <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Network</span>
            </h1>
            <p className="text-slate-400 text-[13px] sm:text-sm leading-relaxed">
              Connect with your peers across Arsi Aseko universities. Share ideas, collaborate, and grow together.
            </p>
          </div>
          
          <div className="hidden md:flex relative w-24 h-24 justify-center items-center shrink-0">
             <div className="w-20 h-20 bg-white/[0.04] rounded-2xl backdrop-blur-lg border border-white/[0.06] shadow-xl flex items-center justify-center rotate-6">
               <h1 className="text-3xl font-black text-white -rotate-6">AAN</h1>
             </div>
          </div>
        </div>

        {/* Decorative */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full -ml-10 -mb-10 blur-2xl"></div>
      </motion.div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card-hover p-4 rounded-xl flex items-start gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-white text-[13px]">Quote of the Day</h4>
            <p className="text-slate-500 text-[12px] italic mt-0.5 leading-relaxed">"{randomQuote}"</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card-hover p-4 rounded-xl flex items-start gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-white text-[13px]">Study Tip</h4>
            <p className="text-slate-500 text-[12px] mt-0.5 leading-relaxed">Use the Focus Hub (bottom right) to manage your study sessions!</p>
          </div>
        </motion.div>
      </div>

      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 px-1">
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Recent Discussions</h2>
        <Link
          to="/create-post"
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center group w-full sm:w-auto hover:shadow-blue-500/30 active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Start Discussion
        </Link>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
        </div>
      ) : posts.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {posts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={handleDelete}
              onUpdate={fetchPosts}
            />
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 glass-card rounded-2xl"
        >
          <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-7 h-7 text-slate-600" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No Discussions Yet</h3>
          <p className="text-slate-500 mb-6 text-sm">Be the first to share an idea and start the conversation!</p>
          <Link to="/create-post" className="inline-flex items-center justify-center bg-white/[0.06] hover:bg-white/[0.1] text-white px-5 py-2.5 rounded-xl font-semibold transition-all border border-white/[0.06] text-sm">
            Create a post
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
