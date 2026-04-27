import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Plus, ThumbsUp, MessageCircle, Eye, Pin, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DiscussionForum = () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Career Advice');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThreadData, setNewThreadData] = useState({
    title: '',
    content: '',
    category: 'Career Advice',
    tags: '',
  });

  const categories = [
    'Career Advice',
    'Academic Support',
    'Personal Development',
    'University Life',
    'Projects & Ideas',
    'Announcements',
  ];

  const categoryColors = {
    'Career Advice': 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30',
    'Academic Support': 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
    'Personal Development': 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
    'University Life': 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
    'Projects & Ideas': 'from-pink-500/20 to-pink-600/10 border-pink-500/30',
    'Announcements': 'from-red-500/20 to-red-600/10 border-red-500/30',
  };

  useEffect(() => {
    fetchThreads();
  }, [selectedCategory]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/forum?category=${selectedCategory}`);
      setThreads(res.data);
    } catch (error) {
      toast.error('Failed to load discussions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateThread = async () => {
    if (!newThreadData.title.trim() || !newThreadData.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const tagsArray = newThreadData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

      await API.post('/forum', {
        title: newThreadData.title,
        content: newThreadData.content,
        category: newThreadData.category,
        tags: tagsArray,
      });

      toast.success('Discussion thread created!');
      setNewThreadData({ title: '', content: '', category: 'Career Advice', tags: '' });
      setShowNewThread(false);
      fetchThreads();
    } catch (error) {
      toast.error('Failed to create thread');
      console.error(error);
    }
  };

  const filteredThreads = threads.filter(thread =>
    thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    thread.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !showNewThread) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 pb-24">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 pb-24">
      <Helmet>
        <title>Discussion Forum | Arsi Aseko</title>
        <meta name="description" content="Join discussions with the Arsi Aseko community." />
      </Helmet>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex items-start justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
            <h1 className="text-4xl font-black text-white">Discussion Forum</h1>
          </div>
          <p className="text-slate-400 text-lg">
            Share knowledge, ask questions, and connect with the Arsi Aseko community.
          </p>
        </div>
        <Button
          onClick={() => setShowNewThread(!showNewThread)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Discussion
        </Button>
      </motion.div>

      {/* New Thread Form */}
      {showNewThread && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#0d1428]/80 to-[#060a14]/80 border border-white/[0.05] rounded-2xl p-6 mb-10 backdrop-blur-xl"
        >
          <h3 className="text-xl font-black text-white mb-4">Start a New Discussion</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Title</label>
              <Input
                placeholder="What would you like to discuss?"
                value={newThreadData.title}
                onChange={(e) => setNewThreadData({ ...newThreadData, title: e.target.value })}
                className="bg-white/[0.02] border-white/[0.05] text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Category</label>
              <select
                value={newThreadData.category}
                onChange={(e) => setNewThreadData({ ...newThreadData, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/[0.05] text-white rounded-lg font-medium"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Discussion</label>
              <textarea
                placeholder="Share your thoughts, ask your question, or start a conversation..."
                value={newThreadData.content}
                onChange={(e) => setNewThreadData({ ...newThreadData, content: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] text-white placeholder:text-slate-500 rounded-lg font-medium resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Tags (comma separated)</label>
              <Input
                placeholder="e.g., jobs, networking, tips"
                value={newThreadData.tags}
                onChange={(e) => setNewThreadData({ ...newThreadData, tags: e.target.value })}
                className="bg-white/[0.02] border-white/[0.05] text-white placeholder:text-slate-500"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleCreateThread}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
              >
                Create Discussion
              </Button>
              <Button
                onClick={() => setShowNewThread(false)}
                variant="outline"
                className="flex-1 bg-white/[0.05] border-white/10 hover:bg-white/[0.1] text-white font-bold rounded-lg"
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 bg-gradient-to-br from-[#0d1428]/80 to-[#060a14]/80 border border-white/[0.05] rounded-2xl px-6 py-4 backdrop-blur-xl">
          <Search className="w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-0 text-white placeholder:text-slate-500 focus:outline-none focus:ring-0"
          />
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-wrap gap-2 mb-10"
      >
        {categories.map(category => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setSearchQuery('');
            }}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
              selectedCategory === category
                ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                : 'bg-white/[0.02] border border-white/[0.05] text-slate-400 hover:border-white/10'
            }`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {/* Threads List */}
      <div className="space-y-4">
        {filteredThreads.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-[#0a0f1e]/50 rounded-2xl border border-white/[0.05]"
          >
            <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">No discussions in this category</p>
          </motion.div>
        ) : (
          filteredThreads.map((thread, idx) => (
            <motion.div
              key={thread._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`bg-gradient-to-br ${categoryColors[thread.category]} border rounded-2xl p-6 backdrop-blur-xl hover:border-white/[0.1] transition-all group cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {thread.isPinned && <Pin className="w-4 h-4 text-amber-400" />}
                    <Link to={`/forum/${thread._id}`} className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">
                      {thread.title}
                    </Link>
                    {thread.resolved && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>by {thread.author?.name || 'Unknown'}</span>
                    <span>•</span>
                    <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <p className="text-slate-400 text-sm mb-4 line-clamp-2">{thread.content}</p>

              {/* Tags */}
              {thread.tags && thread.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {thread.tags.map((tag, tidx) => (
                    <span key={tidx} className="px-2 py-1 text-xs font-bold bg-white/[0.05] border border-white/[0.05] text-slate-400 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{thread.replies?.length || 0} replies</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{thread.likes?.length || 0} likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{thread.views || 0} views</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default DiscussionForum;
