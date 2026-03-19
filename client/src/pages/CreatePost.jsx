import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { Loader2, Send, Tag, X, ArrowLeft, PenTool, Sparkles, ImagePlus, ListChecks, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Poll State
  const [showPoll, setShowPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollEndsAt, setPollEndsAt] = useState('');

  const navigate = useNavigate();
  const quillRef = useRef(null);

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

  const handleAddPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handlePollOptionChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      tags.forEach(tag => formData.append('tags', tag));
      if (image) formData.append('image', image);

      if (showPoll && pollQuestion && pollOptions.filter(opt => opt.trim()).length >= 2) {
        formData.append('poll[question]', pollQuestion);
        pollOptions.filter(opt => opt.trim()).forEach((opt, idx) => {
          formData.append(`poll[options][${idx}][text]`, opt);
        });
        if (pollEndsAt) formData.append('poll[endsAt]', pollEndsAt);
      }

      await API.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Post published!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'blockquote', 'code-block'],
      ['clean']
    ],
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
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Your Content (Rich Text)</label>
              <div className="quill-dark-wrapper overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
                <ReactQuill 
                  ref={quillRef}
                  theme="snow" 
                  value={content} 
                  onChange={setContent}
                  modules={modules}
                  placeholder="Share your ideas, ask questions, or start a discussion..."
                />
              </div>
            </div>

            {/* Multimedia Controls */}
            <div className="flex flex-wrap gap-3 py-2">
              <button 
                type="button" 
                onClick={() => document.getElementById('image-upload').click()}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${image ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.06]'}`}
              >
                <ImagePlus className="w-4 h-4" />
                {image ? 'Image Attached' : 'Add Image'}
                <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
              </button>

              <button 
                type="button" 
                onClick={() => setShowPoll(!showPoll)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${showPoll ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-white/[0.03] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.06]'}`}
              >
                <ListChecks className="w-4 h-4" />
                {showPoll ? 'Remove Poll' : 'Add Poll'}
              </button>
            </div>

            {/* Image Preview */}
            <AnimatePresence>
              {imagePreview && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="relative rounded-xl overflow-hidden border border-white/[0.08]">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                  <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-lg text-white transition-all shadow-lg">
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Poll Creation */}
            <AnimatePresence>
              {showPoll && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="p-6 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">Poll Question</label>
                    <input type="text" className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 px-4 text-white placeholder:text-slate-600 text-sm focus:border-indigo-500/30 outline-none" placeholder="Ask something..." value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Poll Options (2-6)</label>
                    {pollOptions.map((opt, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input type="text" className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded-xl py-2.5 px-4 text-white placeholder:text-slate-600 text-sm focus:border-indigo-500/30 outline-none" placeholder={`Option ${idx + 1}`} value={opt} onChange={(e) => handlePollOptionChange(idx, e.target.value)} />
                        {pollOptions.length > 2 && (
                          <button type="button" onClick={() => removePollOption(idx)} className="p-2 text-slate-600 hover:text-red-400 transition-colors"><X className="w-4 h-4" /></button>
                        )}
                      </div>
                    ))}
                    {pollOptions.length < 6 && (
                      <button type="button" onClick={handleAddPollOption} className="text-xs font-bold text-indigo-400 hover:text-indigo-300 ml-1 py-1">
                        + Add Option
                      </button>
                    )}
                  </div>

                  <div className="pt-2">
                    <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">End Date (optional)</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                      <input type="datetime-local" className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm focus:border-indigo-500/30 outline-none" value={pollEndsAt} onChange={(e) => setPollEndsAt(e.target.value)} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tags */}
            <div className="group">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Tags (press Enter)</label>
              <div className="relative">
                <input type="text" className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3.5 pl-12 pr-5 focus:bg-white/[0.05] focus:border-blue-500/20 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-slate-300 font-semibold placeholder:text-slate-600 text-sm" placeholder="e.g. academic, sports, news" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag} />
                <Tag className="absolute left-4 top-4 text-slate-600 w-5 h-5" />
              </div>
              <AnimatePresence>
                <div className="flex flex-wrap gap-2 mt-3">
                  {tags.map((tag, index) => (
                    <motion.span key={tag} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center px-3 py-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg text-[11px] font-bold border border-indigo-500/10">
                      <Sparkles className="w-3 h-3 mr-1.5" />#{tag}
                      <button type="button" onClick={() => removeTag(index)} className="ml-1.5 p-0.5 hover:bg-indigo-500/20 rounded-md"><X className="w-3 h-3" /></button>
                    </motion.span>
                  ))}
                </div>
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
