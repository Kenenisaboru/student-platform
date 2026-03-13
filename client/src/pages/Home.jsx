import { useState, useEffect } from 'react';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import { Loader2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

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
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-1 sm:px-0">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-indigo-700 rounded-[2rem] p-6 sm:p-8 mb-6 sm:mb-8 text-white shadow-xl shadow-primary-100 overflow-hidden relative">
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 text-white">Arsi Aseko Network</h1>
          <p className="text-primary-50 opacity-90 text-sm sm:text-base max-w-sm">
            Connect with your peers from Arsi Aseko university students across universities. Share ideas and grow together.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary-400/20 rounded-full -ml-8 -mb-8 blur-2xl"></div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 px-2 sm:px-0">
        <h2 className="text-lg sm:text-xl font-bold text-slate-800">Recent Discussions</h2>
        <Link
          to="/create-post"
          className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-2xl font-bold transition-all shadow-lg shadow-primary-200 flex items-center justify-center group w-full sm:w-auto"
        >
          <Plus className="w-5 h-5 mr-1.5 group-hover:rotate-90 transition-transform" />
          Start Discussion
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        </div>
      ) : posts.length > 0 ? (
        <div>
          {posts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={handleDelete}
              onUpdate={fetchPosts}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
          <p className="text-slate-500 mb-4">No posts yet. Be the first to share an idea!</p>
          <Link to="/create-post" className="text-primary-600 font-semibold hover:underline">
            Create a post
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;
