import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { Loader2, Send, Tag, X, ArrowLeft, PenTool, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().replace(/^#/, '');
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;

    setLoading(true);
    try {
      await API.post('/posts', { title, content, tags });
      navigate('/');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-0"
    >
      <button 
        onClick={() => navigate(-1)} 
        className="mb-8 flex items-center text-slate-500 hover:text-primary-600 font-semibold transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> 
        Back to Feed
      </button>

      <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white p-8 sm:p-12 relative overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary-50 rounded-full -mr-20 -mt-20 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-50 rounded-full -ml-10 -mb-10 blur-3xl opacity-30"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-10">
            <div className="w-14 h-14 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20 rotate-3">
              <PenTool className="w-7 h-7 -rotate-3" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Post</h1>
              <p className="text-slate-500 font-medium">Share your knowledge with the community</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="group">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-primary-500 transition-colors">Post Title</label>
              <input
                type="text"
                required
                className="w-full bg-slate-50/50 border-2 border-slate-100/50 rounded-2xl py-4 px-6 focus:bg-white focus:border-primary-100 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all duration-300 font-bold text-slate-800 text-lg placeholder:text-slate-300"
                placeholder="What's on your mind?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-primary-500 transition-colors">Your Content</label>
              <textarea
                required
                rows="8"
                className="w-full bg-slate-50/50 border-2 border-slate-100/50 rounded-2xl py-4 px-6 focus:bg-white focus:border-primary-100 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all duration-300 resize-none text-slate-700 leading-relaxed placeholder:text-slate-300 font-medium"
                placeholder="Share your ideas, ask questions, or start a detailed discussion..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-primary-500 transition-colors">Tags (press Enter to add)</label>
              <div className="relative">
                <input
                  type="text"
                  className="w-full bg-slate-50/50 border-2 border-slate-100/50 rounded-2xl py-4 pl-14 pr-6 focus:bg-white focus:border-primary-100 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all duration-300 text-slate-700 font-semibold placeholder:text-slate-300"
                  placeholder="e.g. academic, sports, news"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                />
                <Tag className="absolute left-5 top-4.5 text-slate-300 group-focus-within:text-primary-400 w-6 h-6 transition-colors" />
              </div>
              
              <AnimatePresence>
                <motion.div className="flex flex-wrap gap-2 mt-4 ml-1">
                  {tags.map((tag, index) => (
                    <motion.span 
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold group/tag hover:bg-indigo-100 transition-colors cursor-default border border-indigo-100"
                    >
                      <Sparkles className="w-3 h-3 mr-2" />
                      #{tag}
                      <button type="button" onClick={() => removeTag(index)} className="ml-2 p-0.5 hover:bg-indigo-200 rounded-md transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-end pt-6 border-t border-slate-100">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white px-10 py-4 rounded-2xl flex items-center font-extrabold text-lg shadow-xl shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-3" /> Publish Post
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default CreatePost;
