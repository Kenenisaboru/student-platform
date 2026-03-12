import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import { useAuth } from '../context/AuthContext';
import { Loader2, Calendar, MapPin, Book, Edit3 } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const { user: currentUser, updateProfile } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data: userData } = await API.get(`/users/${id}`);
        setUser(userData);
        setEditData(userData);
        
        // Fetch posts from feed and filter (or we could have a specific endpoint)
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
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
    </div>
  );

  if (!user) return <div className="text-center py-20 text-slate-500">User not found</div>;

  const isOwnProfile = currentUser?._id === user._id;

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-400"></div>
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row md:items-end -mt-12 mb-6 space-y-4 md:space-y-0 md:space-x-6">
            <img 
              src={user.profilePicture} 
              className="w-32 h-32 rounded-3xl border-4 border-white object-cover shadow-lg bg-white" 
              alt={user.name} 
            />
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
              <p className="text-slate-500 font-medium">@{user.email.split('@')[0]}</p>
            </div>
            {isOwnProfile && (
              <button 
                onClick={() => setEditing(!editing)}
                className="btn-outline flex items-center"
              >
                <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
              </button>
            )}
          </div>

          {!editing ? (
            <div className="space-y-4">
              <p className="text-slate-700 text-lg leading-relaxed max-w-2xl">{user.bio || "No bio added yet."}</p>
              <div className="flex flex-wrap gap-6 mt-6">
                <div className="flex items-center text-slate-600">
                  <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                  <span>{user.university}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Book className="w-4 h-4 mr-2 text-primary-500" />
                  <span>{user.department}</span>
                </div>
                <div className="flex items-center text-slate-600">
                  <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-6 mt-6 border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Display Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 focus:ring-2 focus:ring-primary-500 outline-none"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Profile Picture URL</label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 focus:ring-2 focus:ring-primary-500 outline-none"
                    value={editData.profilePicture}
                    onChange={(e) => setEditData({...editData, profilePicture: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Bio</label>
                <textarea 
                  rows="3"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  value={editData.bio}
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={() => setEditing(false)} className="px-6 py-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors font-medium">Cancel</button>
                <button type="submit" className="btn-primary px-6">Save Changes</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* User Posts */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-slate-900 mb-6 px-2">Posts</h2>
        {posts.length > 0 ? (
          <div>
            {posts.map(post => (
              <PostCard 
                key={post._id} 
                post={post} 
                onDelete={() => setPosts(posts.filter(p => p._id !== post._id))}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500">This student hasn't posted anything yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
