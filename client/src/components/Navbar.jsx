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
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50">
      <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary-600">
          Arsi Aseko Net
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative">
          <input
            type="text"
            placeholder="Search students, posts..."
            className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-primary-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-slate-400 w-5 h-5" />
        </form>

        <div className="flex items-center space-x-2 md:space-x-6">
          <Link to="/" title="Home" className="p-2 text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-full transition-colors">
            <Home className="w-6 h-6" />
          </Link>
          <Link to="/notifications" title="Notifications" className="p-2 text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-full transition-colors relative">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          </Link>
          <Link to="/create-post" title="Create Post" className="p-2 text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-full transition-colors">
            <PlusSquare className="w-6 h-6" />
          </Link>
          <Link to={`/profile/${user?._id}`} title="Profile" className="p-1 hover:ring-2 hover:ring-primary-500 rounded-full transition-all">
            <img 
              src={user?.profilePicture} 
              alt={user?.name} 
              className="w-8 h-8 rounded-full object-cover" 
            />
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" title="Admin Panel" className="p-2 text-slate-600 hover:text-primary-600 hover:bg-slate-50 rounded-full transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </Link>
          )}
          <button 
            onClick={logout}
            title="Logout"
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
