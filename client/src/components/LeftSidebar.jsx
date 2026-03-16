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
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

const LeftSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  const mainNav = [
    { path: '/', icon: Home, label: 'Home Feed' },
    { path: '/search?q=', icon: Search, label: 'Explore', matchPath: '/search' },
    { path: '/notifications', icon: Bell, label: 'Notifications', badge: true },
    { path: '/create-post', icon: PlusSquare, label: 'Create Post' },
    { path: `/profile/${user?._id}`, icon: User, label: 'My Profile' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const quickLinks = [
    { icon: TrendingUp, label: 'Trending Tags', color: 'text-amber-400' },
    { icon: BookOpen, label: 'Study Groups', color: 'text-emerald-400' },
    { icon: Hash, label: 'Topics', color: 'text-purple-400' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 sticky top-24 h-[calc(100vh-7rem)] overflow-y-auto pr-2 pb-8 scrollbar-thin" id="left-sidebar">
      {/* Profile Quick Card */}
      <Link
        to={`/profile/${user?._id}`}
        className="group flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.04] hover:border-white/[0.08] transition-all duration-300 mb-6"
      >
        <div className="relative">
          <img
            src={user?.profilePicture}
            alt={user?.name}
            className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/10 group-hover:ring-blue-500/30 transition-all"
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0a0f1e]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-sm truncate group-hover:text-blue-300 transition-colors">
            {user?.name}
          </p>
          <p className="text-[11px] font-medium text-slate-500 truncate">
            {user?.university || 'Student'}
          </p>
        </div>
      </Link>

      {/* Main Navigation */}
      <nav className="space-y-1 mb-8">
        {mainNav.map((item) => {
          const active = item.matchPath
            ? location.pathname === item.matchPath
            : isActive(item.path);
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              to={item.path}
              className={`group flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-[13px] transition-all duration-200 relative ${
                active
                  ? 'bg-blue-500/10 text-blue-400 shadow-inner'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
              id={`sidebar-nav-${item.label.toLowerCase().replace(/\s/g, '-')}`}
            >
              {active && (
                <motion.div
                  layoutId="sidebarActiveIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-400 rounded-r-full"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Icon className={`w-[18px] h-[18px] transition-transform duration-200 ${active ? '' : 'group-hover:scale-110'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto w-5 h-5 bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded-full flex items-center justify-center">
                  3
                </span>
              )}
            </Link>
          );
        })}

        {user?.role === 'admin' && (
          <Link
            to="/admin"
            className={`group flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-[13px] transition-all duration-200 ${
              isActive('/admin')
                ? 'bg-indigo-500/10 text-indigo-400'
                : 'text-indigo-400/70 hover:text-indigo-300 hover:bg-indigo-500/5'
            }`}
            id="sidebar-nav-admin"
          >
            <ShieldCheck className="w-[18px] h-[18px]" />
            <span>Admin Panel</span>
          </Link>
        )}
      </nav>

      {/* Quick Links */}
      <div className="mb-8">
        <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.15em] px-4 mb-3">
          Quick Access
        </h4>
        {quickLinks.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/[0.03] transition-all text-[13px] font-medium"
          >
            <item.icon className={`w-4 h-4 ${item.color}`} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Upgrade Card */}
      <div className="mx-2 mb-6 p-5 rounded-2xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl" />
        <div className="relative">
          <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3">
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <h4 className="font-bold text-white text-sm mb-1">Nexus Pro</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
            You're using the premium version of Arsi Aseko Network.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" />
            </div>
            <span className="text-[10px] text-blue-400 font-bold shrink-0">75%</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all text-[13px] font-semibold mt-auto"
        id="sidebar-logout"
      >
        <LogOut className="w-[18px] h-[18px]" />
        Sign Out
      </button>
    </aside>
  );
};

export default LeftSidebar;
