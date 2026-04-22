import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { UserCog, KeySquare, BellRing, Trash2, Loader2, Save, Sun, Moon, ShieldAlert, Cpu, Sparkles, LogOut, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Settings = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('account');
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [deleteData, setDeleteData] = useState('');

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
        toast.error('Cryptographic mismatch. New passwords must be identical.');
        return;
    }
    setLoading(true);
    try {
      await API.put('/users/profile', { password: passwordData.new });
      toast.success('Security credentials updated successfully.');
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (err) {
      toast.error('Failed to update security protocols.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteData !== 'DELETE') {
      toast.error('Validation failed. Type DELETE to authorize account termination.');
      return;
    }
    try {
      await API.delete(`/users/${user._id}`);
      toast.success('Identity node terminated. Redirecting...');
      logout();
    } catch (err) {
      toast.error('Termination sequence failed.');
    }
  };

  const tabs = [
    { id: 'account', icon: <UserCog className="w-4 h-4" />, label: 'Core Preference' },
    { id: 'security', icon: <KeySquare className="w-4 h-4" />, label: 'Security Protocols' },
    { id: 'notifications', icon: <BellRing className="w-4 h-4" />, label: 'Signal Settings' },
    { id: 'danger', icon: <ShieldAlert className="w-4 h-4" />, label: 'Danger Zone' },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 flex flex-col lg:flex-row gap-10">
      
      {/* Pro Sidebar Controls */}
      <div className="w-full lg:w-72 shrink-0">
        <div className="mb-10 px-4">
           <h2 className="text-3xl font-black text-white tracking-tighter mb-2">Portal Set</h2>
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none">System Configuration</span>
           </div>
        </div>

        <div className="space-y-1.5 p-1.5 bg-[#0d1428] rounded-[2.5rem] border border-white/[0.05] shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/5 blur-xl"></div>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all relative z-10 ${
                activeTab === tab.id 
                  ? tab.id === 'danger' 
                    ? 'bg-rose-600/10 text-rose-500 shadow-xl border border-rose-500/20' 
                    : 'bg-white text-[#060a14] shadow-2xl shadow-white/5'
                  : 'text-slate-500 hover:bg-white/[0.03] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                 {tab.icon}
                 <span>{tab.label}</span>
              </div>
              {activeTab === tab.id && <ChevronRight className="w-4 h-4 opacity-50" />}
            </button>
          ))}
        </div>

        <div className="mt-8 px-4">
           <p className="text-[10px] text-slate-600 font-bold leading-relaxed">System adjustments take effect across your entire decentralized profile.</p>
        </div>
      </div>

      {/* Main Configuration Terminal */}
      <div className="flex-1 bg-[#0a0f1e]/80 backdrop-blur-3xl rounded-[3rem] border border-white/[0.08] p-8 sm:p-12 shadow-2xl relative overflow-hidden min-h-[600px]">
        {/* Dynamic Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none"></div>
        
        <AnimatePresence mode="wait">
          {activeTab === 'account' && (
            <motion.div key="account" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
              <div>
                 <h3 className="text-3xl font-black text-white tracking-tighter mb-4 flex items-center gap-3">
                    Core Preferences <Sparkles className="w-6 h-6 text-blue-400" />
                 </h3>
                 <p className="text-slate-500 font-medium max-w-lg">Universal account parameters and environmental styling controllers.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-[2rem] hover:bg-white/[0.04] transition-all">
                    <div className="flex items-center justify-between mb-2">
                       <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Visual Theme</h4>
                    </div>
                    <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5">
                        <button 
                            onClick={() => !isDarkMode && toggleTheme()}
                            className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${isDarkMode ? 'bg-white text-[#060a14] shadow-xl' : 'text-slate-600 hover:text-white'}`}
                        >
                            <Moon className="w-4 h-4" /> Dark
                        </button>
                        <button 
                            onClick={() => isDarkMode && toggleTheme()}
                            className={`flex-1 flex items-center justify-center gap-3 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${!isDarkMode ? 'bg-white text-[#060a14] shadow-xl' : 'text-slate-600 hover:text-white'}`}
                        >
                            <Sun className="w-4 h-4" /> Light
                        </button>
                    </div>
                 </div>

                 <div className="p-6 bg-white/[0.02] border border-white/[0.06] rounded-[2rem] flex flex-col justify-between group">
                    <div>
                       <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Authenticated Identity</h4>
                       <p className="text-white font-black text-sm tracking-tight truncate">{user?.email}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-emerald-500 font-black text-[9px] uppercase tracking-widest">
                       <ShieldAlert className="w-3.5 h-3.5" /> Identity Verified
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-gradient-to-br from-blue-600/10 to-transparent border border-blue-500/10 rounded-[2.5rem] relative overflow-hidden group">
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="max-w-sm">
                        <h4 className="text-white font-black text-lg tracking-tight mb-2">Public Profile Sector</h4>
                        <p className="text-slate-500 text-xs font-bold leading-relaxed">Update your biography, academic status, and visual identifiers in the public profile management sector.</p>
                    </div>
                    <Link to={`/profile/${user._id}`} className="px-8 py-3.5 bg-white text-[#060a14] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all shadow-xl active:scale-95 whitespace-nowrap">
                        Configure Node
                    </Link>
                </div>
                <Cpu className="absolute -bottom-6 -right-6 w-32 h-32 text-blue-500/5 group-hover:scale-125 transition-transform duration-1000" />
              </div>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div key="security" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
              <div>
                 <h3 className="text-3xl font-black text-white tracking-tighter mb-4 flex items-center gap-3">
                    Security Protocols <KeySquare className="w-6 h-6 text-indigo-400" />
                 </h3>
                 <p className="text-slate-500 font-medium max-w-lg">Modify your cryptographic access keys and two-factor authentication handlers.</p>
              </div>
              
              <form onSubmit={handlePasswordUpdate} className="space-y-6 max-w-md">
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">New Access Signal</label>
                  <input type="password" required minLength="6" value={passwordData.new} onChange={e => setPasswordData({...passwordData, new: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-2xl py-4 px-6 text-white font-black text-sm tracking-tight focus:border-indigo-500/50 outline-none transition-all shadow-inner" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm Identity Key</label>
                  <input type="password" required minLength="6" value={passwordData.confirm} onChange={e => setPasswordData({...passwordData, confirm: e.target.value})} className="w-full bg-white/[0.03] border border-white/[0.1] rounded-2xl py-4 px-6 text-white font-black text-sm tracking-tight focus:border-indigo-500/50 outline-none transition-all shadow-inner" placeholder="••••••••" />
                </div>
                
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full bg-white text-[#060a14] rounded-2xl py-4 font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all flex justify-center items-center gap-3">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> Commit Signal Update</>}
                </motion.button>
              </form>
            </motion.div>
          )}

           {activeTab === 'notifications' && (
            <motion.div key="notifications" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
              <div>
                 <h3 className="text-3xl font-black text-white tracking-tighter mb-4 flex items-center gap-3">
                    Signal Handlers <BellRing className="w-6 h-6 text-amber-500" />
                 </h3>
                 <p className="text-slate-500 font-medium max-w-lg">Configure how you receive incoming information pulses from the community network.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {['Direct Signal', 'Faculty Digests', 'Interaction Alerts', 'System Updates'].map((opt, i) => (
                  <div key={i} className="flex flex-col p-6 bg-white/[0.02] border border-white/[0.04] rounded-3xl group hover:border-blue-500/20 transition-all">
                    <div className="flex justify-between items-center mb-1">
                       <span className="font-black text-white text-[13px] tracking-tight">{opt}</span>
                       <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-12 h-6 bg-white/[0.05] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-blue-600 border border-white/5"></div>
                       </label>
                    </div>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-2 group-hover:text-slate-400 transition-colors">Enabled</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'danger' && (
            <motion.div key="danger" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
              <div>
                 <h3 className="text-3xl font-black text-rose-500 tracking-tighter mb-4 flex items-center gap-3">
                    Termination Sector <Trash2 className="w-6 h-6" />
                 </h3>
                 <p className="text-slate-500 font-medium max-w-lg">Authorized deletion of your centralized identity node and all associated structural data.</p>
              </div>
              
              <div className="p-8 bg-rose-500/5 border border-rose-500/20 rounded-[2.5rem] relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>
                 <div className="relative z-10">
                    <h4 className="text-rose-400 font-black text-lg tracking-tight mb-4 flex items-center gap-3">
                        <ShieldAlert className="w-5 h-5 animate-pulse" /> Final Authorization
                    </h4>
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed font-bold italic opacity-70">"Warning: Identity erasure is permanent and non-reversible across the entire campus network."</p>
                    
                    <div className="space-y-4 max-w-xs">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-rose-500/50 uppercase tracking-[0.2em] ml-1">Confirm Signal</label>
                           <input 
                            type="text" 
                            placeholder="SERIAL: DELETE" 
                            value={deleteData}
                            onChange={(e) => setDeleteData(e.target.value)}
                            className="w-full bg-black/60 border border-rose-500/20 rounded-2xl py-3.5 px-5 text-white font-black text-xs uppercase tracking-widest focus:outline-none focus:border-rose-500 shadow-inner" 
                           />
                        </div>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleDeleteAccount} className="w-full bg-rose-600 hover:bg-rose-500 text-white rounded-2xl py-4 font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-rose-600/20 transition-all border border-white/5">
                            Authorize Erasure
                        </motion.button>
                    </div>
                 </div>
              </div>

              <div className="p-6 border border-white/[0.04] rounded-2xl flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-white/[0.02] flex items-center justify-center text-slate-600">
                        <LogOut className="w-5 h-5" />
                     </div>
                     <span className="text-slate-300 font-black text-sm tracking-tight group-hover:text-white transition-colors">Emergency Decouple</span>
                  </div>
                  <button onClick={logout} className="px-6 py-2 rounded-xl bg-rose-500/10 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all">Sign Out</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Settings;
