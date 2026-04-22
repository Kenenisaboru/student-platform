import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { Loader2, Send, Tag, X, ArrowLeft, PenTool, Sparkles, ImagePlus, ListChecks, Calendar, ShieldCheck, Zap, Layers, Globe, PlusSquare } from 'lucide-react';
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
    if (!file.type.startsWith('image/')) { toast.error('Please select a visual asset'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Asset exceeds capacity (max 5MB)'); return; }
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => { setImage(null); setImagePreview(null); };

  const handleAddPollOption = () => {
    if (pollOptions.length < 6) setPollOptions([...pollOptions, '']);
  };

  const handlePollOptionChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) setPollOptions(pollOptions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error('Identity required. Title and content must be populated.');
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
        const pollData = {
          question: pollQuestion,
          options: pollOptions.filter(opt => opt.trim()),
          endsAt: pollEndsAt || null
        };
        formData.append('poll', JSON.stringify(pollData));
      }

      await API.post('/posts', formData);
      toast.success('Transmission active. Post published to ecosystem.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transmission failed.');
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
    <div className="max-w-4xl mx-auto py-10 px-4 pb-24">
      {/* Narrative Back Command */}
      <button onClick={() => navigate(-1)} className="mb-10 flex items-center text-slate-600 hover:text-blue-500 font-black text-[10px] uppercase tracking-[0.3em] transition-all group group-hover:scale-105">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Intelligence Feed
      </button>

      <div className="bg-[#0a0f1e]/80 backdrop-blur-3xl rounded-[3rem] p-8 sm:p-14 border border-white/[0.08] shadow-2xl relative overflow-hidden">
        
        {/* Dynamic Glow Accents */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-12">
            <div className="relative shrink-0">
               <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 border border-white/10 group">
                  <Zap className="w-8 h-8 group-hover:scale-110 transition-transform" />
               </div>
               <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-black rounded-xl border border-white/10 flex items-center justify-center shadow-xl">
                  <Sparkles className="w-4 h-4 text-blue-400" />
               </div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-white tracking-tighter leading-none mb-2">Initialize Transmission.</h1>
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest leading-relaxed">Broadcast your academic findings to the university ecosystem.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Title Node */}
            <div className="space-y-3 group">
              <div className="flex items-center justify-between px-1">
                 <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em]">Transmission Header</label>
                 <div className="px-2 py-0.5 rounded bg-blue-600/10 text-[9px] font-black text-blue-400 border border-blue-500/10 uppercase tracking-widest">Required Node</div>
              </div>
              <div className="relative">
                 <input 
                    type="text" required 
                    className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] rounded-2xl py-5 px-6 focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all font-black text-white text-xl tracking-tight placeholder:text-slate-700 shadow-inner" 
                    placeholder="Enter discussion identifier..." 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                 />
              </div>
            </div>

            {/* Content Core */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Knowledge Core (Rich Text)</label>
              <div className="quill-pro-wrapper overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#0d1428]/50 shadow-inner">
                <ReactQuill 
                  ref={quillRef}
                  theme="snow" 
                  value={content} 
                  onChange={setContent}
                  modules={modules}
                  placeholder="Analyze data, ask questions, or broadcast collaborative findings..."
                />
              </div>
            </div>

            {/* Multimedia Integration */}
            <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/[0.05] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>
               
               <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                 <h4 className="text-white font-black text-sm uppercase tracking-widest mr-auto">Asset Integration</h4>
                 <div className="flex gap-2">
                    <button 
                        type="button" 
                        onClick={() => document.getElementById('image-upload').click()}
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${image ? 'bg-blue-600 text-white border-white/20' : 'bg-white/[0.03] border-white/10 text-slate-500 hover:text-white hover:bg-white/[0.05]'}`}
                    >
                        <ImagePlus className="w-4 h-4" />
                        {image ? 'Visual Node Sync' : 'Link Visual Asset'}
                        <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
                    </button>

                    <button 
                        type="button" 
                        onClick={() => setShowPoll(!showPoll)}
                        className={`flex items-center gap-3 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${showPoll ? 'bg-indigo-600 text-white border-white/20' : 'bg-white/[0.03] border-white/10 text-slate-500 hover:text-white hover:bg-white/[0.05]'}`}
                    >
                        <ListChecks className="w-4 h-4" />
                        {showPoll ? 'Terminal Poll Off' : 'Engage Poll Node'}
                    </button>
                 </div>
               </div>

               <AnimatePresence>
                  {imagePreview && (
                    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="relative rounded-[2rem] overflow-hidden border border-white/[0.1] mt-4 group/img shadow-2xl">
                        <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end p-6">
                           <button type="button" onClick={removeImage} className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                              <X className="w-4 h-4" /> Purge Asset
                           </button>
                        </div>
                    </motion.div>
                  )}

                  {showPoll && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="p-8 bg-indigo-600/5 rounded-[2rem] border border-indigo-500/20 space-y-6 mt-4 relative overflow-hidden group/poll">
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover/poll:scale-150 transition-transform duration-700"></div>
                        
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                               <Globe className="w-3.5 h-3.5" /> Opinion Parameter Question
                            </label>
                            <input type="text" className="w-full bg-black/40 border border-white/[0.08] rounded-2xl py-4 px-6 text-white font-bold text-sm focus:border-indigo-500/40 outline-none shadow-inner" placeholder="Enter query for community analysis..." value={pollQuestion} onChange={(e) => setPollQuestion(e.target.value)} />
                        </div>
                        
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Polling Node Options (Minimum: 2)</label>
                            {pollOptions.map((opt, idx) => (
                              <div key={idx} className="flex gap-3 items-center group/opt">
                                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-[10px] font-black text-indigo-400 border border-indigo-500/10">0{idx+1}</div>
                                <input type="text" className="flex-1 bg-black/20 border border-white/[0.08] group-hover/opt:border-indigo-500/20 rounded-xl py-3 px-6 text-white font-bold text-sm focus:border-indigo-500/40 outline-none transition-all shadow-inner" placeholder={`Coordinate ${idx + 1}`} value={opt} onChange={(e) => handlePollOptionChange(idx, e.target.value)} />
                                {pollOptions.length > 2 && (
                                  <button type="button" onClick={() => removePollOption(idx)} className="p-2.5 text-slate-700 hover:text-rose-500 transition-colors"><X className="w-4.5 h-4.5" /></button>
                                )}
                              </div>
                            ))}
                            {pollOptions.length < 6 && (
                              <button type="button" onClick={handleAddPollOption} className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest transition-all">
                                <PlusSquare className="w-4 h-4" /> Expand Polling Nodes
                              </button>
                            )}
                        </div>

                        <div className="pt-4 border-t border-indigo-500/10">
                            <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1 mb-3 block">Signal Expiration Timeframe</label>
                            <div className="relative max-w-sm">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-500" />
                                <input type="datetime-local" className="w-full pl-12 pr-6 py-3.5 bg-black/40 border border-white/[0.08] rounded-2xl text-white font-bold text-xs focus:border-indigo-500/40 outline-none shadow-inner" value={pollEndsAt} onChange={(e) => setPollEndsAt(e.target.value)} />
                            </div>
                        </div>
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>

            {/* Tag Hub */}
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1">Meta Categorization / Tags</label>
              <div className="relative group/tags">
                <input 
                    type="text" 
                    className="w-full bg-white/[0.03] hover:bg-white/[0.05] border border-white/[0.08] rounded-2xl py-4.5 pl-14 pr-6 focus:border-blue-500/40 outline-none transition-all text-white font-black text-sm tracking-tight placeholder:text-slate-700 shadow-inner" 
                    placeholder="Enter Meta Keys (press Enter)..." 
                    value={tagInput} 
                    onChange={(e) => setTagInput(e.target.value)} 
                    onKeyDown={handleAddTag} 
                />
                <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/tags:text-blue-500 w-5 h-5 transition-colors" />
              </div>
              <AnimatePresence>
                <div className="flex flex-wrap gap-3 mt-4">
                  {tags.map((tag, index) => (
                    <motion.div 
                        key={tag} 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        exit={{ opacity: 0, scale: 0.9 }} 
                        className="flex items-center gap-3 px-4 py-2 bg-blue-600/10 text-blue-400 rounded-xl text-[10px] font-black border border-blue-500/20 shadow-lg"
                    >
                      <Layers className="w-3.5 h-3.5" /> {tag.toUpperCase()}
                      <button type="button" onClick={() => removeTag(index)} className="hover:text-white transition-colors"><X className="w-3.5 h-3.5" /></button>
                    </motion.div>
                  ))}
                  {tags.length === 0 && <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest px-1 italic">No Meta categorization applied</p>}
                </div>
              </AnimatePresence>
            </div>

            {/* Authorization Terminal Footer */}
            <div className="pt-10 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <ShieldCheck className="w-4 h-4" />
                   </div>
                   <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Authorized Session Active</p>
                </div>
                
                <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }} 
                    type="submit" 
                    disabled={loading}
                    className="w-full sm:w-auto bg-white text-[#060a14] px-12 py-4.5 rounded-[1.8rem] flex items-center justify-center font-black shadow-2xl shadow-white/5 disabled:opacity-30 transition-all text-xs uppercase tracking-[0.2em] border border-white/20"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4 mr-3" /> Commit Transmission</>}
                </motion.button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
