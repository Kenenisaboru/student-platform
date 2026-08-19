import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { Loader2, Send, Trash2, MessageSquare, ArrowLeft, CornerDownRight, Reply, Heart, Pencil, X, AlertTriangle } from 'lucide-react';
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
  const [replyTo, setReplyTo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editText, setEditText] = useState('');
  const editRef = useRef(null);

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

  useEffect(() => {
    if (editingComment && editRef.current) {
      editRef.current.focus();
      editRef.current.setSelectionRange(editRef.current.value.length, editRef.current.value.length);
    }
  }, [editingComment]);

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
        setComments(prev => prev.map(c => {
          if (c._id === replyTo) {
            return { ...c, replies: [...(c.replies || []), data] };
          }
          return c;
        }));
        setReplyText('');
        setReplyTo(null);
      } else {
        setComments(prev => [data, ...prev]);
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

  const confirmDelete = (commentId, parentId = null) => {
    setDeleteTarget({ commentId, parentId });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const { commentId, parentId } = deleteTarget;
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
      
      fetchPost();
      toast.success('Comment deleted');
    } catch (err) {
      toast.error('Failed to delete comment');
    } finally {
      setDeleteTarget(null);
    }
  };

  const startEditing = (comment) => {
    setEditingComment(comment._id);
    setEditText(comment.content);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditText('');
  };

  const saveEdit = async (commentId, parentId = null) => {
    if (!editText.trim()) return;
    try {
      const { data } = await API.put(`/comments/${commentId}`, { content: editText });

      const updateInList = (list) => list.map(c => {
        if (c._id === commentId) return { ...c, content: data.content, updatedAt: data.updatedAt };
        if (c.replies) return { ...c, replies: updateInList(c.replies) };
        return c;
      });

      setComments(updateInList(comments));
      setEditingComment(null);
      setEditText('');
      toast.success('Comment updated');
    } catch (err) {
      toast.error('Failed to update comment');
    }
  };

  const handleEditKeyDown = (e, commentId, parentId) => {
    if (e.key === 'Escape') cancelEditing();
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) saveEdit(commentId, parentId);
  };

  const handleLikeComment = async (commentId) => {
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
      <p className="text-slate-400 text-sm mb-4">Post not found.</p>
      <button onClick={() => navigate('/')} className="text-blue-400 hover:text-blue-300 text-sm font-medium inline-flex items-center">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Feed
      </button>
    </div>
  );

  const isEdited = (comment) => {
    if (!comment.updatedAt || !comment.createdAt) return false;
    return new Date(comment.updatedAt).getTime() - new Date(comment.createdAt).getTime() > 1000;
  };

  const CommentItem = ({ comment, isReply = false, parentId = null }) => (
    <div className={`flex space-x-3 group ${isReply ? 'mt-3 pl-8 sm:pl-12 relative' : ''}`}>
      {isReply && <CornerDownRight className="absolute left-1 sm:left-4 top-1 w-4 h-4 text-slate-700" />}
      <img src={comment.author.profilePicture} className={`${isReply ? 'w-7 h-7' : 'w-9 h-9'} rounded-xl object-cover shrink-0`} alt="" />
      <div className="flex-1">
        <div className={`bg-white/3 rounded-2xl p-4 hover:bg-white/5 transition-all duration-300 border border-white/4 hover:border-white/6`}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-2">
               <span className="font-bold text-white text-[13px]">{comment.author.name}</span>
               {comment.author._id === post.author._id && <span className="text-[9px] bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">Author</span>}
            </div>
            <div className="flex items-center gap-2">
              {isEdited(comment) && <span className="text-[9px] text-slate-600 italic">(edited)</span>}
              <p className="text-[10px] text-slate-600 font-medium">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</p>
            </div>
          </div>
          
          {editingComment === comment._id ? (
            <div>
              <textarea
                ref={editRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => handleEditKeyDown(e, comment._id, parentId)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500/30 resize-none"
                rows={3}
              />
              <div className="flex items-center gap-2 mt-2 justify-end">
                <button onClick={cancelEditing} className="text-[11px] text-slate-500 hover:text-slate-300 font-medium px-3 py-1 rounded-lg transition-colors">
                  Cancel
                </button>
                <button
                  onClick={() => saveEdit(comment._id, parentId)}
                  disabled={!editText.trim()}
                  className="text-[11px] bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1 rounded-lg disabled:opacity-40 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-slate-400 text-sm leading-relaxed">{comment.content}</p>
          )}
        </div>
        
        {editingComment !== comment._id && (
          <div className="flex items-center mt-1.5 ml-2 space-x-4">
            <button 
              onClick={() => handleLikeComment(comment._id)}
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

            {user?._id === comment.author._id && (
              <button 
                onClick={() => startEditing(comment)}
                className="text-[10px] text-slate-600 hover:text-blue-400 font-bold transition-colors uppercase tracking-widest"
              >
                <Pencil className="w-3 h-3" />
              </button>
            )}

            {(user?._id === comment.author._id || user?.role === 'admin') && (
              <button 
                onClick={() => confirmDelete(comment._id, parentId)}
                className="text-[10px] text-slate-600 hover:text-red-400 font-bold transition-colors uppercase tracking-widest"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        <AnimatePresence>
          {replyTo === comment._id && (
            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="mt-3">
              <form onSubmit={handleComment} className="flex gap-2">
                <input 
                  autoFocus
                  className="flex-1 bg-white/5 border border-white/8 rounded-xl py-2 px-4 text-xs text-white placeholder:text-slate-600 outline-none focus:border-blue-500/30"
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

      {post.repostOf && (
        <div className="mb-3 text-[12px] text-slate-500">
          Reposted by{' '}
          <button onClick={() => navigate(`/profile/${post.author._id}`)} className="text-blue-400 hover:text-blue-300 font-semibold">
            {post.author.name}
          </button>
          {' · '}
          <button onClick={() => navigate(`/post/${post.repostOf}`)} className="text-slate-400 hover:text-white transition-colors underline underline-offset-2">
            view original
          </button>
        </div>
      )}

      <PostCard post={post} onDelete={() => navigate('/')} />

      <div className="mt-6 glass-card rounded-3xl p-6 sm:p-10">
        <div className="flex items-center space-x-2 mb-6">
          <MessageSquare className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-bold text-slate-400">{post.commentsCount || 0} {post.commentsCount === 1 ? 'Comment' : 'Comments'}</h3>
        </div>

        <form onSubmit={handleComment} className="mb-8">
          <div className="flex items-start gap-3">
            <img src={user?.profilePicture} className="w-9 h-9 rounded-xl object-cover shrink-0" alt="" />
            <div className="flex-1">
              <textarea 
                className="w-full bg-white/3 border border-white/6 rounded-xl py-2.5 px-3 text-sm text-white placeholder:text-slate-600 outline-none focus:border-blue-500/20 resize-none transition-colors" 
                placeholder="Write a comment..." 
                value={commentText} 
                onChange={(e) => setCommentText(e.target.value)} 
                rows="2"
              />
              <div className="flex justify-end mt-2">
                <button 
                  type="submit" 
                  disabled={submitting || !commentText.trim()} 
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 px-4 rounded-lg flex items-center transition-all text-xs disabled:opacity-40"
                >
                  {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Send className="w-3.5 h-3.5 mr-1.5" />}
                  Post
                </button>
              </div>
            </div>
          </div>
        </form>

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
                  className="w-full py-3 text-xs font-medium text-slate-500 hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
                >
                  {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load More'}
                </button>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="w-8 h-8 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No comments yet. Be the first to share your thoughts.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => setDeleteTarget(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1428] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Delete Comment</h3>
                  <p className="text-slate-500 text-xs">This action cannot be undone.</p>
                </div>
              </div>
              <p className="text-slate-400 text-xs mb-6">Are you sure you want to delete this comment? All replies will also be removed.</p>
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PostDetail;
