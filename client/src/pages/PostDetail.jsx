import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { Loader2, Send, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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
      // Update post comment count locally
      setPost({ ...post, commentsCount: (post.commentsCount || 0) + 1 });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
      setPost({ ...post, commentsCount: post.commentsCount - 1 });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
    </div>
  );

  if (!post) return <div className="text-center py-20 text-slate-500">Post not found</div>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <PostCard post={post} onDelete={() => navigate('/')} />

      <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Discussion</h3>

        {/* Comment Form */}
        <form onSubmit={handleComment} className="mb-8">
          <div className="flex space-x-3">
            <img src={user?.profilePicture} className="w-10 h-10 rounded-full object-cover mt-1" alt="" />
            <div className="flex-1">
              <textarea
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows="2"
              ></textarea>
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={submitting || !commentText.trim()}
                  className="btn-primary flex items-center py-2 px-6"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Comment</>}
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="flex space-x-3 group">
                <img src={comment.author.profilePicture} className="w-10 h-10 rounded-full object-cover" alt="" />
                <div className="flex-1">
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-slate-900">{comment.author.name}</p>
                      <p className="text-xs text-slate-500">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    <p className="text-slate-700">{comment.content}</p>
                  </div>
                  {(user?._id === comment.author._id || user?.role === 'admin') && (
                    <button 
                      onClick={() => deleteComment(comment._id)}
                      className="text-xs text-red-500 font-medium ml-4 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 italic">No comments yet. Start the conversation!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
