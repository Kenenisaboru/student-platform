import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import { Loader2, Calendar, MapPin, Book, Edit3, User, Mail, AtSign, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, updateProfile } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data: userData } = await API.get(`/users/${id}`);
        setUser(userData);
        setEditData(userData);
        const { data: postsData } = await API.get('/posts');
        setPosts(postsData.filter(p => p.author._id === id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        name: editData.name,
        bio: editData.bio,
        university: editData.university,
        department: editData.department,
        profilePicture: editData.profilePicture
      };
      await updateProfile(updateData);
      setUser({ ...user, ...updateData });
      setEditing(false);
      toast.success('Your profile has been updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error('Image is too large (max 5MB)'); return; }

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    const toastId = toast.loading('Uploading your photo...');
    try {
      const { data } = await API.post('/users/upload-profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setEditData({ ...editData, profilePicture: data.url });
      toast.success('Photo uploaded!', { id: toastId });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed.', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-24">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center">
      <h2 className="text-2xl font-bold text-white mb-4">User not found</h2>
      <button onClick={() => window.history.back()} className="btn-outline">Go Back</button>
    </div>
  );

  const isOwnProfile = currentUser?._id === user._id;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto py-4 sm:py-6 px-2 sm:px-0 pb-20">
      {/* Profile Header Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl overflow-hidden mb-8">
        <div className="h-36 sm:h-48 bg-gradient-to-br from-blue-600/30 via-indigo-600/20 to-purple-700/20 relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full -ml-12 -mb-12 blur-2xl"></div>
        </div>

        <div className="px-5 sm:px-10 pb-8 relative">
          <div className="flex flex-col md:flex-row md:items-end -mt-14 sm:-mt-18 mb-6 space-y-4 md:space-y-0 md:space-x-6">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="relative group">
              <div className="relative overflow-hidden rounded-2xl border-4 border-[#060a14] shadow-2xl">
                <img 
                  src={editing ? editData.profilePicture : user.profilePicture} 
                  className={`w-28 h-28 sm:w-36 sm:h-36 object-cover transition-all ${uploading ? 'opacity-50 grayscale' : ''}`} 
                  alt={user.name} 
                />
                {editing && (
                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    {uploading ? <Loader2 className="w-7 h-7 animate-spin" /> : <><Camera className="w-7 h-7 mb-1" /><span className="text-[10px] font-bold uppercase tracking-wider">Change</span></>}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={uploading} />
                  </label>
                )}
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-emerald-500 border-4 border-[#060a14] rounded-xl"></div>
            </motion.div>
            
            <div className="flex-1 pb-1">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{user.name}</h1>
                <div className="flex items-center text-slate-500 font-bold mt-1 space-x-2 text-sm">
                  <AtSign className="w-3.5 h-3.5 text-blue-400" />
                  <span>{user.email.split('@')[0]}</span>
                </div>
              </motion.div>
            </div>

            {isOwnProfile && (
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setEditing(!editing)}
                className="bg-white/[0.06] hover:bg-white/[0.1] text-white px-5 py-2.5 rounded-xl flex items-center font-bold transition-all border border-white/[0.06] text-sm">
                <Edit3 className="w-4 h-4 mr-2" /> {editing ? 'Cancel' : 'Edit Profile'}
              </motion.button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!editing ? (
              <motion.div key="view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <div className="max-w-2xl">
                  <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 ml-1">About Me</h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium bg-white/[0.02] p-5 rounded-xl border border-white/[0.04] italic">
                    {user.bio || "This student hasn't shared a bio yet."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                  <div className="flex items-center space-x-3 glass-card p-4 rounded-xl">
                    <div className="w-9 h-9 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400"><MapPin className="w-4 h-4" /></div>
                    <div><p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">University</p><p className="text-white font-semibold text-sm">{user.university}</p></div>
                  </div>
                  <div className="flex items-center space-x-3 glass-card p-4 rounded-xl">
                    <div className="w-9 h-9 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400"><Book className="w-4 h-4" /></div>
                    <div><p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Department</p><p className="text-white font-semibold text-sm">{user.department}</p></div>
                  </div>
                  <div className="flex items-center space-x-3 glass-card p-4 rounded-xl">
                    <div className="w-9 h-9 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-400"><Calendar className="w-4 h-4" /></div>
                    <div><p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Member Since</p><p className="text-white font-semibold text-sm">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p></div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.form key="edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} onSubmit={handleUpdate} className="space-y-6 bg-white/[0.02] p-6 sm:p-8 rounded-2xl border border-white/[0.04]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="group">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                    <div className="relative">
                      <input type="text" className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3.5 pl-11 pr-4 focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-semibold text-white text-sm" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />
                      <User className="absolute left-3.5 top-3.5 text-slate-600 w-4.5 h-4.5" />
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Profile Photo</label>
                    <div className="flex flex-wrap gap-2">
                      <label className={`flex items-center space-x-2 px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl cursor-pointer hover:border-blue-500/20 hover:bg-blue-500/5 transition-all font-semibold text-slate-400 text-sm ${uploading ? 'opacity-50' : ''}`}>
                        <Camera className="w-4 h-4 text-blue-400" /><span>Upload</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>
                    <div className="mt-3">
                      <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1.5 ml-1">Or Paste URL</label>
                      <input type="text" className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-2.5 px-4 focus:border-blue-500/30 outline-none transition-all font-medium text-slate-400 text-xs" placeholder="https://..." value={editData.profilePicture} onChange={(e) => setEditData({...editData, profilePicture: e.target.value})} />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Biography</label>
                  <textarea rows="3" className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3.5 px-5 focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/10 outline-none resize-none text-slate-300 leading-relaxed font-medium text-sm transition-all" placeholder="Tell us about your journey..." value={editData.bio} onChange={(e) => setEditData({...editData, bio: e.target.value})}></textarea>
                </div>
                <div className="flex justify-end space-x-3 pt-3">
                  <button type="button" onClick={() => setEditing(false)} className="px-6 py-2.5 text-slate-500 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all font-semibold text-sm">Cancel</button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all text-sm">Save Profile</motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* User Posts Feed */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-xl font-extrabold text-white tracking-tight">Activity Feed</h2>
          <div className="h-px flex-1 bg-white/[0.04] mx-4"></div>
          <span className="text-slate-600 font-bold text-xs uppercase tracking-widest">{posts.length} Posts</span>
        </div>

        {posts.length > 0 ? (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-4">
            {posts.map(post => (
              <PostCard key={post._id} post={post} onDelete={() => setPosts(posts.filter(p => p._id !== post._id))} />
            ))}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 glass-card rounded-2xl">
            <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-7 h-7 text-slate-600" />
            </div>
            <p className="text-slate-500 font-semibold italic text-sm">This student hasn't shared any posts yet.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
