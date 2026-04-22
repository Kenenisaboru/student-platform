import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import { Loader2, Calendar, MapPin, Book, Edit3, User, Mail, AtSign, Camera, UserPlus, UserMinus, MessageSquare, Bookmark, Sparkles, Award, ShieldCheck, Zap, Users, PlusSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { ProfileSkeleton } from '../components/Skeleton';
import EmptyState from '../components/EmptyState';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, updateProfile } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts'); 
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [uploading, setUploading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data: userData } = await API.get(`/users/${id}`);
        setUser(userData);
        setEditData(userData);
        setIsFollowing(userData.followers?.some(f => f._id === currentUser?._id));
        const { data: postsData } = await API.get('/posts');
        const allPosts = postsData.posts || postsData;
        setPosts(allPosts.filter(p => p.author._id === id));
        
        if (currentUser?._id === id) {
          const { data: savedData } = await API.get('/users/saved');
          setSavedPosts(savedData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, currentUser]);

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      const { data } = await API.post(`/users/${id}/follow`);
      setIsFollowing(data.isFollowing);
      setUser(prev => ({
        ...prev,
        followers: data.isFollowing
          ? [...(prev.followers || []), { _id: currentUser._id, name: currentUser.name }]
          : (prev.followers || []).filter(f => f._id !== currentUser._id)
      }));
      toast.success(data.isFollowing ? `Following ${user.name}!` : `Unfollowed ${user.name}`);
    } catch (err) {
      toast.error('Failed to update follow status');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = { name: editData.name, bio: editData.bio, university: editData.university, department: editData.department, profilePicture: editData.profilePicture };
      await updateProfile(updateData);
      setUser({ ...user, ...updateData });
      setEditing(false);
      toast.success('Identity node updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update identity');
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image node exceeds capacity (max 5MB)'); return; }
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    const toastId = toast.loading('Syncing visual data...');
    try {
      const { data } = await API.post('/users/upload-profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setEditData({ ...editData, profilePicture: data.url });
      toast.success('Visual ID updated!', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sync failed.', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <ProfileSkeleton />
    </div>
  );

  if (!user) return (
    <div className="max-w-2xl mx-auto py-24 px-4 text-center">
      <div className="w-20 h-20 bg-white/[0.03] rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-white/[0.05]">
          <ShieldCheck className="w-10 h-10 text-slate-700" />
      </div>
      <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">Identity Not Found</h2>
      <button onClick={() => window.history.back()} className="px-8 py-3 bg-white/[0.05] border border-white/10 text-white rounded-xl font-bold transition-all">Previous Terminal</button>
    </div>
  );

  const isOwnProfile = currentUser?._id === user._id;
  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto py-6 px-4 pb-24">
      
      {/* Pro Profile Header */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-[#0a0f1e]/80 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden border border-white/[0.08] shadow-2xl relative mb-10">
        
        {/* Dynamic Header Banner */}
        <div className="h-44 sm:h-64 bg-gradient-to-br from-blue-600 via-indigo-900 to-black relative overflow-hidden">
           <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]"></div>
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[120px] -mr-40 -mt-40"></div>
           <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
           
           <div className="absolute bottom-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Active Node</span>
           </div>
        </div>

        <div className="px-8 pb-10 relative">
          <div className="flex flex-col md:flex-row md:items-end -mt-16 sm:-mt-24 mb-10 gap-8">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ delay: 0.2, type: 'spring' }} 
              className="relative shrink-0"
            >
              <div className="relative p-1.5 rounded-[2.5rem] bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-3xl shadow-2xl">
                <div className="relative overflow-hidden rounded-[2rem] border-4 border-[#060a14]">
                    <img src={editing ? editData.profilePicture : user.profilePicture} className={`w-32 h-32 sm:w-44 sm:h-44 object-cover transition-all duration-500 ${uploading ? 'opacity-50 blur-sm scale-110' : 'group-hover:scale-105'}`} alt={user.name} />
                    {editing && (
                    <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white cursor-pointer opacity-0 hover:opacity-100 transition-opacity">
                        {uploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Camera className="w-8 h-8 mb-2" /><span className="text-[10px] font-black uppercase tracking-widest">Visual Update</span></>}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={uploading} />
                    </label>
                    )}
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center border-4 border-[#060a14] shadow-xl text-white">
                 <ShieldCheck className="w-5 h-5" />
              </div>
            </motion.div>
            
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                 <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tighter leading-none">{user.name}</h1>
                 <div className="px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-1.5 backdrop-blur-md">
                    <Award className="w-3 h-3" /> Scholar Member
                 </div>
              </div>
              <div className="flex items-center text-slate-500 font-black mb-6 space-x-2 text-xs uppercase tracking-widest">
                <AtSign className="w-3.5 h-3.5 text-blue-500" />
                <span>{user.email?.split('@')[0]}</span>
                <span className="opacity-30">•</span>
                <span className="text-slate-600 italic">Faculty of {user.department}</span>
              </div>

              {/* Engagement Bento Stats */}
              <div className="flex items-center gap-6">
                {[
                  { label: 'Followers', val: user.followers?.length || 0, icon: Users, color: 'text-blue-400' },
                  { label: 'Network', val: user.following?.length || 0, icon: UserPlus, color: 'text-indigo-400' },
                  { label: 'Content', val: posts.length, icon: MessageSquare, color: 'text-purple-400' },
                ].map(stat => (
                  <div key={stat.label} className="flex flex-col">
                    <div className="flex items-center gap-2 text-white">
                       <span className="text-xl font-black tracking-tight tabular-nums">{stat.val}</span>
                       <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
                    </div>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-0.5">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Terminal */}
            <div className="flex flex-col gap-3 min-w-[200px]">
              {isOwnProfile ? (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setEditing(!editing)}
                  className={`w-full py-3.5 rounded-2xl flex items-center justify-center font-black transition-all border text-xs uppercase tracking-widest shadow-xl ${editing ? 'bg-rose-500/10 text-rose-500 border-rose-500/30' : 'bg-white text-[#060a14] border-white/10 hover:bg-blue-50 shadow-white/5'}`}>
                  {editing ? <><Zap className="w-4 h-4 mr-2" /> Cancel Node Edit</> : <><Edit3 className="w-4 h-4 mr-2" /> Modify Identity</>}
                </motion.button>
              ) : (
                <div className="flex gap-2">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleFollow} disabled={followLoading}
                    className={`flex-1 py-3.5 rounded-2xl flex items-center justify-center font-black transition-all text-xs uppercase tracking-widest border ${
                      isFollowing
                        ? 'bg-white/[0.04] text-white border-white/10 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-white/10 shadow-lg shadow-blue-600/20'
                    }`}>
                    {followLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isFollowing ? <><UserMinus className="w-4 h-4 mr-2" /> Disconnect</> : <><UserPlus className="w-4 h-4 mr-2" /> Connect</>}
                  </motion.button>
                  <Link to={`/messages/${id}`}
                    className="aspect-square bg-white/[0.04] hover:bg-white/[0.08] text-white p-3.5 rounded-2xl transition-all border border-white/10 flex items-center justify-center backdrop-blur-xl">
                    <MessageSquare className="w-5 h-5" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!editing ? (
              <motion.div key="view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="relative">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest mb-4">
                     <AtSign className="w-3 h-3" /> Core Biography
                  </div>
                  <p className="text-slate-400 text-[15px] leading-[1.8] font-medium bg-white/[0.02] p-8 rounded-[2rem] border border-white/[0.06] italic relative overflow-hidden group shadow-inner">
                    <span className="relative z-10">{user.bio || "This scholar is maintaining high-level structural silence. No biography available in the current sector."}</span>
                    <Sparkles className="absolute top-4 right-4 w-12 h-12 text-blue-500/5 group-hover:scale-110 transition-transform duration-700" />
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    { label: 'Primary Campus', val: user.university, icon: MapPin, color: 'text-blue-400', bg: 'from-blue-600/10 to-transparent' },
                    { label: 'Focus Department', val: user.department, icon: Book, color: 'text-indigo-400', bg: 'from-indigo-600/10 to-transparent' },
                    { label: 'Deployment Date', val: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), icon: Calendar, color: 'text-purple-400', bg: 'from-purple-600/10 to-transparent' }
                  ].map((card) => (
                    <div key={card.label} className={`flex flex-col p-6 rounded-[2rem] bg-gradient-to-br ${card.bg} border border-white/[0.06] hover:border-white/10 transition-all group`}>
                      <div className={`w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center ${card.color} mb-4 group-hover:scale-110 transition-all border border-white/[0.05]`}>
                         <card.icon className="w-5 h-5" />
                      </div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{card.label}</p>
                      <p className="text-white font-black text-sm tracking-tight">{card.val}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.form key="edit" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} onSubmit={handleUpdate} className="space-y-8 bg-white/[0.03] p-8 sm:p-10 rounded-[2.5rem] border border-white/[0.08] backdrop-blur-xl shadow-inner relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Identity Designation</label>
                    <div className="relative group/input">
                       <input type="text" className="w-full bg-white/[0.04] border border-white/[0.1] rounded-2xl py-4 pl-12 pr-4 focus:border-blue-500/50 outline-none transition-all font-black text-white text-sm tracking-tight shadow-inner" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />
                       <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-blue-500 w-5 h-5 transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Visual Authentication</label>
                    <label className={`flex items-center justify-between px-6 py-4 bg-white/[0.04] border border-white/[0.1] rounded-2xl cursor-pointer hover:border-blue-500/40 hover:bg-white/[0.08] transition-all font-black text-slate-400 text-sm tracking-tight ${uploading ? 'opacity-30' : ''}`}>
                      <div className="flex items-center gap-3">
                         <Camera className="w-5 h-5 text-blue-500" />
                         <span>Upload Visual ID</span>
                      </div>
                      <PlusSquare className="w-4 h-4 opacity-30" />
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                   <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Behavioral Signature / Bio</label>
                   <textarea rows="4" className="w-full bg-white/[0.04] border border-white/[0.1] rounded-[1.8rem] py-5 px-6 focus:border-blue-500/50 outline-none resize-none text-slate-300 leading-[1.8] font-bold text-sm transition-all shadow-inner" placeholder="Analyze your academic journey..." value={editData.bio} onChange={(e) => setEditData({...editData, bio: e.target.value})}></textarea>
                </div>
                <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-4">
                  <button type="button" onClick={() => setEditing(false)} className="w-full sm:w-auto px-10 py-4 text-slate-600 hover:text-white rounded-2xl transition-all font-black text-xs uppercase tracking-widest">Cancel Modification</button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full sm:w-auto bg-white text-[#060a14] px-12 py-4 rounded-[1.8rem] font-black shadow-xl shadow-white/5 transition-all text-xs uppercase tracking-widest border border-white/20">Commit Identity Changes</motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Premium Tab Interface */}
      {isOwnProfile && (
        <div className="max-w-xl mx-auto mb-10 flex gap-2 p-1.5 bg-[#0d1428] border border-white/[0.08] rounded-[2rem] shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/5 blur-xl"></div>
          <button 
            onClick={() => setActiveTab('posts')}
            className={`relative z-10 flex-1 py-3.5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'posts' ? 'bg-white text-[#060a14] shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/[0.03]'}`}
          >
            My Activity
          </button>
          <button 
            onClick={() => setActiveTab('saved')}
            className={`relative z-10 flex-1 py-3.5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === 'saved' ? 'bg-white text-[#060a14] shadow-xl' : 'text-slate-500 hover:text-white hover:bg-white/[0.03]'}`}
          >
            <Bookmark className="w-4 h-4" /> Vault
          </button>
        </div>
      )}

      {/* Activity / Vault Feed */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-10 px-4">
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"></div>
             <h2 className="text-2xl font-black text-white tracking-tighter">{activeTab === 'posts' ? 'Content Transmissions' : 'Information Vault'}</h2>
          </div>
          <div className="flex items-center gap-2 bg-white/[0.03] px-4 py-2 rounded-xl border border-white/[0.05]">
             <span className="text-slate-600 font-black text-[10px] uppercase tracking-widest">
                {activeTab === 'posts' ? posts.length : savedPosts.length} Nodes
             </span>
          </div>
        </div>
        
        {activeTab === 'posts' ? (
          posts.length > 0 ? (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
              {posts.map(post => <PostCard key={post._id} post={post} onDelete={() => setPosts(posts.filter(p => p._id !== post._id))} />)}
            </motion.div>
          ) : (
            <EmptyState 
              icon={User}
              title={isOwnProfile ? "No Activity Detected" : "Channel Silent"}
              description={isOwnProfile 
                ? "Your activity feed is currently static. Initiate a discussion to broadcast your identity to the community." 
                : "This identity node hasn't authorized any public transmissions yet."}
              actionText={isOwnProfile ? "Initialize Transmission" : null}
              actionLink={isOwnProfile ? "/create-post" : null}
            />
          )
        ) : (
          savedPosts.length > 0 ? (
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
              {savedPosts.map(post => <PostCard key={post._id} post={post} />)}
            </motion.div>
          ) : (
            <EmptyState 
              icon={Bookmark}
              title="Vault Empty"
              description="Your information vault is currently unpopulated. Save critical discussions to store them in your secure private sector."
              actionText="Explore Feed"
              actionLink="/"
            />
          )
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
