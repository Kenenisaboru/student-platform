import { useState, useEffect, useRef } from 'react';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import { Plus, Calendar, Zap, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      } catch {
        toast.error('Failed to delete post');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-0 pb-24">
      <Helmet>
        <title>Dashboard | Arsi Aseko University</title>
        <meta name="description" content="Connect, share, and collaborate with the Arsi Aseko University academic community." />
      </Helmet>

      {/* Welcome Header */}
      <div className="p-6 mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">
          Welcome back, {user?.name?.split(' ')[0] || 'Scholar'}
        </h1>
        <p className="text-slate-400 text-sm mb-5">
          Share ideas, ask questions, and connect with your campus community.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm h-auto py-2.5 px-4">
            <Link to="/create-post">
              <Plus className="w-4 h-4 mr-2" /> New Post
            </Link>
          </Button>
          <Button asChild variant="outline" className="bg-white/5 border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/10 h-auto py-2.5 px-4">
            <Link to="/events">
              <Calendar className="w-4 h-4 mr-2 text-blue-400" /> Events
            </Link>
          </Button>
          <Button asChild variant="outline" className="bg-white/5 border-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/10 h-auto py-2.5 px-4">
            <Link to="/announcements">
              <Zap className="w-4 h-4 mr-2 text-amber-400" /> Announcements
            </Link>
          </Button>
        </div>
      </div>

      {/* Feed Header */}
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-base font-bold text-white">Feed</h2>
        <span className="text-xs text-slate-500 font-medium">{posts.length} posts</span>
      </div>

      {/* Posts Feed */}
      {loading ? (
        <div className="space-y-4 px-4">
          {[1, 2, 3].map(i => <PostSkeleton key={i} />)}
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="space-y-4 px-4">
            {posts.map(post => (
              <PostCard key={post._id} post={post} onDelete={handleDelete} onUpdate={() => fetchPosts(1)} />
            ))}
          </div>

          <div ref={loadMoreRef} className="py-12 flex justify-center">
            {loadingMore && (
              <div className="flex items-center gap-2 text-slate-500">
                <div className="w-4 h-4 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <span className="text-xs font-medium">Loading more posts...</span>
              </div>
            )}
            {!hasMore && posts.length > 5 && (
              <p className="text-xs text-slate-600">You're all caught up.</p>
            )}
          </div>
        </>
      ) : (
        <EmptyState
          icon={MessageCircle}
          title="No posts yet"
          description="Be the first to start a discussion and share something with the community."
          actionText="Create Post"
          actionLink="/create-post"
        />
      )}
    </div>
  );
};

export default Home;
