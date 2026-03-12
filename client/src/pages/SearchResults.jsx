import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import { Loader2, Search, User } from 'lucide-react';

const SearchResults = () => {
  const [results, setResults] = useState({ users: [], posts: [] });
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        // Mock search: Fetch all and filter client side for better UX in this demo
        // In real app, create a dedicated search endpoint
        const [usersRes, postsRes] = await Promise.all([
          API.get(`/users/search?search=${query}`),
          API.get('/posts')
        ]);
        
        setResults({
          users: usersRes.data,
          posts: postsRes.data.filter(p => 
            p.title.toLowerCase().includes(query.toLowerCase()) || 
            p.content.toLowerCase().includes(query.toLowerCase())
          )
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  if (loading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex items-center space-x-3 mb-8">
        <Search className="w-6 h-6 text-slate-400" />
        <h1 className="text-2xl font-bold text-slate-900">
          Search results for "<span className="text-primary-600">{query}</span>"
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Results columns */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-bold text-slate-700 px-2 uppercase tracking-wider">Posts ({results.posts.length})</h2>
          {results.posts.length > 0 ? (
            results.posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))
          ) : (
            <p className="p-8 bg-white rounded-2xl text-slate-500 border border-slate-200">No matching posts found.</p>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-700 px-2 uppercase tracking-wider">Students ({results.users.length})</h2>
          {results.users.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              {results.users.map(u => (
                <Link 
                  key={u._id} 
                  to={`/profile/${u._id}`}
                  className="flex items-center space-x-3 p-4 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors"
                >
                  <img src={u.profilePicture} className="w-12 h-12 rounded-full object-cover" alt="" />
                  <div>
                    <p className="font-bold text-slate-900">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.university}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="p-8 bg-white rounded-2xl text-slate-500 border border-slate-200">No matching students found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
