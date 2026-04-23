import { Link, useLocation } from 'react-router-dom';
import { Home, Bell, PlusSquare, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const MobileBottomNav = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search?q=', icon: Search, label: 'Search' },
    { path: '/create-post', icon: PlusSquare, label: 'Post', isCreate: true },
    { path: '/notifications', icon: Bell, label: 'Alerts', hasBadge: true },
    { path: `/profile/${user?._id}`, icon: User, label: 'Profile' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path.startsWith('/search')) return location.pathname === '/search';
    return location.pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden" id="mobile-bottom-nav">
      {/* Frosted glass background */}
      <div className="absolute inset-0 bg-[#0a0f1e]/90 backdrop-blur-2xl border-t border-white/[0.06]" />
      
      {/* Safe area padding for notched devices */}
      <div className="relative flex items-center justify-around px-2 h-16 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          if (item.isCreate) {
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-label="Create Post"
                aria-current={active ? 'page' : undefined}
                className="relative -mt-5"
                id={`mobile-nav-${item.label.toLowerCase()}`}
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 ring-4 ring-[#0a0f1e]/80"
                >
                  <PlusSquare className="w-5 h-5 text-white" aria-hidden="true" />
                </motion.div>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              className="flex flex-col items-center justify-center py-2 px-3 relative group"
              id={`mobile-nav-${item.label.toLowerCase()}`}
            >
              <motion.div whileTap={{ scale: 0.85 }} className="relative">
                <Icon
                  aria-hidden="true"
                  className={`w-5 h-5 transition-colors duration-200 ${
                    active ? 'text-blue-400' : 'text-slate-500'
                  }`}
                />
                {item.hasBadge && (
                  <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#0a0f1e]" />
                )}
              </motion.div>

              <span
                className={`text-[10px] font-semibold mt-1 transition-colors duration-200 ${
                  active ? 'text-blue-400' : 'text-slate-600'
                }`}
              >
                {item.label}
              </span>

              {/* Active indicator */}
              {active && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute -top-0.5 w-5 h-0.5 rounded-full bg-blue-400"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
