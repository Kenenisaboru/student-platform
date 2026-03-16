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
    }
  };

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  if (!post) return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center">
      <h2 className="text-2xl font-bold text-white mb-4">Post not found</h2>
      <button onClick={() => navigate('/')} className="btn-outline inline-flex items-center"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Feed</button>
    </div>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto py-4 sm:py-6 px-2 sm:px-0 pb-20">
      <Helmet>
        <title>{post ? `${post.title} | Arsi Network` : 'Loading...'}</title>
      </Helmet>
      <button onClick={() => navigate(-1)} className="mb-5 flex items-center text-slate-500 hover:text-blue-400 font-semibold transition-colors group text-sm">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <PostCard post={post} onDelete={() => navigate('/')} />

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 glass-card rounded-2xl p-5 sm:p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-9 h-9 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400"><MessageSquare className="w-4 h-4" /></div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">Discussion</h3>
          <span className="px-2.5 py-0.5 bg-white/[0.04] text-slate-400 rounded-lg text-xs font-bold border border-white/[0.04]">{post.commentsCount || 0}</span>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleComment} className="mb-8 group">
          <div className="flex space-x-3">
            <img src={user?.profilePicture} className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/[0.06] group-focus-within:ring-blue-500/20 transition-all shrink-0" alt="" />
            <div className="flex-1">
              <textarea className="w-full bg-white/[0.03] border border-white/[0.06] group-focus-within:border-blue-500/20 group-focus-within:bg-white/[0.05] rounded-xl py-3 px-4 focus:ring-2 focus:ring-blue-500/10 outline-none resize-none transition-all duration-300 placeholder:text-slate-600 font-medium text-sm text-slate-300" placeholder="Share your thoughts..." value={commentText} onChange={(e) => setCommentText(e.target.value)} rows="3"></textarea>
              <div className="flex justify-end mt-2">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" disabled={submitting || !commentText.trim()} className="bg-gradient-to-r from-blue-500 to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-xl flex items-center shadow-lg shadow-blue-500/15 transition-all text-sm">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-3.5 h-3.5 mr-2" /> Post</>}
                </motion.button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-3">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <motion.div key={comment._id} variants={itemVariants} className="flex space-x-3 group">
                <img src={comment.author.profilePicture} className="w-9 h-9 rounded-xl object-cover shrink-0" alt="" />
                <div className="flex-1">
                  <div className="bg-white/[0.03] rounded-xl p-4 hover:bg-white/[0.05] transition-all duration-300 border border-white/[0.04] hover:border-white/[0.06]">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="font-bold text-white text-sm">{comment.author.name}</p>
                      <p className="text-[11px] text-slate-600 font-medium">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</p>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">{comment.content}</p>
                  </div>
                  {(user?._id === comment.author._id || user?.role === 'admin') && (
                    <div className="flex items-center mt-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => deleteComment(comment._id)} className="text-[11px] text-red-400 hover:text-red-300 font-bold transition-colors uppercase tracking-wider">Delete</button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-10 bg-white/[0.02] rounded-xl border border-dashed border-white/[0.06]">
              <p className="text-slate-500 font-medium italic text-sm">No comments yet. Start the conversation!</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PostDetail;
