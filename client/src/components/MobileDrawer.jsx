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
  X,
  TrendingUp,
  BookOpen,
  Settings,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MobileDrawer = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', icon: Home, label: 'Home Feed' },
    { path: '/search?q=', icon: Search, label: 'Explore', matchPath: '/search' },
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/create-post', icon: PlusSquare, label: 'Create Post' },
    { path: `/profile/${user?._id}`, icon: User, label: 'My Profile' },
    { path: '/messages', icon: MessageSquare, label: 'Messages' },
  ];

  const handleNavClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 w-[300px] bg-[#0a0f1e]/95 backdrop-blur-2xl border-r border-white/[0.06] z-[61] flex flex-col overflow-y-auto"
            id="mobile-drawer"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/[0.05]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <span className="font-extrabold text-white text-sm">AA</span>
                </div>
                <div>
                  <p className="font-extrabold text-white text-sm leading-none">Arsi Aseko</p>
                  <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">
                    Nexus Pro
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Card */}
            <Link
              to={`/profile/${user?._id}`}
              onClick={handleNavClick}
              className="m-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] flex items-center gap-3.5 group hover:bg-white/[0.06] transition-all"
            >
              <img
                src={user?.profilePicture}
                alt={user?.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/10"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white text-sm truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">
                  {user?.university} · {user?.department}
                </p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="px-3 space-y-0.5 flex-1">
              {navItems.map((item) => {
                const active = item.matchPath
                  ? location.pathname === item.matchPath
                  : isActive(item.path);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={handleNavClick}
                    className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-semibold text-[14px] transition-all duration-200 ${
                      active
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={handleNavClick}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-semibold text-[14px] transition-all duration-200 ${
                    isActive('/admin')
                      ? 'bg-indigo-500/10 text-indigo-400'
                      : 'text-indigo-400/70 hover:text-indigo-300 hover:bg-indigo-500/5'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Admin Panel</span>
                </Link>
              )}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-white/[0.05] space-y-1">
              <Link 
                to="/settings"
                onClick={handleNavClick}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-all text-[13px] font-medium"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all text-[13px] font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileDrawer;
