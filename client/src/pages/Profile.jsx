import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import { Loader2, Calendar, MapPin, Book, Edit3, User, Mail, AtSign, ArrowLeft, Camera } from 'lucide-react';
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
      await updateProfile(editData);
      setUser({ ...user, ...editData });
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile');
      console.error(err);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File is too large (max 5MB)');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const { data } = await API.post('/users/upload-profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setEditData({ ...editData, profilePicture: data.url });
      toast.success('Image uploaded! Save profile to finalize.');
    } catch (err) {
      toast.error('Image upload failed');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-24">
      <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
    </div>
  );

  if (!user) return (
    <div className="max-w-2xl mx-auto py-20 px-4 text-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">User not found</h2>
      <button onClick={() => window.history.back()} className="btn-outline">Go Back</button>
    </div>
  );

  const isOwnProfile = currentUser?._id === user._id;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-0 pb-20"
    >
      {/* Profile Header Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-white overflow-hidden mb-10"
      >
        <div className="h-40 sm:h-52 bg-gradient-to-br from-primary-600 via-indigo-600 to-purple-700 relative">
          {/* Decorative shapes for banner */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary-400/20 rounded-full -ml-12 -mb-12 blur-2xl"></div>
        </div>

        <div className="px-6 sm:px-12 pb-10 relative">
          <div className="flex flex-col md:flex-row md:items-end -mt-16 sm:-mt-20 mb-8 space-y-4 md:space-y-0 md:space-x-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="relative group"
            >
              <div className="relative overflow-hidden rounded-[2.5rem] border-8 border-white shadow-2xl">
                <img 
                  src={editing ? editData.profilePicture : user.profilePicture} 
                  className={`w-32 h-32 sm:w-40 sm:h-40 object-cover bg-white transition-all ${uploading ? 'opacity-50 grayscale' : ''}`} 
                  alt={user.name} 
                />
                
                {editing && (
                  <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    {uploading ? (
                      <Loader2 className="w-8 h-8 animate-spin" />
                    ) : (
                      <>
                        <Camera className="w-8 h-8 mb-1" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Change Photo</span>
                      </>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={uploading} />
                  </label>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-white rounded-2xl shadow-lg"></div>
            </motion.div>
            
            <div className="flex-1 pb-2">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{user.name}</h1>
                <div className="flex items-center text-slate-500 font-bold mt-1 space-x-2">
                  <AtSign className="w-4 h-4 text-primary-500" />
                  <span>{user.email.split('@')[0]}</span>
                </div>
              </motion.div>
            </div>

            {isOwnProfile && (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setEditing(!editing)}
                className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl flex items-center font-bold shadow-lg transition-all"
              >
                <Edit3 className="w-4 h-4 mr-2" /> {editing ? 'Cancel Editing' : 'Edit Profile'}
              </motion.button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!editing ? (
              <motion.div 
                key="view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="max-w-3xl">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">About Me</h3>
                  <p className="text-slate-700 text-lg leading-relaxed font-medium bg-slate-50/50 p-6 rounded-3xl border border-slate-100 italic">
                    {user.bio || "This student is mysterious and hasn't shared a bio yet."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 p-1">
                  <div className="flex items-center space-x-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">University</p>
                      <p className="text-slate-800 font-bold text-sm">{user.university}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                      <Book className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</p>
                      <p className="text-slate-800 font-bold text-sm">{user.department}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Member Since</p>
                      <p className="text-slate-800 font-bold text-sm">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.form 
                key="edit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleUpdate} 
                className="space-y-8 bg-slate-50/50 p-8 sm:p-10 rounded-[2.5rem] border border-slate-100"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-primary-500 transition-colors">Full Name</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-6 focus:border-primary-200 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-bold text-slate-800"
                        value={editData.name}
                        onChange={(e) => setEditData({...editData, name: e.target.value})}
                      />
                      <User className="absolute left-4 top-4 text-slate-300 group-focus-within:text-primary-400 w-5 h-5 transition-colors" />
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-primary-500 transition-colors">Profile Image Link</label>
                    <div className="relative flex items-center space-x-4">
                      <input 
                        type="text" 
                        className="flex-1 bg-white border-2 border-slate-100 rounded-2xl py-4 px-6 focus:border-primary-200 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all font-semibold text-slate-600 text-sm"
                        value={editData.profilePicture}
                        onChange={(e) => setEditData({...editData, profilePicture: e.target.value})}
                      />
                      <label 
                        className={`bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-4 rounded-xl cursor-pointer transition-all ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
                        title="Choose from Gallery"
                      >
                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-primary-500 transition-colors">Biography</label>
                  <textarea 
                    rows="4"
                    className="w-full bg-white border-2 border-slate-100 rounded-2xl py-4 px-6 focus:border-primary-200 focus:ring-4 focus:ring-primary-500/5 outline-none transition-all resize-none text-slate-700 leading-relaxed font-medium"
                    placeholder="Tell us about your academic journey..."
                    value={editData.bio}
                    onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setEditing(false)} 
                    className="px-8 py-3 text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl transition-all font-bold uppercase tracking-widest text-xs"
                  >
                    Discard Changes
                  </button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit" 
                    className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-4 rounded-2xl font-extrabold shadow-xl shadow-primary-500/20 transition-all"
                  >
                    Save Profile
                  </motion.button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* User Posts Feed */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8 px-2 md:px-4">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Activity Feed</h2>
          <div className="h-px flex-1 bg-slate-100 mx-6 opacity-50"></div>
          <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">{posts.length} Posts</span>
        </div>

        {posts.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
          >
            {posts.map(post => (
              <PostCard 
                key={post._id} 
                post={post} 
                onDelete={() => setPosts(posts.filter(p => p._id !== post._id))}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-dashed border-slate-200 shadow-sm"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-400 font-bold italic tracking-wide">This student hasn't shared any posts yet.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
