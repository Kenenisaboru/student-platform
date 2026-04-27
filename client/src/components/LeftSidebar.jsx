import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Bell,
  PlusSquare,
  User,
  Search,
  ShieldCheck,
  LogOut,
  TrendingUp,
  BookOpen,
  Hash,
  Sparkles,
  MessageSquare,
  Settings,
  CreditCard,
  ChevronRight,
  Calendar,
  Image as ImageIcon,
  Users,
  Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

const LeftSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  const mainNav = [
    { path: '/', icon: Home, label: 'Home Feed' },
    { path: '/search?q=', icon: Search, label: 'Explore Ecosystem', matchPath: '/search' },
    { path: '/events', icon: Calendar, label: 'Events & Calendar' },
    { path: '/gallery', icon: ImageIcon, label: 'Campus Gallery' },
    { path: '/notifications', icon: Bell, label: 'Notifications', badge: true },
    { path: '/messages', icon: MessageSquare, label: 'Portal Chat' },
    { path: '/library', icon: BookOpen, label: 'Resource Vault' },
    { path: '/virtual-id', icon: CreditCard, label: 'Digital ID Card' },
    { path: '/settings', icon: Settings, label: 'Advanced Settings' },
  ];

  const communityNav = [
    { path: '/community-directory', icon: Users, label: 'Community Directory' },
    { path: '/community-initiatives', icon: Zap, label: 'Initiatives & Programs' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[280px] shrink-0 sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto lg:pr-4 pb-12 scrollbar-thin" id="left-sidebar">
      
      {/* Premium Profile Card */}
      <Link
        to={`/profile/${user?._id}`}
        className="group relative p-[1px] rounded-[2rem] bg-gradient-to-br from-white/10 via-transparent to-white/5 mb-8 overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
      >
        <div className="relative z-10 bg-[#0d1428] backdrop-blur-xl rounded-[2rem] p-5 flex items-center gap-4 border border-white/[0.04]">
          <div className="relative shrink-0">
            <img
              src={user?.profilePicture}
              alt={user?.name}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-blue-500/40 transition-all duration-500"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-[3px] border-[#0d1428] shadow-sm shadow-emerald-500/50" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-white text-[15px] truncate tracking-tight group-hover:text-blue-300 transition-colors">
              {user?.name}
            </p>
            <p className="text-[10px] font-bold text-slate-500 truncate uppercase tracking-widest mt-0.5">
              {user?.university || 'Scholar'}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        </div>
        {/* Hover Inner Glow */}
        <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
      </Link>

      {/* Navigation Headers */}
      <div className="px-5 mb-4">
        <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Core Directives</h4>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-1.5 mb-10 px-1">
        {mainNav.map((item) => {
          const active = item.matchPath
            ? location.pathname.startsWith(item.matchPath)
            : isActive(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-[13px] tracking-tight transition-all relative overflow-hidden ${
                active
                  ? 'bg-blue-600/10 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="navGlow"
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                />
              )}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              )}
              
              <Icon className={`w-5 h-5 transition-all duration-300 ${active ? 'text-blue-400 scale-110' : 'group-hover:scale-110 group-hover:text-blue-400'}`} />
              <span className="relative z-10">{item.label}</span>
              
              {item.badge && (
                <span className="ml-auto w-5 h-5 bg-rose-500/20 text-rose-400 text-[10px] font-black rounded-full flex items-center justify-center border border-rose-500/10">
                  +
                </span>
              )}
            </Link>
          );
        })}

        {user?.role === 'admin' && (
          <Link
            to="/admin"
            className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-[13px] tracking-tight transition-all ${
              isActive('/admin')
                ? 'bg-indigo-600/10 text-white'
                : 'text-indigo-400/80 hover:text-indigo-300 hover:bg-indigo-600/5 border border-transparent hover:border-indigo-500/10'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Admin Terminal</span>
          </Link>
        )}
      </nav>

      {/* Community Section Header */}
      <div className="px-5 mb-4">
        <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Arsi Aseko Community</h4>
      </div>

      {/* Community Navigation */}
      <nav className="space-y-1.5 mb-10 px-1">
        {communityNav.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-[13px] tracking-tight transition-all relative overflow-hidden ${
                active
                  ? 'bg-emerald-600/10 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="communityNavGlow"
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                />
              )}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              )}
              
              <Icon className={`w-5 h-5 transition-all duration-300 ${active ? 'text-emerald-400 scale-110' : 'group-hover:scale-110 group-hover:text-emerald-400'}`} />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Pro Platform Status */}
      <div className="mx-2 mb-10 p-6 rounded-[2.5rem] bg-[#0d1428] border border-white/[0.05] relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-600/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-9 h-9 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-600/20">
                <Sparkles className="w-4 h-4 text-gradient bg-clip-text text-blue-400" />
             </div>
             <div>
                <h4 className="font-black text-white text-xs tracking-tighter">Portal Pro</h4>
                <div className="flex items-center gap-1.5">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Active Status</span>
                </div>
             </div>
          </div>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-5">
            Arsi Aseko University's official student communication environment is online.
          </p>
          <Link to="/library" className="w-full py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group-hover:border-blue-500/30">
            Verify Network <ChevronRight className="w-3 h-3 text-blue-500" />
          </Link>
        </div>
      </div>

      {/* Logout Strategy */}
      <button
        onClick={logout}
        className="flex items-center gap-4 px-6 py-4 text-slate-600 hover:text-rose-400 hover:bg-rose-500/5 rounded-[1.5rem] transition-all text-xs font-black uppercase tracking-[0.15em] mt-auto border border-transparent hover:border-rose-500/10"
      >
        <LogOut className="w-4 h-4" />
        Terminate Session
      </button>
    </aside>
  );
};

export default LeftSidebar;
