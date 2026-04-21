import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Bell, User, PlusSquare, Search, LogOut, ShieldCheck, Sparkles, Menu, MessageSquare } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import API from '../api/axios';
import sharedSocket from '../utils/socket';
import { toast } from 'sonner';
import ThemeToggle from './ThemeToggle';

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

  // Initial fetch for unread counts & socket setup
  useEffect(() => {
    if (!user) return;

    // Fetch initial counts
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

    // Socket.io & Server Health configuration
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const serverRoot = apiBase.split('/api')[0] || 'http://localhost:5000';
    
    // Safety check: Use vanilla axios for health-check to avoid interceptor AUTH loops
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
      // Don't show toast if we are currently chatting with this user
      if (!pathnameRef.current.includes(`/messages/${data.conversationId}`)) {
        setUnreadMessages(prev => prev + 1);
        toast(`New message from ${data.message.sender.name}`, { icon: '💬' });
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
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* Top Banner — Desktop Only */}
      <div className="bg-[#060a14] text-white text-[10px] sm:text-xs font-semibold py-1.5 px-4 hidden sm:flex justify-between items-center z-50 border-b border-white/[0.04]">
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
          <div className="flex items-center space-x-3 text-blue-300/80">
            <div className="flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Empowering the modern student community</span>
            </div>
            <span className="opacity-20">|</span>
            <div className="flex items-center space-x-1.5">
              <div className={`w-1.5 h-1.5 rounded-full ${serverStatus === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
              <span className="text-slate-500 capitalize">{serverStatus}</span>
            </div>
          </div>
          <div className="flex space-x-4 text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Help Center</a>
            <a href="#" className="hover:text-white transition-colors">Resources</a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`transition-all duration-500 border-b ${scrolled ? 'bg-[#0a0f1e]/95 backdrop-blur-2xl border-white/[0.06] shadow-lg shadow-black/20' : 'bg-[#0a0f1e]/80 backdrop-blur-xl border-white/[0.03]'}`}>
        <div className="container mx-auto px-4 max-w-7xl h-16 flex items-center justify-between">
          
          {/* Left: Menu (mobile) + Logo */}
          <div className="flex items-center gap-3">
            {user && (
              <button
                onClick={onMenuToggle}
                className="lg:hidden p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
                id="mobile-menu-toggle"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-300">
                <span className="font-extrabold text-sm">CP</span>
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-base font-extrabold text-white leading-none tracking-tight">Communication</span>
                <span className="text-[9px] font-bold text-blue-400 uppercase tracking-[0.2em] mt-0.5">Platform Pro</span>
              </div>
            </Link>
          </div>

          {/* Center: Search Bar */}
          {user && (
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative group">
              <input
                type="text"
                placeholder="Search students, posts, tags..."
                className="w-full bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.1] rounded-xl py-2.5 pl-11 pr-4 text-sm focus:bg-white/[0.08] focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all duration-300 font-medium text-slate-300 placeholder:text-slate-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="search-input"
              />
              <Search className="absolute left-3.5 top-3 text-slate-600 group-focus-within:text-blue-400 w-4 h-4 transition-colors" />
            </form>
          )}

          {/* Right: Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {user ? (
              <>
                {/* Desktop-only nav icons */}
                <div className="hidden lg:flex items-center space-x-1">
                  <Link to="/" title="Home" className={`p-2.5 rounded-xl transition-all duration-300 ${isActive('/') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500 hover:text-blue-400 hover:bg-white/[0.04]'}`}>
                    <Home className="w-5 h-5" />
                  </Link>
                  <Link to="/messages" title="Messages" className={`p-2.5 rounded-xl transition-all duration-300 relative group ${isActive('/messages') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500 hover:text-blue-400 hover:bg-white/[0.04]'}`}>
                    <MessageSquare className="w-5 h-5" />
                    {unreadMessages > 0 && <span className="absolute top-2 right-2.5 w-2 h-2 bg-blue-500 border-2 border-[#0a0f1e] rounded-full"></span>}
                  </Link>
                  <Link to="/notifications" title="Notifications" className={`p-2.5 rounded-xl transition-all duration-300 relative group ${isActive('/notifications') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500 hover:text-blue-400 hover:bg-white/[0.04]'}`}>
                    <Bell className={`w-5 h-5 ${(unreadCount > 0 && !isActive('/notifications')) && 'group-hover:animate-[wiggle_1s_ease-in-out_infinite]'}`} />
                    {unreadCount > 0 && <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 border-2 border-[#0a0f1e] rounded-full"></span>}
                  </Link>
                  <Link to="/create-post" title="Create Post" className={`p-2.5 rounded-xl transition-all duration-300 ${isActive('/create-post') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500 hover:text-blue-400 hover:bg-white/[0.04]'}`}>
                    <PlusSquare className="w-5 h-5" />
                  </Link>
                </div>

                {/* Profile Link — Desktop */}
                <Link to={`/profile/${user?._id}`} title="Profile" className={`ml-2 pl-3 border-l border-white/[0.06] hidden sm:flex items-center space-x-2 transition-opacity ${isActive(`/profile/${user?._id}`) ? 'opacity-100' : 'hover:opacity-80'}`}>
                  <img 
                    src={user?.profilePicture} 
                    alt={user?.name} 
                    className={`w-8 h-8 rounded-lg object-cover shadow-sm ring-2 transition-all ${isActive(`/profile/${user?._id}`) ? 'ring-blue-500/30' : 'ring-white/10'}`} 
                  />
                  <div className="flex flex-col hidden lg:flex">
                    <span className={`text-sm font-bold leading-none ${isActive(`/profile/${user?._id}`) ? 'text-blue-400' : 'text-slate-300'}`}>{user?.name?.split(' ')[0]}</span>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">{user?.role}</span>
                  </div>
                </Link>

                {user?.role === 'admin' && (
                  <Link to="/admin" title="Admin Panel" className={`p-2.5 rounded-xl transition-all duration-300 hidden sm:flex ${isActive('/admin') ? 'text-indigo-400 bg-indigo-500/10' : 'text-indigo-400/50 hover:text-indigo-400 hover:bg-indigo-500/5'}`}>
                    <ShieldCheck className="w-5 h-5" />
                  </Link>
                )}

                <ThemeToggle />
                <button 
                  onClick={logout}
                  title="Logout"
                  className="p-2.5 text-slate-600 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all duration-300 hidden lg:flex"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link to="/login" className="px-4 py-2 text-sm font-bold text-slate-400 hover:text-white transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="hidden sm:block px-5 py-2.5 text-sm font-bold bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
