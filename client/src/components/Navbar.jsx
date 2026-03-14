import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Bell, User, PlusSquare, Search, LogOut, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white text-xs font-semibold py-1.5 px-4 hidden sm:flex justify-between items-center z-50">
        <div className="container mx-auto max-w-6xl flex justify-between items-center">
          <div className="flex items-center space-x-2 text-primary-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Empowering the students of Arsi Aseko</span>
          </div>
          <div className="flex space-x-4 text-slate-300">
            <a href="#" className="hover:text-white transition-colors">Help Center</a>
            <a href="#" className="hover:text-white transition-colors">Resources</a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 max-w-6xl h-16 sm:h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:rotate-6 transition-transform">
              <span className="font-extrabold text-lg">AA</span>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xl font-extrabold text-slate-900 leading-none tracking-tight">Arsi Aseko</span>
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest mt-0.5">Network</span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative group">
            <input
              type="text"
              placeholder="Search students, posts..."
              className="w-full bg-slate-100/70 hover:bg-slate-100 border-2 border-transparent rounded-full py-2.5 pl-12 pr-4 text-sm focus:bg-white focus:border-primary-300 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300 font-medium text-slate-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-4 top-3 text-slate-400 group-focus-within:text-primary-500 w-4 h-4 transition-colors" />
          </form>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {user ? (
              <>
                <Link to="/" title="Home" className="p-2.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300">
                  <Home className="w-5 h-5 sm:w-5 sm:h-5" />
                </Link>
                <Link to="/notifications" title="Notifications" className="p-2.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 relative group">
                  <Bell className="w-5 h-5 sm:w-5 sm:h-5 group-hover:animate-[wiggle_1s_ease-in-out_infinite]" />
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
                </Link>
                <Link to="/create-post" title="Create Post" className="p-2.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300">
                  <PlusSquare className="w-5 h-5 sm:w-5 sm:h-5" />
                </Link>

                {/* Profile Dropdown Trigger */}
                <Link to={`/profile/${user?._id}`} title="Profile" className="ml-2 pl-2 border-l border-slate-200 hidden sm:flex items-center space-x-2 hover:opacity-80 transition-opacity">
                  <img 
                    src={user?.profilePicture} 
                    alt={user?.name} 
                    className="w-9 h-9 rounded-full object-cover shadow-sm border-2 border-white ring-2 ring-slate-100" 
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-700 leading-none">{user?.name?.split(' ')[0]}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user?.role}</span>
                  </div>
                </Link>

                {user?.role === 'admin' && (
                  <Link to="/admin" title="Admin Panel" className="p-2.5 text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-300 hidden sm:flex border border-indigo-100/50">
                    <ShieldCheck className="w-5 h-5" />
                  </Link>
                )}

                <button 
                  onClick={logout}
                  title="Logout"
                  className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-300 sm:ml-2"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-bold text-slate-600 hover:text-primary-600 transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="hidden sm:block px-5 py-2.5 text-sm font-bold bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5">
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
