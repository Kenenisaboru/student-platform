import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import MobileBottomNav from './components/MobileBottomNav';
import MobileDrawer from './components/MobileDrawer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import AdminDashboard from './pages/AdminDashboard';
import SearchResults from './pages/SearchResults';
import PostDetail from './pages/PostDetail';
import FloatingFocusHub from './components/FloatingFocusHub';
import { Toaster } from 'sonner';
import { HelmetProvider } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
  if (!user || user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

// Pages that should NOT show the 3-column layout
const FULL_WIDTH_PAGES = ['/login', '/register'];

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const isFullWidthPage = FULL_WIDTH_PAGES.includes(location.pathname);
  const showLayout = user && !isFullWidthPage;

  return (
    <div className="min-h-screen flex flex-col bg-[#060a14]">
      <Navbar onMenuToggle={() => setDrawerOpen(true)} />
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {showLayout ? (
        /* ===== 3-Column Layout ===== */
        <div className="flex-grow pt-[6.5rem] sm:pt-[7.5rem]">
          <div className="mx-auto max-w-7xl px-4 flex gap-6">
            {/* Left Sidebar */}
            <LeftSidebar />

            {/* Main Content */}
            <main className="flex-1 min-w-0 pb-24 lg:pb-10">
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={
                    <ProtectedRoute>
                      <PageTransition><Home /></PageTransition>
                    </ProtectedRoute>
                  } />
                  <Route path="/profile/:id" element={
                    <ProtectedRoute>
                      <PageTransition><Profile /></PageTransition>
                    </ProtectedRoute>
                  } />
                  <Route path="/create-post" element={
                    <ProtectedRoute>
                      <PageTransition><CreatePost /></PageTransition>
                    </ProtectedRoute>
                  } />
                  <Route path="/post/:id" element={
                    <ProtectedRoute>
                      <PageTransition><PostDetail /></PageTransition>
                    </ProtectedRoute>
                  } />
                  <Route path="/notifications" element={
                    <ProtectedRoute>
                      <PageTransition><Notifications /></PageTransition>
                    </ProtectedRoute>
                  } />
                  <Route path="/messages" element={
                    <ProtectedRoute>
                      <PageTransition><Messages /></PageTransition>
                    </ProtectedRoute>
                  } />
                  <Route path="/messages/:id" element={
                    <ProtectedRoute>
                      <PageTransition><Messages /></PageTransition>
                    </ProtectedRoute>
                  } />
                  <Route path="/search" element={
                    <ProtectedRoute>
                      <PageTransition><SearchResults /></PageTransition>
                    </ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <AdminRoute>
                      <PageTransition><AdminDashboard /></PageTransition>
                    </AdminRoute>
                  } />
                </Routes>
              </AnimatePresence>
            </main>

            {/* Right Sidebar */}
            <RightSidebar />
          </div>
        </div>
      ) : (
        /* ===== Full Width (Login/Register) ===== */
        <main className="flex-grow">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
          </Routes>
        </main>
      )}

      {showLayout && <MobileBottomNav />}
      <FloatingFocusHub />
      {showLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Toaster 
            position="top-center" 
            richColors 
            toastOptions={{
              style: {
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.06)',
                color: '#e2e8f0',
              }
            }}
          />
          <AppContent />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
