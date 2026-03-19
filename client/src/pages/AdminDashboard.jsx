import { useState, useEffect } from 'react';
import API from '../api/axios';
import { Loader2, Users, FileText, Trash2, ShieldCheck, Flag, CheckCircle2, XCircle, AlertTriangle, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reports'); // Default to reports for admins
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, postsRes, reportsRes] = await Promise.all([
          API.get('/users/all?limit=50'),
          API.get('/posts?limit=50'),
          API.get('/reports?status=pending')
        ]);
        setUsers(usersRes.data.users || []);
        setPosts(postsRes.data.posts || []);
        setReports(reportsRes.data.reports || []);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm('Delete this user account? This cannot be undone.')) {
      try {
        await API.delete(`/users/${id}`);
        setUsers(users.filter(u => u._id !== id));
        toast.success('User deleted');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm('Delete this post?')) {
      try {
        await API.delete(`/posts/${id}`);
        setPosts(posts.filter(p => p._id !== id));
        toast.success('Post deleted');
      } catch (err) {
        toast.error('Failed to delete post');
      }
    }
  };

  const handleUpdateReport = async (reportId, status) => {
    try {
      await API.put(`/reports/${reportId}`, { status });
      setReports(reports.filter(r => r._id !== reportId));
      toast.success(`Report ${status}`);
    } catch (err) {
      toast.error('Failed to update report');
    }
  };

  if (loading) return (
    <div className="flex justify-center py-24">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="py-4 sm:py-8 max-w-6xl mx-auto space-y-8">
      <Helmet>
        <title>Admin Command Center | Arsi Aseko</title>
      </Helmet>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20 rotate-3">
             <ShieldCheck className="w-7 h-7 -rotate-3" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Command Center</h1>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Administrative Overwatch</p>
          </div>
        </div>

        <div className="relative group">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
           <input 
             type="text" 
             placeholder="Search entries..." 
             className="bg-white/[0.03] border border-white/[0.06] rounded-xl py-2 pl-9 pr-4 text-sm text-white outline-none focus:border-blue-500/20 w-full sm:w-64 transition-all"
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Students', value: users.length, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Platform Posts', value: posts.length, icon: FileText, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
          { label: 'Pending Reports', value: reports.length, icon: Flag, color: 'text-orange-400', bg: 'bg-orange-500/10' },
        ].map((stat, i) => (
          <motion.div key={i} whileHover={{ y: -2 }} className="glass-card p-6 rounded-2xl flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 font-bold uppercase tracking-tighter text-[11px]">{stat.label}</p>
              <p className="text-2xl font-black text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Tabs Layout */}
      <div className="glass-card rounded-3xl overflow-hidden border border-white/[0.04]">
        <div className="flex bg-white/[0.02] border-b border-white/[0.06] p-1 h-14">
          {[
            { id: 'reports', label: 'Moderation', icon: Flag },
            { id: 'users', label: 'User Directory', icon: Users },
            { id: 'posts', label: 'Content Feed', icon: FileText },
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 rounded-2xl font-bold text-xs transition-all ${activeTab === tab.id ? 'bg-white/[0.08] text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.id === 'reports' && reports.length > 0 && <span className="ml-1 bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{reports.length}</span>}
            </button>
          ))}
        </div>

        <div className="p-4 sm:p-6 overflow-x-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'reports' && (
              <motion.div key="reports" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                {reports.length > 0 ? (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report._id} className="p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl hover:bg-white/[0.03] transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-400 shrink-0">
                               <AlertTriangle className="w-5 h-5" />
                            </div>
                            <div>
                               <div className="flex items-center gap-2 mb-1">
                                 <span className="text-sm font-bold text-white uppercase tracking-tight">Reported {report.targetType}</span>
                                 <span className="text-[10px] bg-white/[0.06] text-slate-500 px-2 py-0.5 rounded-md font-mono">{report.targetId}</span>
                               </div>
                               <p className="text-slate-400 text-xs mb-2">Reason: <span className="text-orange-400 font-bold uppercase tracking-widest text-[10px] bg-orange-500/5 px-2 py-0.5 rounded-md">{report.reason}</span></p>
                               {report.description && <p className="text-slate-500 text-xs italic">"{report.description}"</p>}
                               <p className="text-[10px] text-slate-600 mt-2">By {report.reporter?.name} • {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                             <button onClick={() => handleUpdateReport(report._id, 'resolved')} className="flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-emerald-500/20">
                                <CheckCircle2 className="w-4 h-4" /> Resolve & Hide
                             </button>
                             <button onClick={() => handleUpdateReport(report._id, 'dismissed')} className="flex items-center justify-center gap-2 bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/[0.06]">
                                <XCircle className="w-4 h-4" /> Dismiss
                             </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500/30 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Queue is clear! Good job, Captain.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="min-w-[600px]">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-slate-600 text-[11px] font-black uppercase tracking-widest">
                      <th className="pb-4 pl-2 text-primary-300">Student Profile</th>
                      <th className="pb-4">Academic Institution</th>
                      <th className="pb-4">Status</th>
                      <th className="pb-4 text-right pr-2">Command</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {users.map(u => (
                      <tr key={u._id} className="hover:bg-white/[0.01] transition-colors group">
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-3">
                             <div className="relative">
                               <img src={u.profilePicture} className="w-9 h-9 rounded-xl object-cover ring-2 ring-white/[0.04]" alt="" />
                               {u.isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#111827]" />}
                             </div>
                             <div>
                               <p className="font-bold text-white text-sm">{u.name}</p>
                               <p className="text-xs text-slate-500 font-medium">{u.email}</p>
                             </div>
                          </div>
                        </td>
                        <td className="py-4">
                           <p className="text-xs font-bold text-slate-400">{u.university}</p>
                           <p className="text-[10px] text-slate-600 font-medium">{u.department}</p>
                        </td>
                        <td className="py-4">
                           {u.isVerified ? (
                             <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase">Verified</span>
                           ) : (
                             <span className="text-[10px] bg-slate-500/10 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">Unverified</span>
                           )}
                        </td>
                        <td className="py-4 text-right pr-2">
                           <button onClick={() => handleDeleteUser(u._id)} className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                              <Trash2 className="w-4.5 h-4.5" />
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            )}

            {activeTab === 'posts' && (
              <motion.div key="posts" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
                 {posts.map(p => (
                    <div key={p._id} className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex items-center justify-between group hover:bg-white/[0.04] transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 font-bold text-xs uppercase">
                             {p.tags?.[0]?.substring(0, 2) || 'PT'}
                          </div>
                          <div>
                             <h4 className="text-sm font-bold text-white mb-1">{p.title}</h4>
                             <p className="text-[11px] text-slate-500">By {p.author.name} • {new Date(p.createdAt).toLocaleDateString()}</p>
                          </div>
                       </div>
                       <button onClick={() => handleDeletePost(p._id)} className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="w-4.5 h-4.5" />
                       </button>
                    </div>
                 ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Standard formatDistanceToNow from date-fns
const formatDistanceToNow = (date, options) => {
  const diffInSeconds = Math.floor((new Date() - date) / 1000);
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

export default AdminDashboard;
