import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { Loader2, Send, Trash2, MessageSquare, ArrowLeft, CornerDownRight, Reply, Heart } from 'lucide-react';
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
  const [replyText, setReplyText] = useState('');
  const [replyTo, setReplyTo] = useState(null); // comment ID
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      const { data } = await API.get(`/posts/${id}`);
      setPost(data);
    } catch (err) {
      console.error(err);
      toast.error('Could not load post');
    }
  }, [id]);

  const fetchComments = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum > 1) setLoadingMore(true);
    try {
      const { data } = await API.get(`/comments/${id}?page=${pageNum}&limit=15`);
      setComments(prev => append ? [...prev, ...data.comments] : data.comments);
      setHasMore(data.hasMore);
      setPage(data.currentPage);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
    fetchComments(1);
  }, [fetchPost, fetchComments]);

  const handleComment = async (e) => {
    e.preventDefault();
    const text = replyTo ? replyText : commentText;
    if (!text.trim()) return;
    
    setSubmitting(true);
    try {
      const { data } = await API.post(`/comments/${id}`, { 
        content: text,
        parentComment: replyTo 
      });

      if (replyTo) {
        // Find parent and add to its replies locally
        setComments(prev => prev.map(c => {
          if (c._id === replyTo) {
            return { ...c, replies: [...(c.replies || []), data] };
          }
          return c;
        }));
        setReplyText('');
        setReplyTo(null);
      } else {
        setComments([data, ...comments]);
        setCommentText('');
      }

      setPost(prev => ({ ...prev, commentsCount: (prev.commentsCount || 0) + 1 }));
      toast.success(replyTo ? 'Reply posted!' : 'Comment added!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (commentId, parentId = null) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await API.delete(`/comments/${commentId}`);
      
      if (parentId) {
        setComments(prev => prev.map(c => {
          if (c._id === parentId) {
            return { ...c, replies: c.replies.filter(r => r._id !== commentId) };
          }
          return c;
        }));
      } else {
        setComments(prev => prev.filter(c => c._id !== commentId));
      }
      
      fetchPost(); // Refresh post to get updated comment count (cascading deletes)
      toast.success('Comment deleted');
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  const handleLikeComment = async (commentId, parentId = null) => {
    try {
      const { data } = await API.post(`/comments/${commentId}/like`);
      
      const updateList = (list) => list.map(c => {
        if (c._id === commentId) return { ...c, likes: data.likes };
        if (c.replies) return { ...c, replies: updateList(c.replies) };
        return c;
      });

      setComments(updateList(comments));
    } catch (err) {
      console.error(err);
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

  const CommentItem = ({ comment, isReply = false, parentId = null }) => (
    <div className={`flex space-x-3 group ${isReply ? 'mt-3 pl-8 sm:pl-12 relative' : ''}`}>
      {isReply && <CornerDownRight className="absolute left-1 sm:left-4 top-1 w-4 h-4 text-slate-700" />}
      <img src={comment.author.profilePicture} className={`${isReply ? 'w-7 h-7' : 'w-9 h-9'} rounded-xl object-cover shrink-0`} alt="" />
      <div className="flex-1">
        <div className={`bg-white/[0.03] rounded-2xl p-4 hover:bg-white/[0.05] transition-all duration-300 border border-white/[0.04] hover:border-white/[0.06]`}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-2">
               <span className="font-bold text-white text-[13px]">{comment.author.name}</span>
               {comment.author._id === post.author._id && <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">Author</span>}
            </div>
            <p className="text-[10px] text-slate-600 font-medium">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</p>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed">{comment.content}</p>
        </div>
        
        <div className="flex items-center mt-1.5 ml-2 space-x-4">
          <button 
            onClick={() => handleLikeComment(comment._id, parentId)}
            className={`flex items-center gap-1.5 text-[11px] font-bold tracking-tight transition-colors ${comment.likes?.includes(user?._id) ? 'text-pink-400' : 'text-slate-600 hover:text-slate-400'}`}
          >
            <Heart className={`w-3.5 h-3.5 ${comment.likes?.includes(user?._id) ? 'fill-current' : ''}`} />
            {comment.likes?.length || 0}
          </button>

          {!isReply && (
            <button 
              onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
              className={`flex items-center gap-1.5 text-[11px] font-bold tracking-tight transition-colors ${replyTo === comment._id ? 'text-blue-400' : 'text-slate-600 hover:text-blue-400'}`}
            >
              <Reply className="w-3.5 h-3.5" />
              Reply
            </button>
          )}

          {(user?._id === comment.author._id || user?.role === 'admin') && (
            <button 
              onClick={() => deleteComment(comment._id, parentId)}
              className="text-[11px] text-red-400/50 hover:text-red-400 font-bold transition-colors uppercase tracking-widest text-[10px]"
            >
              Delete
            </button>
          )}
        </div>

        {/* Inline Reply Form */}
        <AnimatePresence>
          {replyTo === comment._id && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="mt-3">
              <form onSubmit={handleComment} className="flex gap-2">
                <input 
                  autoFocus
                  className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl py-2 px-4 text-xs text-white placeholder:text-slate-600 outline-none focus:border-blue-500/30"
                  placeholder={`Reply to ${comment.author.name.split(' ')[0]}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button 
                  disabled={submitting || !replyText.trim()}
                  className="bg-blue-600 text-white p-2 rounded-xl disabled:opacity-50"
                >
                   {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-1">
            {comment.replies.map(reply => (
              <CommentItem key={reply._id} comment={reply} isReply={true} parentId={comment._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto py-4 sm:py-6 px-2 sm:px-0 pb-20">
      <Helmet>
        <title>{post ? `${post.title} | Communication Platform` : 'Loading...'}</title>
      </Helmet>
      
      <button onClick={() => navigate(-1)} className="mb-5 flex items-center text-slate-500 hover:text-blue-400 font-semibold transition-colors group text-sm">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <PostCard post={post} onDelete={() => navigate('/')} />

      <div className="mt-6 glass-card rounded-3xl p-6 sm:p-10">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 shadow-inner">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Community Discussion</h3>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">{post.commentsCount || 0} Comments</p>
          </div>
        </div>

        {/* Main Comment Form */}
        <form onSubmit={handleComment} className="mb-10 p-1 bg-white/[0.02] rounded-2xl border border-white/[0.04] focus-within:border-blue-500/20 transition-all">
          <div className="flex items-end p-2 gap-3">
            <img src={user?.profilePicture} className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/[0.06] mb-1" alt="" />
            <div className="flex-1">
              <textarea 
                className="w-full bg-transparent border-none py-2 px-1 focus:ring-0 outline-none resize-none text-slate-300 placeholder:text-slate-600 font-medium text-sm" 
                placeholder="Join the discussion..." 
                value={commentText} 
                onChange={(e) => setCommentText(e.target.value)} 
                rows="2"
              ></textarea>
              <div className="flex justify-end pt-1">
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} 
                  type="submit" 
                  disabled={submitting || !commentText.trim()} 
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-5 rounded-xl flex items-center transition-all text-xs disabled:opacity-40"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <><Send className="w-3.5 h-3.5 mr-2" /> Post</>}
                </motion.button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length > 0 ? (
            <>
              {comments.map((comment) => (
                <CommentItem key={comment._id} comment={comment} />
              ))}
              
              {hasMore && (
                <button 
                  onClick={() => fetchComments(page + 1, true)} 
                  disabled={loadingMore}
                  className="w-full py-4 text-xs font-bold text-slate-500 hover:text-blue-400 transition-colors uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load More Comments'}
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white/[0.01] rounded-3xl border border-dashed border-white/[0.06]">
              <div className="w-16 h-16 bg-white/[0.02] rounded-full flex items-center justify-center mx-auto mb-4 border border-white/[0.04]">
                 <MessageSquare className="w-6 h-6 text-slate-700" />
              </div>
              <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Be the first to share a thought</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PostDetail;
