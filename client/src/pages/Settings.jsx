import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { UserCog, KeySquare, BellRing, Trash2, Loader2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Settings = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('account');
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [deleteData, setDeleteData] = useState('');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await API.put('/users/profile', { password: passwordData.new }); // Needs better current pass checking in backend
      toast.success('Password updated successfully!');
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (err) {
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteData !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }
    try {
      await API.delete(`/users/${user._id}`);
      toast.success('Account deleted forever. Goodbye!');
      logout();
    } catch (err) {
      toast.error('Failed to delete account');
    }
  };

  const tabs = [
    { id: 'account', icon: <UserCog className="w-5 h-5" />, label: 'Account' },
    { id: 'security', icon: <KeySquare className="w-5 h-5" />, label: 'Security' },
    { id: 'notifications', icon: <BellRing className="w-5 h-5" />, label: 'Notifications' },
    { id: 'danger', icon: <Trash2 className="w-5 h-5" />, label: 'Danger Zone' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-0 flex flex-col md:flex-row gap-6">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 space-y-2">
        <h2 className="text-xl font-extrabold text-white mb-6 px-4">Settings</h2>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-2xl font-bold transition-all ${
              activeTab === tab.id 
                ? tab.id === 'danger' ? 'bg-rose-500/10 text-rose-400 shadow-sm' : 'bg-blue-500/10 text-blue-400 shadow-sm'
                : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 glass-card rounded-3xl p-6 sm:p-10 relative overflow-hidden min-h-[500px]">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <AnimatePresence mode="wait">
          {activeTab === 'account' && (
            <motion.div key="account" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
              <h3 className="text-2xl font-bold text-white tracking-tight">Account Preferences</h3>
              <p className="text-slate-500 font-medium">Manage your personal account details.</p>
              
              <div className="p-6 bg-white/[0.02] border border-white/[0.04] rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold mb-1">Email Address</h4>
                  <p className="text-slate-500 text-sm">{user?.email}</p>
                </div>
                <div className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/20">Verified</div>
              </div>

              <div className="p-6 bg-white/[0.02] border border-white/[0.04] rounded-2xl">
                <h4 className="text-white font-bold mb-1">Public Profile</h4>
                <p className="text-slate-500 text-sm mb-4">You can edit your profile information from your profile page.</p>
                <button onClick={() => window.location.href=`/profile/${user._id}`} className="px-5 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-white rounded-xl text-sm font-bold border border-white/[0.06] transition-colors">
                  Go to Profile
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div key="security" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
              <h3 className="text-2xl font-bold text-white tracking-tight">Security & Password</h3>
              <p className="text-slate-500 font-medium">Keep your account secure.</p>
              
              <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                <div className="group">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">New Password</label>
                  <input type="password" required minLength="6" value={passwordData.new} onChange={e => setPasswordData({...passwordData, new: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3.5 px-5 text-white font-medium focus:outline-none focus:border-blue-500/40" />
                </div>
                <div className="group">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Confirm New Password</label>
                  <input type="password" required minLength="6" value={passwordData.confirm} onChange={e => setPasswordData({...passwordData, confirm: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl py-3.5 px-5 text-white font-medium focus:outline-none focus:border-blue-500/40" />
                </div>
                
                <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3.5 font-bold shadow-lg shadow-blue-500/20 transition-all flex justify-center mt-6">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center"><Save className="w-4 h-4 mr-2" /> Update Password</span>}
                </button>
              </form>
            </motion.div>
          )}

           {activeTab === 'notifications' && (
            <motion.div key="notifications" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
              <h3 className="text-2xl font-bold text-white tracking-tight">Notification Settings</h3>
              <p className="text-slate-500 font-medium mb-6">Choose what you get notified about.</p>

              <div className="space-y-4">
                {['Push Notifications', 'Email Digests', 'New Follower alerts', 'Direct Messages'].map((opt, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl">
                    <span className="font-semibold text-slate-300">{opt}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-white/[0.1] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'danger' && (
            <motion.div key="danger" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
              <h3 className="text-2xl font-bold text-rose-500 tracking-tight">Danger Zone</h3>
              <p className="text-slate-500 font-medium">Permanently delete your account and all associated data.</p>
              
              <div className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-3xl mt-6">
                <h4 className="text-rose-400 font-bold mb-4 flex items-center"><Trash2 className="w-5 h-5 mr-2" /> Delete Account</h4>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">Once you delete your account, there is no going back. All your posts, followers, and saved items will be instantly wiped from our database.</p>
                
                <div className="max-w-xs space-y-3">
                  <input 
                    type="text" 
                    placeholder="Type DELETE to confirm" 
                    value={deleteData}
                    onChange={(e) => setDeleteData(e.target.value)}
                    className="w-full bg-white/[0.03] border border-rose-500/20 rounded-xl py-3 px-4 text-white font-bold focus:outline-none focus:border-rose-500/50" 
                  />
                  <button onClick={handleDeleteAccount} className="w-full bg-rose-600 hover:bg-rose-500 text-white rounded-xl py-3 font-bold shadow-lg shadow-rose-500/20 transition-all">
                    Permanently Delete
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Settings;
