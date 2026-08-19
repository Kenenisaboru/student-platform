import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, MoreHorizontal, Share2, Trash2, Bookmark, Flag, CheckCircle2, Loader2, Repeat2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';
import ProBadge from './ProBadge';

const PostCard = ({ post: initialPost, onDelete }) => {
  const { user } = useAuth();
  const [post, setPost] = useState(initialPost);
  const likes = Array.isArray(post?.likes) ? post.likes : [];
  const [liked, setLiked] = useState(likes.includes(user?._id));
  const [likesCount, setLikesCount] = useState(likes.length);
  const [menuOpen, setMenuOpen] = useState(false);
  const [voting, setVoting] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [repostDialogOpen, setRepostDialogOpen] = useState(false);
  const [repostQuote, setRepostQuote] = useState('');
  const [reposting, setReposting] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, message: '', onConfirm: null });

  if (!post) return null;

  const repostsCount = post.repostsCount || 0;

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
    if (navigator.share) {
      navigator.share({ title: post.title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        toast.success('Link copied to clipboard!');
      }).catch(() => {
        toast.error('Failed to copy link');
      });
    }
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

  const handleRepost = async () => {
    if (reposting) return;
    setReposting(true);
    try {
      const payload = repostQuote.trim() ? { quoteContent: repostQuote.trim() } : {};
      await API.post(`/posts/${post._id}/repost`, payload);
      setPost(prev => ({ ...prev, repostsCount: (prev.repostsCount || 0) + 1 }));
      setRepostDialogOpen(false);
      setRepostQuote('');
      toast.success('Reposted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to repost');
    } finally {
      setReposting(false);
    }
  };

  const isAuthor = user?._id === post.author?._id;
  const isAdmin = user?.role === 'admin';
  const hasVoted = post.poll?.options?.some(opt => opt.votes?.includes(user?._id));
  const totalVotes = post.poll?.options?.reduce((acc, opt) => acc + (opt.votes?.length || 0), 0) || 0;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card mb-4 relative overflow-hidden"
      >
        <div className="p-4 sm:p-5">
          {/* Repost indicator */}
          {post.isRepost && post.originalPost && (
            <div className="flex items-center gap-2 mb-3 text-xs text-slate-500">
              <Repeat2 className="w-3.5 h-3.5" />
              <span>Reposted by <Link to={`/profile/${post.author?._id}`} className="text-blue-400 hover:underline">{post.author?.name}</Link></span>
              <span className="text-slate-600">·</span>
              <Link to={`/post/${post.originalPost._id || post.originalPost}`} className="text-slate-500 hover:text-slate-400 hover:underline">View original</Link>
            </div>
          )}

          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Link to={`/profile/${post.author?._id || ''}`} className="pointer-events-auto">
                {post.author ? (
                  <img
                    src={post.author.profilePicture}
                    alt={post.author.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-white/[0.06]"
                  />
                ) : (
                  <div className="w-9 h-9 bg-slate-800 rounded-full ring-2 ring-white/[0.06] flex items-center justify-center text-slate-500 font-bold uppercase text-sm">
                    U
                  </div>
                )}
                {post.author?.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0d1220]" title="Online" />
                )}
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <Link to={`/profile/${post.author?._id || ''}`} className="font-semibold text-white hover:text-blue-400 transition-colors text-sm">
                    {post.author?.name || 'Unknown User'}
                  </Link>
                  {(post.author?.role === 'admin' || post.author?.isVerified) && <ProBadge className="scale-[0.55] origin-left" />}
                </div>
                <div className="flex items-center text-[11px] text-slate-500 font-medium">
                  <span>{post.author?.university || 'Unknown Institution'}</span>
                  <span className="mx-1.5 opacity-30">·</span>
                  <span>{post.createdAt ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }) : 'Just now'}</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Post options"
                className="p-2 hover:bg-white/[0.04] rounded-xl text-slate-500 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    className="absolute right-0 mt-2 w-48 bg-[#111827] border border-white/[0.08] rounded-xl shadow-2xl z-20 py-1.5 overflow-hidden"
                  >
                    {(isAuthor || isAdmin) && (
                      <button
                        onClick={() => {
                          setConfirmDialog({
                            open: true,
                            message: 'Are you sure you want to delete this post?',
                            onConfirm: () => {
                              onDelete(post._id);
                              setMenuOpen(false);
                            }
                          });
                        }}
                        className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/5 flex items-center text-sm"
                      >
                        <Trash2 className="w-4 h-4 mr-2" /> Delete Post
                      </button>
                    )}
                    <button onClick={handleShare} className="w-full px-4 py-2 text-left text-slate-400 hover:bg-white/[0.04] flex items-center text-sm">
                      <Share2 className="w-4 h-4 mr-2" /> Copy Link
                    </button>
                    <button onClick={() => { handleBookmark(); setMenuOpen(false); }} className="w-full px-4 py-2 text-left text-slate-400 hover:bg-white/[0.04] flex items-center text-sm">
                      <Bookmark className={`w-4 h-4 mr-2 ${bookmarked ? 'fill-current text-blue-400' : ''}`} /> {bookmarked ? 'Unsave' : 'Save Post'}
                    </button>
                    {!isAuthor && (
                      <div className="border-t border-white/[0.04] mt-1 pt-1">
                        <label className="px-4 py-1 text-[10px] uppercase font-bold text-slate-600">Report</label>
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

          {/* Content */}
          <div className="mb-3">
            <Link to={`/post/${post._id}`}>
              <h2 className="text-[15px] font-bold text-white mb-2 hover:text-blue-400 transition-colors leading-snug">{post.title || 'No Title'}</h2>
            </Link>

            <div
              className="post-html-content line-clamp-4 mb-3"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || '') }}
            />

            {/* Post Poll */}
            {post.poll && post.poll.question && (
              <div className="mb-3 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  {post.poll.question}
                </h3>
                <div className="space-y-2">
                  {post.poll.options?.map((option) => {
                    const percentage = totalVotes > 0 ? Math.round(((option.votes?.length || 0) / totalVotes) * 100) : 0;
                    const votedThis = option.votes?.includes(user?._id);

                    return (
                      <button
                        key={option._id}
                        onClick={() => handleVote(option._id)}
                        disabled={voting}
                        className={`relative w-full text-left p-3 rounded-xl border transition-all overflow-hidden ${votedThis ? 'border-blue-500/30 bg-blue-500/5' : 'border-white/[0.04] hover:border-white/[0.1] hover:bg-white/[0.02]'}`}
                      >
                        <div
                          className={`absolute left-0 top-0 bottom-0 transition-all duration-700 ${votedThis ? 'bg-blue-500/10' : 'bg-white/[0.03]'}`}
                          style={{ width: `${percentage}%` }}
                        />
                        <div className="relative z-10 flex justify-between items-center text-xs">
                          <span className={`font-semibold ${votedThis ? 'text-blue-400' : 'text-slate-400'}`}>
                            {option.text}
                            {votedThis && <CheckCircle2 className="inline w-3 h-3 ml-2 text-blue-400" />}
                          </span>
                          <span className={`font-bold ${votedThis ? 'text-blue-400' : 'text-slate-500'}`}>{percentage}%</span>
                        </div>
                      </button>
                    );
                  })}
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
            <div className="flex flex-wrap gap-1.5 mb-3">
              {post.tags.map((tag, i) => (
                <Link key={i} to={`/search?q=${tag}`} className="px-2.5 py-1 bg-white/[0.04] hover:bg-blue-500/10 text-slate-500 hover:text-blue-400 text-[11px] font-medium rounded-lg transition-colors border border-white/[0.04]">
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
            <div className="flex items-center gap-1">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleLike}
                aria-label={liked ? "Unlike post" : "Like post"}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${liked ? 'text-pink-400 bg-pink-500/10' : 'text-slate-500 hover:bg-white/[0.04] hover:text-pink-400'}`}
              >
                <Heart className={`w-[16px] h-[16px] ${liked ? 'fill-current' : ''}`} />
                <span>{likesCount}</span>
              </motion.button>

              <Link
                to={`/post/${post._id}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-white/[0.04] hover:text-blue-400 text-sm font-medium transition-colors"
              >
                <MessageCircle className="w-[16px] h-[16px]" />
                <span>{post.commentsCount || 0}</span>
              </Link>

              <button
                onClick={() => setRepostDialogOpen(true)}
                aria-label="Repost"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${repostsCount > 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 hover:bg-white/[0.04] hover:text-emerald-400'}`}
              >
                <Repeat2 className="w-[16px] h-[16px]" />
                {repostsCount > 0 && <span>{repostsCount}</span>}
              </button>

              <button
                onClick={handleShare}
                aria-label="Share post"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-500 hover:bg-white/[0.04] hover:text-blue-400 text-sm font-medium transition-colors"
              >
                <Share2 className="w-[16px] h-[16px]" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleBookmark}
              aria-label={bookmarked ? "Remove from bookmarks" : "Save to bookmarks"}
              className={`p-2 rounded-lg transition-colors ${bookmarked ? 'text-blue-400 bg-blue-500/10' : 'text-slate-600 hover:bg-white/[0.04]'}`}
            >
              <Bookmark className={`w-[16px] h-[16px] ${bookmarked ? 'fill-current' : ''}`} />
            </motion.button>
          </div>
        </div>

        {reporting && (
          <div className="absolute inset-0 bg-[#060a14]/60 backdrop-blur-[2px] z-50 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        )}
      </motion.div>

      {/* Repost Dialog */}
      <AnimatePresence>
        {repostDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setRepostDialogOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111827] border border-white/[0.08] rounded-2xl p-5 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white">Repost</h3>
                <button onClick={() => setRepostDialogOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-slate-400 mb-3">Share <span className="text-white font-medium">{post.title || 'this post'}</span> with your followers.</p>
              <textarea
                value={repostQuote}
                onChange={(e) => setRepostQuote(e.target.value)}
                placeholder="Add a comment (optional)"
                rows={3}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/30 resize-none mb-4"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setRepostDialogOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRepost}
                  disabled={reposting}
                  className="px-4 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {reposting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Repost
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirm Dialog */}
      <AnimatePresence>
        {confirmDialog.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111827] border border-white/[0.08] rounded-2xl p-5 w-full max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-base font-bold text-white mb-2">Confirm</h3>
              <p className="text-sm text-slate-400 mb-5">{confirmDialog.message}</p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
                  className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    confirmDialog.onConfirm?.();
                    setConfirmDialog({ open: false, message: '', onConfirm: null });
                  }}
                  className="px-4 py-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PostCard;
