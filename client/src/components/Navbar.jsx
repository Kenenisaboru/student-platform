import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Bell, User, PlusSquare, Search, LogOut, ShieldCheck, Sparkles, Menu, MessageSquare, Database, Cpu, Globe, Zap } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import API from '../api/axios';
import sharedSocket from '../utils/socket';
import { toast } from 'sonner';
import ThemeToggle from './ThemeToggle';
import ProBadge from './ProBadge';


const Navbar = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [serverStatus, setServerStatus] = useState('loading');
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const pathnameRef = useRef(location.pathname);
  useEffect(() => {
    pathnameRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    if (!user) return;

    API.get('/notifications').then(res => {
      const notifications = Array.isArray(res.data) ? res.data : [];
      const unread = notifications.filter(n => n && !n.read).length;
      setUnreadCount(unread);
    }).catch(err => {
      console.warn('Notifications fetch failed:', err.message);
      setUnreadCount(0);
    });

    API.get('/messages/unread-count').then(res => {
      setUnreadMessages(res.data.unreadCount);
    }).catch(console.error);

    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    const serverRoot = apiBase.split('/api')[0] || 'http://localhost:5001';
    
    axios.get(serverRoot).then(() => setServerStatus('online')).catch(() => setServerStatus('offline'));

    if (!sharedSocket.connected) {
      sharedSocket.connect();
    }
    
    if (user && user._id) {
      sharedSocket.emit('join_room', user._id);
    }

    const handleNewNotification = (notification) => {
      setUnreadCount(prev => prev + 1);
      toast(notification.message, { icon: '🔔' });
    };

    const handleNewMessage = (data) => {
      if (!pathnameRef.current.includes(`/messages/${data.conversationId}`)) {
        setUnreadMessages(prev => prev + 1);
        toast(`Signal from ${data.message.sender.name}`, { icon: '💬' });
      }
    };

    sharedSocket.on('new_notification', handleNewNotification);
    sharedSocket.on('new_message', handleNewMessage);

    return () => {
      sharedSocket.off('new_notification', handleNewNotification);
      sharedSocket.off('new_message', handleNewMessage);
    };
  }, [user?._id]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/search?q=${searchQuery}`);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-[60] flex flex-col">
      {/* Narrative Pro Banner */}
      <div className="bg-[#02040a] text-white text-[9px] font-black py-1.5 px-6 hidden sm:flex justify-between items-center z-50 border-b border-white/[0.04] uppercase tracking-[0.25em]">
        <div className="container mx-auto max-w-[1400px] flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-blue-400 group cursor-default">
              <Cpu className="w-3 h-3 group-hover:animate-pulse" />
              <span>Core Terminal Active</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600">
              <Globe className="w-3 h-3" />
              <span>Universal Access Point</span>
            </div>
          </div>
          <div className="flex items-center space-x-6 text-slate-500">
             <div className="flex items-center space-x-1.5 group cursor-help">
                <div className={`w-1 h-1 rounded-full ${serverStatus === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-rose-500'}`}></div>
                <span className="group-hover:text-slate-300 transition-colors">Server: {serverStatus}</span>
             </div>
             <span className="opacity-10 text-white">|</span>
             <Link to="/settings" className="hover:text-blue-400 transition-colors">System Prefs</Link>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <nav className={`transition-all duration-700 border-b ${scrolled ? 'bg-[#0a0f1e]/90 backdrop-blur-3xl border-white/[0.08] py-2 shadow-2xl' : 'bg-[#0a0f1e]/60 backdrop-blur-2xl border-white/[0.04] py-4'}`}>
        <div className="container mx-auto px-6 max-w-[1400px] flex items-center justify-between">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-6">
            {user && (
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2.5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-xl text-slate-400 hover:text-white transition-all active:scale-90"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link to="/" aria-label="Arsi Aseko University Home" className="flex items-center gap-4 group">
              <div className="relative">
                 <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-700 rounded-[1.2rem] flex items-center justify-center text-white shadow-xl shadow-blue-500/10 group-hover:shadow-blue-500/30 group-hover:scale-105 transition-all duration-500 border border-white/10">
                    <span className="font-black text-xs">AAU</span>
                 </div>
                 <div className="absolute -inset-1 bg-blue-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="hidden xl:flex flex-col">
                <span className="text-lg font-black text-white leading-none tracking-tighter">Arsi Aseko <span className="text-blue-500">University</span></span>
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mt-1">Student Command Center</span>
              </div>
            </Link>
          </div>

          {/* Command Search */}
          {user && (
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-12 relative group" role="search">
              <input
                type="text"
                placeholder="Query database for students, archives, or tags..."
                aria-label="Search students, archives, or tags"
                className="w-full bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl py-3 pl-12 pr-6 text-sm focus:bg-white/[0.05] focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all duration-500 font-bold text-white placeholder:text-slate-700 shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="search-input"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-blue-500 w-4.5 h-4.5 transition-colors" aria-hidden="true" />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ProBadge className="scale-90" />
              </div>
            </form>
          )}

          {/* Action Modules */}
          <div className="flex items-center gap-1 sm:gap-2">
            {user ? (
              <>
                <div className="hidden md:flex items-center px-2 py-1 bg-[#0d1428] rounded-[1.5rem] border border-white/[0.06] shadow-inner" role="navigation" aria-label="Main Navigation">
                  <Link 
                    to="/" 
                    aria-label="Home Feed"
                    aria-current={isActive('/') ? 'page' : undefined}
                    className={`p-2.5 rounded-xl transition-all relative ${isActive('/') ? 'text-white' : 'text-slate-600 hover:text-white'}`}
                  >
                    <Home className="w-5 h-5" aria-hidden="true" />
                    {isActive('/') && <motion.div layoutId="navDot" className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />}
                  </Link>
                  <Link 
                    to="/messages" 
                    aria-label={`Secure Messages ${unreadMessages > 0 ? `(${unreadMessages} unread)` : ''}`}
                    aria-current={isActive('/messages') ? 'page' : undefined}
                    className={`p-2.5 rounded-xl transition-all relative group ${isActive('/messages') ? 'text-white' : 'text-slate-600 hover:text-white'}`}
                  >
                    <MessageSquare className="w-5 h-5" aria-hidden="true" />
                    {unreadMessages > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-500 border-2 border-[#0a0f1e] rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>}
                    {isActive('/messages') && <motion.div layoutId="navDot" className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />}
                  </Link>
                  <Link 
                    to="/notifications" 
                    aria-label={`System Alerts ${unreadCount > 0 ? `(${unreadCount} new)` : ''}`}
                    aria-current={isActive('/notifications') ? 'page' : undefined}
                    className={`p-2.5 rounded-xl transition-all relative group ${isActive('/notifications') ? 'text-white' : 'text-slate-600 hover:text-white'}`}>
                    <Bell className={`w-5 h-5 ${(unreadCount > 0 && !isActive('/notifications')) && 'group-hover:animate-pulse'}`} aria-hidden="true" />
                    {unreadCount > 0 && <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-[#0a0f1e] rounded-full"></span>}
                    {isActive('/notifications') && <motion.div layoutId="navDot" className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />}
                  </Link>
                  <Link 
                    to="/create-post" 
                    aria-label="Initialize Transmission (Create Post)"
                    aria-current={isActive('/create-post') ? 'page' : undefined}
                    className={`p-2.5 rounded-xl transition-all relative ${isActive('/create-post') ? 'text-white' : 'text-slate-600 hover:text-white'}`}
                  >
                    <PlusSquare className="w-5 h-5" aria-hidden="true" />
                    {isActive('/create-post') && <motion.div layoutId="navDot" className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full" />}
                  </Link>
                </div>

                {/* Profile Identity */}
                <Link 
                  to={`/profile/${user?._id}`} 
                  aria-label={`View your profile, ${user?.name}`}
                  aria-current={isActive(`/profile/${user?._id}`) ? 'page' : undefined}
                  className={`ml-4 pl-4 border-l border-white/[0.08] hidden sm:flex items-center gap-3 group transition-all`}
                >
                  <div className="relative">
                    <img 
                      src={user?.profilePicture} 
                      alt="Identity" 
                      className={`w-9 h-9 rounded-2xl object-cover shadow-2xl ring-2 transition-all duration-500 group-hover:scale-105 ${isActive(`/profile/${user?._id}`) ? 'ring-blue-500 shadow-blue-500/20' : 'ring-white/10 group-hover:ring-blue-500/30'}`} 
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-[3px] border-[#0a0f1e] rounded-full"></div>
                  </div>
                  <div className="hidden xl:flex flex-col min-w-[80px]">
                    <div className="flex items-center gap-2">
                      <span className={`text-[13px] font-black leading-none tracking-tight group-hover:text-blue-400 transition-colors ${isActive(`/profile/${user?._id}`) ? 'text-white' : 'text-slate-400'}`}>
                        {user?.name?.split(' ')[0]}
                      </span>
                      <ProBadge className="scale-[0.7] -ml-1" />
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                       <Zap className="w-2.5 h-2.5 text-blue-500" />
                       <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">Level {user?.role === 'admin' ? 'Inf' : '1'} Scholar</span>
                    </div>
                  </div>
                </Link>

                <div className="ml-2 flex items-center gap-1">
                   <ThemeToggle />
                   <button 
                    onClick={logout}
                    className="p-2.5 text-slate-700 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all duration-300 hidden lg:flex"
                   >
                    <LogOut className="w-5 h-5" />
                   </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <Link to="/login" className="px-5 py-2.5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">
                  Sign In
                </Link>
                <Link to="/register" className="hidden sm:block px-6 py-3 text-[11px] font-black uppercase tracking-widest bg-white text-[#060a14] rounded-2xl hover:bg-blue-50 transition-all shadow-xl active:scale-95">
                  Authorize Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
