import { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Search, Download, Trash2, FileText, Filter, Sparkles, Upload, ArrowRight, Folder, Layers, Share2, MoreVertical, ShieldCheck, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const ResourceLibrary = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    fileUrl: '',
    category: 'Notes',
    department: user?.department || ''
  });

  useEffect(() => {
    fetchResources();
  }, [category, search]);

  const fetchResources = async () => {
    try {
      if (!search && !category) setLoading(true);
      const { data } = await API.get(`/resources?category=${category}&search=${search}`);
      setResources(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      await API.post('/resources', newResource);
      toast.success('Information node published to the vault');
      setShowUpload(false);
      fetchResources();
    } catch (err) {
      toast.error('Failed to authorize upload');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Initiate resource deletion sequence?')) {
      try {
        await API.delete(`/resources/${id}`);
        setResources(prev => prev.filter(r => r._id !== id));
        toast.success('Resource decommissioned');
      } catch (err) {
        toast.error('Deletion sequence failed');
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 lg:px-8 pb-32">
      
      {/* Narrative Resource Header */}
      <section className="relative rounded-[3.5rem] overflow-hidden mb-16 h-80 flex items-center shadow-2xl border border-white/5">
        <img 
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105"
          alt="Campus Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060a14] via-[#060a14]/80 to-transparent" />
        <div className="absolute top-0 right-0 w-[500px] h-full bg-blue-500/10 rounded-full blur-[120px] -mr-40 pointer-events-none"></div>
        
        <div className="relative z-10 px-10 md:px-20 max-w-4xl">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-3 bg-blue-600/10 backdrop-blur-xl border border-blue-500/20 px-4 py-2 rounded-2xl text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
            <Database className="w-3.5 h-3.5" /> Synchronized Library
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tighter leading-none">
            Resource <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Vault.</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium max-w-xl leading-relaxed opacity-80">
            Arsi Aseko University's official decentralized repository for academic assets, research verified materials, and collaborative notes.
          </p>
        </div>
      </section>

      {/* Modern Control Center (Search/Filter) */}
      <div className="flex flex-col xl:flex-row gap-6 mb-12 items-end xl:items-center">
         <div className="flex-1 w-full relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-[2rem] blur opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            <div className="relative bg-[#0d1428] rounded-[1.8rem] border border-white/[0.08] flex items-center px-6 py-1 shadow-2xl">
               <Search className="w-5 h-5 text-slate-600 mr-3" />
               <input 
                  type="text" 
                  placeholder="Query academic database..." 
                  className="w-full bg-transparent border-none py-5 text-white font-black text-sm tracking-tight outline-none placeholder:text-slate-700"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
            </div>
         </div>

         <div className="flex gap-4 w-full xl:w-auto">
            <div className="flex gap-1.5 p-1.5 bg-[#0d1428] rounded-2xl border border-white/[0.05] overflow-x-auto no-scrollbar max-w-[500px]">
               {['', 'PDF', 'Research', 'Book', 'Notes'].map(cat => (
                 <button 
                   key={cat}
                   onClick={() => setCategory(cat)}
                   className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${category === cat ? 'bg-white text-[#060a14] shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/[0.03]'}`}
                 >
                   {cat || 'All Assets'}
                 </button>
               ))}
            </div>

            <button 
               onClick={() => setShowUpload(true)}
               className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-blue-600/20 active:scale-95 whitespace-nowrap border border-white/10"
            >
               <Upload className="w-4 h-4" /> Deposit Material
            </button>
         </div>
      </div>

      {/* Vault Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-white/[0.02] rounded-[2.5rem] border border-white/[0.05] animate-pulse relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>
              </div>
            ))
          ) : resources.length > 0 ? (
            resources.map((res, i) => (
              <motion.div 
                key={res._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative p-8 rounded-[3rem] bg-[#0d1428] border border-white/[0.05] hover:border-blue-500/20 transition-all duration-500 shadow-xl overflow-hidden"
              >
                {/* Background Accent */}
                <div className="absolute -right-10 -top-10 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors" />

                <div className="relative z-10 flex flex-col h-full">
                   <div className="flex items-start justify-between mb-8">
                      <div className={`p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] shadow-inner transition-all group-hover:scale-110 group-hover:border-blue-500/30 ${res.category === 'PDF' ? 'text-rose-400' : 'text-blue-400'}`}>
                         <FileText className="w-7 h-7" />
                      </div>
                      {(res.author?._id === user?._id || user?.role === 'admin') && (
                        <button onClick={() => handleDelete(res._id)} className="p-2.5 bg-rose-500/5 hover:bg-rose-500 text-slate-700 hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-white/10">
                           <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                   </div>

                   <div className="mb-8">
                      <div className="flex items-center gap-2 mb-3">
                         <div className="px-2 py-0.5 rounded-md bg-blue-600/10 border border-blue-500/10 text-[9px] font-black text-blue-400 mt-0.5 uppercase tracking-widest">{res.category || 'Asset'}</div>
                         <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{res.department} Faculty</div>
                      </div>
                      <h3 className="text-xl font-black text-white mb-2 tracking-tight group-hover:text-blue-400 transition-colors line-clamp-1">{res.title}</h3>
                      <p className="text-slate-500 text-sm font-medium leading-[1.6] line-clamp-2">{res.description}</p>
                   </div>

                   <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/[0.04]">
                      <div className="flex items-center gap-3">
                         <div className="relative">
                            <img src={res.author?.profilePicture} className="w-8 h-8 rounded-xl object-cover ring-2 ring-white/5" alt="" />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#0d1428] shadow-sm"></div>
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[11px] font-black text-white/80 group-hover:text-white transition-colors tracking-tight">{res.author?.name}</span>
                            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest leading-none">Contributor</span>
                         </div>
                      </div>
                      <a 
                        href={res.fileUrl} 
                        target="_blank" 
                        className="w-10 h-10 flex items-center justify-center bg-white/[0.04] hover:bg-white text-slate-300 hover:text-[#060a14] rounded-xl transition-all shadow-xl hover:shadow-white/5 border border-white/[0.05]"
                      >
                         <Download className="w-4 h-4" />
                      </a>
                   </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 bg-white/[0.02] rounded-[3rem] border border-white/[0.05] border-dashed flex flex-col items-center justify-center text-center">
               <div className="w-20 h-20 bg-white/[0.03] rounded-[2rem] flex items-center justify-center mb-8">
                  <Database className="w-10 h-10 text-slate-800" />
               </div>
               <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">Vault Silent</h3>
               <p className="text-slate-500 font-medium max-w-xs mx-auto text-sm leading-relaxed">No high-level assets were found matching your current query parameters.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Pro Deposit Modal */}
      <AnimatePresence>
        {showUpload && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUpload(false)} className="absolute inset-0 bg-[#060a14]/90 backdrop-blur-xl" />
            <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }} 
               animate={{ scale: 1, opacity: 1, y: 0 }} 
               exit={{ scale: 0.95, opacity: 0, y: 20 }} 
               className="relative bg-[#0d1428] w-full max-w-2xl rounded-[3.5rem] p-10 md:p-14 border border-white/10 shadow-2xl overflow-hidden"
            >
              {/* Background glows for modal */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>

              <div className="relative z-10">
                 <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 bg-blue-600/10 rounded-[1.5rem] flex items-center justify-center border border-blue-600/20">
                       <Share2 className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                       <h2 className="text-3xl font-black text-white tracking-tighter mb-1">Asset Deposit</h2>
                       <p className="text-slate-500 text-xs font-bold uppercase tracking-widest tracking-[0.2em]">Synchronous Node Update</p>
                    </div>
                 </div>

                 <form onSubmit={handleUpload} className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest ml-1">Title Designation</label>
                        <input 
                           type="text" required
                           className="w-full bg-white/[0.04] border border-white/[0.1] rounded-2xl py-4 px-6 text-white font-black text-sm tracking-tight outline-none focus:border-blue-500 transition-all shadow-inner" 
                           onChange={e => setNewResource({...newResource, title: e.target.value})}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest ml-1">Resource Category</label>
                         <select 
                           className="w-full bg-white/[0.04] border border-white/[0.1] rounded-2xl py-4 px-6 text-white font-black text-sm tracking-tight outline-none focus:border-blue-500 transition-all shadow-inner appearance-none"
                           onChange={e => setNewResource({...newResource, category: e.target.value})}
                         >
                           <option value="Notes">Faculty Notes</option>
                           <option value="PDF">Academic PDF</option>
                           <option value="Research">Research Verified</option>
                           <option value="Guide">Study Protocol</option>
                         </select>
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest ml-1">Access URL / Signal</label>
                      <input 
                        type="url" required
                        placeholder="https://drive.google.com/secure-node/..."
                        className="w-full bg-white/[0.04] border border-white/[0.1] rounded-2xl py-4 px-6 text-white font-black text-sm tracking-tight outline-none focus:border-blue-500 transition-all shadow-inner" 
                        onChange={e => setNewResource({...newResource, fileUrl: e.target.value})}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest ml-1">Asset Synopsis</label>
                      <textarea 
                        rows="3" required
                        className="w-full bg-white/[0.04] border border-white/[0.1] rounded-[2rem] py-5 px-6 text-slate-300 font-bold text-sm leading-relaxed outline-none focus:border-blue-500 transition-all shadow-inner resize-none"
                        placeholder="Analyze the contents of this academic material..."
                        onChange={e => setNewResource({...newResource, description: e.target.value})}
                      />
                   </div>

                   <div className="flex items-center gap-4 pt-6">
                      <button type="button" onClick={() => setShowUpload(false)} className="px-8 py-4 text-slate-600 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all">Cancel Transfer</button>
                      <button type="submit" className="flex-1 bg-white text-[#060a14] py-4 rounded-[1.8rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 border border-white/10">
                        Commit Asset to Vault
                      </button>
                   </div>
                 </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResourceLibrary;
