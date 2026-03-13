import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Home, Bell, User, PlusSquare, Search, LogOut, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

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
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm z-50 transition-all duration-300">
      <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between">
        <Link to="/" className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          <span className="hidden sm:inline">Arsi Aseko Net</span>
          <span className="sm:hidden">AAN</span>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative group">
          <input
            type="text"
            placeholder="Search students, posts..."
            className="w-full bg-slate-100/80 hover:bg-slate-100 border border-transparent rounded-full py-2.5 pl-11 pr-4 text-sm focus:bg-white focus:border-primary-200 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-4 top-3 text-slate-400 group-focus-within:text-primary-500 w-4 h-4 transition-colors" />
        </form>

        <div className="flex items-center space-x-1 sm:space-x-3">
          <Link to="/" title="Home" className="p-2 sm:p-2.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300">
            <Home className="w-5 h-5 sm:w-5 sm:h-5" />
          </Link>
          <Link to="/notifications" title="Notifications" className="p-2 sm:p-2.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 relative">
            <Bell className="w-5 h-5 sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2.5 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
          </Link>
          <Link to="/create-post" title="Create Post" className="p-2 sm:p-2.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300">
            <PlusSquare className="w-5 h-5 sm:w-5 sm:h-5" />
          </Link>
          <Link to={`/profile/${user?._id}`} title="Profile" className="p-1 hover:ring-2 hover:ring-primary-500 rounded-full transition-all duration-300 sm:ml-2">
            <img 
              src={user?.profilePicture} 
              alt={user?.name} 
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover shadow-sm" 
            />
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" title="Admin Panel" className="p-2 sm:p-2.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 sm:ml-1 hidden sm:flex">
              <ShieldCheck className="w-5 h-5 sm:w-5 sm:h-5" />
            </Link>
          )}
          <button 
            onClick={logout}
            title="Logout"
            className="p-2 sm:p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 sm:ml-1"
          >
            <LogOut className="w-5 h-5 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
