import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { Loader2, Send, Tag, X, ArrowLeft, PenTool, Sparkles, ImagePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().replace(/^#/, '');
      if (tag && !tags.includes(tag)) setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (i) => setTags(tags.filter((_, idx) => idx !== i));

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Max 5MB'); return; }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => { setImage(null); setImagePreview(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      tags.forEach(tag => formData.append('tags', tag));
      if (image) formData.append('image', image);

      await API.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Post published!');
      navigate('/');
    } catch (err) {
      toast.error('Failed to create post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto py-4 sm:py-8 px-2 sm:px-0">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-slate-500 hover:text-blue-400 font-semibold transition-colors group text-sm">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Feed
      </button>

      <div className="glass-card rounded-2xl p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/[0.03] rounded-full -mr-16 -mt-16 blur-3xl"></div>

        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 rotate-3">
              <PenTool className="w-6 h-6 -rotate-3" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">Create Post</h1>
              <p className="text-slate-500 font-medium text-sm">Share your knowledge with the community</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Post Title</label>
              <input type="text" required className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3.5 px-5 focus:bg-white/[0.05] focus:border-blue-500/20 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-bold text-white text-base placeholder:text-slate-600" placeholder="What's on your mind?" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="group">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Your Content</label>
              <textarea required rows="6" className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3.5 px-5 focus:bg-white/[0.05] focus:border-blue-500/20 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all resize-none text-slate-300 leading-relaxed placeholder:text-slate-600 font-medium text-sm" placeholder="Share your ideas, ask questions, or start a discussion..." value={content} onChange={(e) => setContent(e.target.value)}></textarea>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Attach Image (optional)</label>
              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border border-white/[0.06]">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                  <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-all">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-white/[0.06] hover:border-blue-500/20 rounded-xl cursor-pointer transition-all hover:bg-white/[0.02] group">
                  <ImagePlus className="w-8 h-8 text-slate-600 group-hover:text-blue-400 transition-colors mb-2" />
                  <span className="text-[12px] font-semibold text-slate-600 group-hover:text-slate-400 transition-colors">Click to upload an image</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                </label>
              )}
            </div>

            {/* Tags */}
            <div className="group">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Tags (press Enter)</label>
              <div className="relative">
                <input type="text" className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3.5 pl-12 pr-5 focus:bg-white/[0.05] focus:border-blue-500/20 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-slate-300 font-semibold placeholder:text-slate-600 text-sm" placeholder="e.g. academic, sports, news" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag} />
                <Tag className="absolute left-4 top-4 text-slate-600 w-5 h-5" />
              </div>
              <AnimatePresence>
                <motion.div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag, index) => (
                    <motion.span key={tag} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg text-[11px] font-bold border border-indigo-500/10">
                      <Sparkles className="w-3 h-3 mr-1.5" />#{tag}
                      <button type="button" onClick={() => removeTag(index)} className="ml-1.5 p-0.5 hover:bg-indigo-500/20 rounded-md"><X className="w-3 h-3" /></button>
                    </motion.span>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/[0.04]">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3.5 rounded-xl flex items-center font-bold shadow-xl shadow-blue-500/20 disabled:opacity-50 transition-all text-sm">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Publish Post</>}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default CreatePost;
