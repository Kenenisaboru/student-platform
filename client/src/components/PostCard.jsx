import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, MoreHorizontal, Share2, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const PostCard = ({ post, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLike = async () => {
    try {
      // Optimistic updatet
      setLiked(!liked);
      setLikesCount(liked ? likesCount - 1 : likesCount + 1);
      await API.post(`/posts/${post._id}/like`);
    } catch (err) {
      // Revert on error
      setLiked(!liked);
      setLikesCount(liked ? likesCount + 1 : likesCount - 1);
      console.error(err);
    }
  };

  const isAuthor = user?._id === post.author._id;
  const isAdmin = user?.role === 'admin';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl border border-slate-100 overflow-hidden mb-6 shadow-sm hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 relative group"
    >
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center space-x-3">
            <Link to={`/profile/${post.author._id}`} className="relative">
              <img 
                src={post.author.profilePicture} 
                alt={post.author.name} 
                className="w-11 h-11 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary-100 transition-all" 
              />
            </Link>
            <div>
              <Link to={`/profile/${post.author._id}`} className="font-bold text-slate-900 hover:text-primary-600 transition-colors text-[15px]">
                {post.author.name}
              </Link>
              <div className="flex items-center text-xs text-slate-500 font-medium">
                <span>{post.author.university}</span>
                <span className="mx-1.5 opacity-50">•</span>
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-slate-50 rounded-full text-slate-400 focus:outline-none transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </motion.button>
            
            <AnimatePresence>
              {menuOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl z-10 py-2 overflow-hidden"
                >
                  {(isAuthor || isAdmin) && (
                    <button 
                      onClick={() => onDelete(post._id)}
                      className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 flex items-center text-sm font-medium transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2.5" /> Delete Post
                    </button>
                  )}
                  <button className="w-full px-4 py-2.5 text-left text-slate-600 hover:bg-slate-50 flex items-center text-sm font-medium transition-colors">
                    <Share2 className="w-4 h-4 mr-2.5" /> Share Link
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content */}
        <div className="mb-5">
          <Link to={`/post/${post._id}`}>
            <h2 className="text-xl font-bold text-slate-800 mb-2 hover:text-primary-600 transition-colors">{post.title}</h2>
          </Link>
          <p className="text-slate-600 whitespace-pre-wrap leading-relaxed text-[15px]">{post.content}</p>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map((tag, i) => (
              <Link key={i} to={`/search?q=${tag}`} className="px-3 py-1.5 bg-slate-50 hover:bg-primary-50 text-slate-500 hover:text-primary-600 text-xs font-semibold rounded-lg transition-colors">
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <motion.button 
              whileTap={{ scale: 0.8 }}
              onClick={handleLike}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-colors ${liked ? 'text-pink-600 bg-pink-50/50' : 'text-slate-500 hover:bg-slate-50 hover:text-pink-600'}`}
            >
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
              <span className="font-semibold text-sm">{likesCount}</span>
            </motion.button>
            <Link 
              to={`/post/${post._id}`}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-primary-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold text-sm">{post.commentsCount || 0}</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
