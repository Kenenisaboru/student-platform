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
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">University Feed</h1>
        <Link 
          to="/create-post" 
          className="btn-primary flex items-center"
        >
          <Plus className="w-5 h-5 mr-1.5" /> Post
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
