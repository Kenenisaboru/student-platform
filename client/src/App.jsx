import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import SearchResults from './pages/SearchResults';
import PostDetail from './pages/PostDetail';
import FloatingFocusHub from './components/FloatingFocusHub';
import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={`flex-grow ${user ? "pt-24 sm:pt-32 pb-10 container mx-auto px-4 max-w-6xl" : "pt-20 sm:pt-28"}`}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          
          <Route path="/profile/:id" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/create-post" element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          } />
          
          <Route path="/post/:id" element={
            <ProtectedRoute>
              <PostDetail />
            </ProtectedRoute>
          } />
          
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />

          <Route path="/search" element={
            <ProtectedRoute>
              <SearchResults />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
        </Routes>
      </main>
      <FloatingFocusHub />
      <Footer />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Toaster position="top-center" richColors />
          <AppContent />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
