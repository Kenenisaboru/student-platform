import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, MoreHorizontal, Share2, Trash2, Bookmark, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

const PostCard = ({ post, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.likes.includes(user?._id));
  const [likesCount, setLikesCount] = useState(post.likes.length);
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleLike = async () => {
    try {
      const newLikedStatus = !liked;
      setLiked(newLikedStatus);
      setLikesCount(newLikedStatus ? likesCount + 1 : likesCount - 1);
      
      if (newLikedStatus) {
        confetti({
          particleCount: 60,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#3b82f6', '#6366f1', '#ec4899']
        });
      }

      await API.post(`/posts/${post._id}/like`);
    } catch (err) {
      setLiked(!liked);
      setLikesCount(liked ? likesCount + 1 : likesCount - 1);
      console.error(err);
    }
  };

  const handleShare = () => {
    const url = `${window.location.origin}/post/${post._id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
    setMenuOpen(false);
  };

  const isAuthor = user?._id === post.author._id;
  const isAdmin = user?.role === 'admin';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      transition={{ duration: 0.2 }}
      className="glass-card-hover rounded-2xl overflow-hidden mb-0 relative group"
    >
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Link to={`/profile/${post.author._id}`} className="relative">
              <img 
                src={post.author.profilePicture} 
                alt={post.author.name} 
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/[0.06] group-hover:ring-blue-500/20 transition-all" 
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-[1.5px] border-[#0d1220]" />
            </Link>
            <div>
              <Link to={`/profile/${post.author._id}`} className="font-bold text-white hover:text-blue-400 transition-colors text-[14px]">
                {post.author.name}
              </Link>
              <div className="flex items-center text-[11px] text-slate-600 font-medium">
                <span>{post.author.university}</span>
                <span className="mx-1.5 opacity-30">•</span>
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 hover:bg-white/[0.04] rounded-xl text-slate-600 focus:outline-none transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </motion.button>
            
            <AnimatePresence>
              {menuOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-[#111827] border border-white/[0.08] rounded-xl shadow-2xl z-10 py-1.5 overflow-hidden"
                >
                  {(isAuthor || isAdmin) && (
                    <button 
                      onClick={() => { onDelete(post._id); setMenuOpen(false); }}
                      className="w-full px-4 py-2.5 text-left text-red-400 hover:bg-red-500/5 flex items-center text-sm font-medium transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2.5" /> Delete Post
                    </button>
                  )}
                  <button 
                    onClick={handleShare}
                    className="w-full px-4 py-2.5 text-left text-slate-400 hover:bg-white/[0.04] flex items-center text-sm font-medium transition-colors"
                  >
                    <Share2 className="w-4 h-4 mr-2.5" /> Copy Link
                  </button>
                  <button 
                    onClick={() => { setBookmarked(!bookmarked); setMenuOpen(false); toast.success(bookmarked ? 'Removed from saved' : 'Saved!'); }}
                    className="w-full px-4 py-2.5 text-left text-slate-400 hover:bg-white/[0.04] flex items-center text-sm font-medium transition-colors"
                  >
                    <Bookmark className={`w-4 h-4 mr-2.5 ${bookmarked ? 'fill-current text-blue-400' : ''}`} /> {bookmarked ? 'Unsave' : 'Save Post'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <Link to={`/post/${post._id}`}>
            <h2 className="text-[16px] font-bold text-white mb-1.5 hover:text-blue-400 transition-colors leading-snug">{post.title}</h2>
          </Link>
          <p className="text-slate-400 whitespace-pre-wrap leading-relaxed text-[14px] line-clamp-3 mb-3">{post.content}</p>
          
          {/* Post Images */}
          {post.images && post.images.length > 0 && (
            <div className={`grid gap-2 mb-3 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {post.images.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden border border-white/[0.06] max-h-80 group/image cursor-pointer">
                  <img src={img} alt="Post attachment" className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-105" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag, i) => (
              <Link key={i} to={`/search?q=${tag}`} className="px-2.5 py-1 bg-white/[0.04] hover:bg-blue-500/10 text-slate-500 hover:text-blue-400 text-[11px] font-semibold rounded-lg transition-colors border border-white/[0.04] hover:border-blue-500/10">
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Action Buttons — Facebook Style */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
          <div className="flex items-center space-x-1">
            <motion.button 
              whileTap={{ scale: 0.85 }}
              onClick={handleLike}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl transition-all text-sm font-semibold ${liked ? 'text-pink-400 bg-pink-500/10' : 'text-slate-500 hover:bg-white/[0.04] hover:text-pink-400'}`}
            >
              <Heart className={`w-[18px] h-[18px] ${liked ? 'fill-current' : ''}`} />
              <span>{likesCount}</span>
            </motion.button>

            <Link 
              to={`/post/${post._id}`}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-slate-500 hover:bg-white/[0.04] hover:text-blue-400 transition-all text-sm font-semibold"
            >
              <MessageCircle className="w-[18px] h-[18px]" />
              <span>{post.commentsCount || 0}</span>
            </Link>

            <button 
              onClick={handleShare}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-slate-500 hover:bg-white/[0.04] hover:text-emerald-400 transition-all text-sm font-semibold"
            >
              <Share2 className="w-[18px] h-[18px]" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => { setBookmarked(!bookmarked); toast.success(bookmarked ? 'Removed' : 'Saved!'); }}
            className={`p-2 rounded-xl transition-all ${bookmarked ? 'text-blue-400 bg-blue-500/10' : 'text-slate-600 hover:bg-white/[0.04] hover:text-blue-400'}`}
          >
            <Bookmark className={`w-[18px] h-[18px] ${bookmarked ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
