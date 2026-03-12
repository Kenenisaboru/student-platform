import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, MoreHorizontal, Share2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { formatDistanceToNow } from 'date-fns';

const PostCard = ({ post, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLike = async () => {
    try {
      const { data } = await API.post(`/posts/${post._id}/like`);
      setLiked(data.likes.includes(user._id));
      setLikesCount(data.likes.length);
    } catch (err) {
      console.error(err);
    }
  };

  const isAuthor = user?._id === post.author._id;
  const isAdmin = user?.role === 'admin';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6 hover:shadow-md transition-shadow">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Link to={`/profile/${post.author._id}`}>
              <img 
                src={post.author.profilePicture} 
                alt={post.author.name} 
                className="w-10 h-10 rounded-full object-cover" 
              />
            </Link>
            <div>
              <Link to={`/profile/${post.author._id}`} className="font-bold text-slate-900 hover:text-primary-600">
                {post.author.name}
              </Link>
              <div className="flex items-center text-xs text-slate-500">
                <span>{post.author.university}</span>
                <span className="mx-1.5">•</span>
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-10 py-2">
                {(isAuthor || isAdmin) && (
                  <button 
                    onClick={() => onDelete(post._id)}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center text-sm"
                  >
                    <Trash2 className="w-4 h-4 mr-2" /> Delete Post
                  </button>
                )}
                <button className="w-full px-4 py-2 text-left text-slate-600 hover:bg-slate-50 flex items-center text-sm">
                  <Share2 className="w-4 h-4 mr-2" /> Share Link
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900 mb-2">{post.title}</h2>
          <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-primary-50 text-primary-600 text-xs font-semibold rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-6">
            <button 
              onClick={handleLike}
              className={`flex items-center space-x-1.5 transition-colors ${liked ? 'text-pink-600' : 'text-slate-500 hover:text-pink-600'}`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span className="font-medium">{likesCount}</span>
            </button>
            <Link 
              to={`/post/${post._id}`}
              className="flex items-center space-x-1.5 text-slate-500 hover:text-primary-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{post.commentsCount || 0}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
