import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { Loader2, Send, Trash2, MessageSquare, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, commentsRes] = await Promise.all([
          API.get(`/posts/${id}`),
          API.get(`/comments/${id}`)
        ]);
        setPost(postRes.data);
        setComments(commentsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const { data } = await API.post(`/comments/${id}`, { content: commentText });
      setComments([data, ...comments]);
      setCommentText('');
      setPost({ ...post, commentsCount: (post.commentsCount || 0) + 1 });
      toast.success('Comment added!');
    } catch (err) {
      toast.error('Could not post comment');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
      setPost({ ...post, commentsCount: Math.max(0, post.commentsCount - 1) });
      toast.success('Comment deleted');
    } catch (err) {
      toast.error('Failed to delete comment');
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-24">
      <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
    </div>
  );

  if (!post) return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Post not found</h2>
        <button onClick={() => navigate('/')} className="btn-outline inline-flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Feed
        </button>
      </motion.div>
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto py-6 sm:py-8 px-4 sm:px-0 pb-20"
    >
      <Helmet>
        <title>{post ? `${post.title} | Arsi Network` : 'Loading... | Arsi Network'}</title>
      </Helmet>
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center text-slate-500 hover:text-primary-600 font-semibold transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> 
        Back
      </button>

      <PostCard post={post} onDelete={() => navigate('/')} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 bg-white/70 backdrop-blur-md rounded-[2.5rem] border border-slate-100 p-6 sm:p-10 shadow-xl shadow-slate-200/50"
      >
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Discussion</h3>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-bold">
            {post.commentsCount || 0}
          </span>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleComment} className="mb-10 group">
          <div className="flex space-x-4">
            <div className="flex-shrink-0">
              <img 
                src={user?.profilePicture} 
                className="w-12 h-12 rounded-2xl object-cover ring-4 ring-slate-100 group-focus-within:ring-primary-100 transition-all" 
                alt="" 
              />
            </div>
            <div className="flex-1">
              <textarea
                className="w-full bg-slate-50 border border-transparent group-focus-within:border-primary-100 group-focus-within:bg-white rounded-2xl py-4 px-5 focus:ring-4 focus:ring-primary-500/5 outline-none resize-none transition-all duration-300 placeholder:text-slate-400 font-medium"
                placeholder="Share your thoughts on this..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows="3"
              ></textarea>
              <div className="flex justify-end mt-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={submitting || !commentText.trim()}
                  className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 px-8 rounded-xl flex items-center shadow-lg shadow-primary-500/20 transition-all"
                >
                  {submitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <><Send className="w-4 h-4 mr-2" /> Post Comment</>
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-4 sm:space-y-6"
        >
          {comments.length > 0 ? (
            comments.map((comment) => (
              <motion.div 
                key={comment._id} 
                variants={itemVariants}
                className="flex space-x-3 sm:space-x-4 group"
              >
                <div className="flex-shrink-0">
                  <img src={comment.author.profilePicture} className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover" alt="" />
                </div>
                <div className="flex-1">
                  <div className="bg-slate-50/80 rounded-[1.5rem] p-4 sm:p-5 hover:bg-white hover:shadow-md transition-all duration-300 border border-transparent hover:border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-slate-900 text-sm sm:text-base">{comment.author.name}</p>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium bg-white px-2 py-1 rounded-full shadow-sm">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <p className="text-slate-700 text-sm sm:text-base leading-relaxed">{comment.content}</p>
                  </div>
                  {(user?._id === comment.author._id || user?.role === 'admin') && (
                    <div className="flex items-center mt-1 ml-4 space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => deleteComment(comment._id)}
                        className="text-[11px] text-red-500 hover:text-red-700 font-bold transition-colors uppercase tracking-wider"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400 font-medium italic">No comments yet. Start the conversation!</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PostDetail;
