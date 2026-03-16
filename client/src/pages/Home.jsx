import { useState, useEffect } from 'react';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import { Loader2, Plus, Sparkles, MessageCircle } from 'lucide-react';
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

  // Stagger animation for posts
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-0 pb-12">
      <Helmet>
        <title>Home | Arsi Aseko Student Network</title>
        <meta name="description" content="Connect with students across Arsi Aseko universities." />
      </Helmet>
      {/* Welcome Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="bg-gradient-to-br from-primary-600 via-indigo-600 to-purple-700 rounded-[2.5rem] p-8 sm:p-10 mb-8 sm:mb-10 text-white shadow-2xl shadow-indigo-500/20 overflow-hidden relative border border-white/10"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-lg">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-semibold mb-4 text-primary-50"
            >
              <Sparkles className="w-4 h-4 mr-2 text-primary-200" />
              Welcome to the Hub
            </motion.div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 text-white tracking-tight leading-tight">
              Arsi Aseko <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-200 to-purple-200">Network</span>
            </h1>
            <p className="text-primary-100/90 text-[15px] sm:text-base leading-relaxed">
              Connect with your peers from across Arsi Aseko universities. Share ideas, collaborate on projects, and grow together in one unified platform.
            </p>
          </div>
          
          <div className="hidden md:flex relative w-32 h-32 justify-center items-center">
             <div className="w-24 h-24 bg-white/10 rounded-3xl backdrop-blur-lg border border-white/20 shadow-xl flex items-center justify-center rotate-6">
               <h1 className="text-4xl font-black text-white -rotate-6">AAN</h1>
             </div>
          </div>
        </div>

        {/* Decorative Shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl mix-blend-overlay"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-400/20 rounded-full -ml-12 -mb-12 blur-2xl"></div>
        <div className="absolute top-1/2 left-2/3 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl mix-blend-screen"></div>
      </motion.div>

      {/* Daily Motivation & Tip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Quote of the Day</h4>
            <p className="text-slate-500 text-xs italic mt-1">"The best way to predict your future is to create it."</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-500 shrink-0">
            <Loader2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Study Tip</h4>
            <p className="text-slate-500 text-xs mt-1">Use the Focus Hub (bottom right) to manage your study sessions effectively!</p>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 px-2 sm:px-1">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Recent Discussions</h2>
        <Link
          to="/create-post"
          className="bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center group w-full sm:w-auto hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Start Discussion
        </Link>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
        </div>
      ) : posts.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
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
          className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-slate-300 shadow-sm"
        >
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">No Discussions Yet</h3>
          <p className="text-slate-500 mb-6">Be the first to share an idea and start the conversation!</p>
          <Link to="/create-post" className="inline-flex items-center justify-center bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors">
            Create a post
          </Link>
        </motion.div>
      )}
    </div>
  );
};

export default Home;
