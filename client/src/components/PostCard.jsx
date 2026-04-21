import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, MoreHorizontal, Share2, Trash2, Bookmark, Flag, CheckCircle2, Loader2, Languages } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';

const PostCard = ({ post: initialPost, onDelete }) => {
  const { user } = useAuth();
  const [post, setPost] = useState(initialPost);
  const likes = Array.isArray(post?.likes) ? post.likes : [];
  const [liked, setLiked] = useState(likes.includes(user?._id));
  const [likesCount, setLikesCount] = useState(likes.length);
  const [menuOpen, setMenuOpen] = useState(false);
  const [voting, setVoting] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translation, setTranslation] = useState(null); // { language: 'Amharic', content: '...' }

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

  const handleBookmark = async () => {
    try {
      const { data } = await API.post(`/users/save/${post._id}`);
      setBookmarked(data.isSaved);
      toast.success(data.isSaved ? 'Saved to bookmarks!' : 'Removed from bookmarks');
    } catch (err) {
      toast.error('Failed to update bookmark');
    }
  };

  const handleReport = async (reason) => {
    setReporting(true);
    try {
      await API.post('/reports', {
        targetType: 'post',
        targetId: post._id,
        reason
      });
      toast.success('Thank you for reporting. Our moderators will review this content.');
      setMenuOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setReporting(false);
    }
  };

  const handleVote = async (optionId) => {
    if (voting) return;
    setVoting(true);
    try {
      const { data } = await API.post(`/posts/${post._id}/vote`, { optionId });
      setPost(data);
      toast.success('Vote recorded!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to vote');
    } finally {
      setVoting(false);
    }
  };

  const handleTranslate = () => {
    if (translation) {
      setTranslation(null);
      return;
    }
    
    setIsTranslating(true);
    // Simulate AI Translation
    setTimeout(() => {
      const mockTranslations = {
        'Amharic': "ይህ በጎግል የተጎላበተ የሙከራ ትርጉም ነው።", // "This is a test translation powered by Google"
        'English': "This post has been successfully refined by the AI Bridge."
      };
      
      // If content is mostly English, translate to Amharic. Else to English.
      const isEnglish = /[a-zA-Z]/.test(post.content.slice(0, 50));
      const targetLang = isEnglish ? 'Amharic' : 'English';
      
      setTranslation({
        language: targetLang,
        content: targetLang === 'Amharic' 
            ? `<p class="text-blue-400/90 font-medium italic mb-2 text-[10px] uppercase tracking-widest">Translated to Amharic (AI Beta)</p> ሰላም! ይህ በራስ-ሰር የተተረጎመ መልእክት ነው። የተማሪዎች ግንኙነት መድረክን ስለተቀላቀሉ እናመሰግናለን።`
            : `<p class="text-emerald-400/90 font-medium italic mb-2 text-[10px] uppercase tracking-widest">Translated to English (AI Beta)</p> Hello! This is an automatically translated message. Thank you for joining the Student Communication Platform.`
      });
      setIsTranslating(false);
      toast.info(`Translated to ${targetLang}`);
    }, 1200);
  };

  const isAuthor = user?._id === post.author?._id;
  const isAdmin = user?.role === 'admin';
  const hasVoted = post.poll?.options?.some(opt => opt.votes.includes(user?._id));
  const totalVotes = post.poll?.options?.reduce((acc, opt) => acc + opt.votes.length, 0) || 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -1 }}
      className="glass-card-hover rounded-2xl overflow-hidden mb-0 relative group"
    >
      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Link to={`/profile/${post.author?._id || ''}`} className="relative pointer-events-auto">
              {post.author ? (
                <img 
                  src={post.author.profilePicture} 
                  alt={post.author.name} 
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/[0.06]" 
                />
              ) : (
                <div className="w-10 h-10 bg-slate-800 rounded-xl ring-2 ring-white/[0.06] flex items-center justify-center text-slate-500 font-bold uppercase">
                  U
                </div>
              )}
              {post.author?.isOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-[1.5px] border-[#0d1220]" title="Online" />
              )}
            </Link>
            <div>
              <Link to={`/profile/${post.author?._id || ''}`} className="font-bold text-white hover:text-blue-400 transition-colors text-[14px]">
                {post.author?.name || 'Unknown User'}
              </Link>
              <div className="flex items-center text-[11px] text-slate-600 font-medium">
                <span>{post.author?.university || 'Unknown Institution'}</span>
                <span className="mx-1.5 opacity-30">•</span>
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={handleTranslate}
              title="AI Translate"
              className={`p-2 rounded-xl transition-all ${translation ? 'text-blue-400 bg-blue-500/10' : 'text-slate-600 hover:bg-white/[0.04] hover:text-blue-400'}`}
            >
              <Languages className={`w-4 h-4 ${isTranslating ? 'animate-pulse' : ''}`} />
            </button>
            <div className="relative">
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 hover:bg-white/[0.04] rounded-xl text-slate-600 transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              
              <AnimatePresence>
                {menuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    className="absolute right-0 mt-2 w-48 bg-[#111827] border border-white/[0.08] rounded-xl shadow-2xl z-20 py-1.5 overflow-hidden"
                  >
                    {(isAuthor || isAdmin) && (
                      <button onClick={() => { onDelete(post._id); setMenuOpen(false); }} className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/5 flex items-center text-sm">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Post
                      </button>
                    )}
                    <button onClick={handleTranslate} className="w-full px-4 py-2 text-left text-blue-400 hover:bg-blue-500/5 flex items-center text-sm">
                      <Languages className="w-4 h-4 mr-2" /> {translation ? 'Show Original' : 'Translate AI'}
                    </button>
                    <button onClick={handleShare} className="w-full px-4 py-2 text-left text-slate-400 hover:bg-white/[0.04] flex items-center text-sm">
                      <Share2 className="w-4 h-4 mr-2" /> Copy Link
                    </button>
                    <button onClick={() => { handleBookmark(); setMenuOpen(false); }} className="w-full px-4 py-2 text-left text-slate-400 hover:bg-white/[0.04] flex items-center text-sm">
                      <Bookmark className={`w-4 h-4 mr-2 ${bookmarked ? 'fill-current text-blue-400' : ''}`} /> {bookmarked ? 'Unsave' : 'Save Post'}
                    </button>
                    {!isAuthor && (
                      <div className="border-t border-white/[0.04] mt-1 pt-1">
                        <label className="px-4 py-1 text-[10px] uppercase font-bold text-slate-600">Report content</label>
                        <button onClick={() => handleReport('spam')} className="w-full px-4 py-1.5 text-left text-slate-500 hover:bg-white/[0.04] flex items-center text-xs">
                          <Flag className="w-3 h-3 mr-2" /> Spam
                        </button>
                        <button onClick={() => handleReport('harassment')} className="w-full px-4 py-1.5 text-left text-slate-500 hover:bg-white/[0.04] flex items-center text-xs">
                          <Flag className="w-3 h-3 mr-2" /> Harassment
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-4">
          <Link to={`/post/${post._id}`}>
            <h2 className="text-[16px] font-bold text-white mb-2 hover:text-blue-400 transition-colors leading-snug">{post.title}</h2>
          </Link>
          
          <AnimatePresence mode="wait">
            {isTranslating ? (
              <motion.div key="translating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-4 space-y-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-5/6 h-4" />
              </motion.div>
            ) : translation ? (
              <motion.div 
                key="translation" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="post-translation-content bg-blue-500/[0.03] border-l-2 border-blue-500/30 p-4 rounded-r-xl mb-4 italic text-slate-300"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(translation.content) }}
              />
            ) : (
              <motion.div 
                key="original" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="post-html-content line-clamp-4 mb-4"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
              />
            )}
          </AnimatePresence>
          
          {/* Post Poll */}
          {post.poll && post.poll.question && (
            <div className="mb-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl">
              <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                {post.poll.question}
              </h3>
              <div className="space-y-2">
                {post.poll.options.map((option) => {
                  const percentage = totalVotes > 0 ? Math.round((option.votes.length / totalVotes) * 100) : 0;
                  const votedThis = option.votes.includes(user?._id);
                  
                  return (
                    <button 
                      key={option._id}
                      onClick={() => handleVote(option._id)}
                      disabled={voting}
                      className={`relative w-full text-left p-3 rounded-xl border transition-all overflow-hidden group/poll ${votedThis ? 'border-blue-500/30 bg-blue-500/5' : 'border-white/[0.06] hover:border-white/10'}`}
                    >
                      {/* Progress Bar */}
                      <div 
                        className={`absolute left-0 top-0 bottom-0 transition-all duration-1000 ${votedThis ? 'bg-blue-500/10' : 'bg-white/[0.03]'}`} 
                        style={{ width: `${percentage}%` }}
                      />
                      
                      <div className="relative z-10 flex justify-between items-center text-xs">
                        <span className={`font-bold ${votedThis ? 'text-blue-400' : 'text-slate-400'}`}>
                          {option.text}
                          {votedThis && <span className="ml-2 text-[10px] font-medium opacity-70">(your vote)</span>}
                        </span>
                        <span className="font-mono text-slate-500">{percentage}%</span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 flex justify-between items-center text-[10px] text-slate-600 font-bold uppercase tracking-wider">
                <span>{totalVotes} total votes</span>
                {post.poll.endsAt && (
                   <span>Ends {formatDistanceToNow(new Date(post.poll.endsAt), { addSuffix: true })}</span>
                )}
              </div>
            </div>
          )}
          
          {/* Post Images */}
          {post.images && post.images.length > 0 && (
            <div className={`grid gap-2 mb-3 ${post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {post.images.map((img, i) => (
                <div key={i} className="relative rounded-xl overflow-hidden border border-white/[0.06] max-h-80 cursor-pointer">
                  <img src={img} alt="Post attachment" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag, i) => (
              <Link key={i} to={`/search?q=${tag}`} className="px-2.5 py-1 bg-white/[0.04] hover:bg-blue-500/10 text-slate-500 hover:text-blue-400 text-[11px] font-semibold rounded-lg transition-colors border border-white/[0.04]">
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
          <div className="flex items-center space-x-1">
            <motion.button 
              whileTap={{ scale: 0.85 }} onClick={handleLike}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${liked ? 'text-pink-400 bg-pink-500/10' : 'text-slate-500 hover:bg-white/[0.04] hover:text-pink-400'}`}
            >
              <Heart className={`w-[18px] h-[18px] ${liked ? 'fill-current' : ''}`} />
              <span>{likesCount}</span>
            </motion.button>

            <Link 
              to={`/post/${post._id}`}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-slate-500 hover:bg-white/[0.04] hover:text-blue-400 text-sm font-semibold"
            >
              <MessageCircle className="w-[18px] h-[18px]" />
              <span>{post.commentsCount || 0}</span>
            </Link>

            <button onClick={handleShare} className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-slate-500 hover:bg-white/[0.04] hover:text-emerald-400 text-sm font-semibold">
              <Share2 className="w-[18px] h-[18px]" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.85 }} onClick={handleBookmark}
            className={`p-2 rounded-xl transition-all ${bookmarked ? 'text-blue-400 bg-blue-500/10' : 'text-slate-600 hover:bg-white/[0.04]'}`}
          >
            <Bookmark className={`w-[18px] h-[18px] ${bookmarked ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
      </div>
      
      {reporting && (
        <div className="absolute inset-0 bg-[#060a14]/60 backdrop-blur-[2px] z-50 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </div>
      )}
    </motion.div>
  );
};

export default PostCard;
