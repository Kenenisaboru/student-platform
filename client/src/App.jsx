import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { lazy, Suspense, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LeftSidebar from './components/LeftSidebar';
import RightSidebar from './components/RightSidebar';
import MobileBottomNav from './components/MobileBottomNav';
import MobileDrawer from './components/MobileDrawer';
import FloatingFocusHub from './components/FloatingFocusHub';
import InstallPWA from './components/InstallPWA';
import LoadingPage from './components/LoadingPage';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Profile = lazy(() => import('./pages/Profile'));
const CreatePost = lazy(() => import('./pages/CreatePost'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Messages = lazy(() => import('./pages/Messages'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const PostDetail = lazy(() => import('./pages/PostDetail'));
const ResourceLibrary = lazy(() => import('./pages/ResourceLibrary'));
const VirtualID = lazy(() => import('./pages/VirtualID'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Settings = lazy(() => import('./pages/Settings'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
// New Pages
const Events = lazy(() => import('./pages/Events'));
const CampusGallery = lazy(() => import('./pages/CampusGallery'));
const About = lazy(() => import('./pages/About'));
const AcademicCalendar = lazy(() => import('./pages/AcademicCalendar'));
const Announcements = lazy(() => import('./pages/Announcements'));
const CommunityDirectory = lazy(() => import('./pages/CommunityDirectory'));
const CommunityInitiatives = lazy(() => import('./pages/CommunityInitiatives'));

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
const isFullWidthPath = (path) => {
  const prefixes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
  return prefixes.some(prefix => path.startsWith(prefix));
};

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

  const showLayout = user && !isFullWidthPath(location.pathname);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
      <Navbar onMenuToggle={() => setDrawerOpen(true)} />
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <Suspense fallback={<LoadingPage />}>
        {showLayout ? (
          /* ===== 3-Column Layout ===== */
          <div className="flex-grow pt-[6.5rem] sm:pt-[7.5rem]">
            <div className="mx-auto max-w-7xl px-4 flex gap-6">
              <LeftSidebar />
              <main className="flex-1 min-w-0 pb-24 lg:pb-10">
                <AnimatePresence mode="wait">
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<ProtectedRoute><PageTransition><Home /></PageTransition></ProtectedRoute>} />
                    <Route path="/profile/:id" element={<ProtectedRoute><PageTransition><Profile /></PageTransition></ProtectedRoute>} />
                    <Route path="/create-post" element={<ProtectedRoute><PageTransition><CreatePost /></PageTransition></ProtectedRoute>} />
                    <Route path="/post/:id" element={<ProtectedRoute><PageTransition><PostDetail /></PageTransition></ProtectedRoute>} />
                    <Route path="/notifications" element={<ProtectedRoute><PageTransition><Notifications /></PageTransition></ProtectedRoute>} />
                    <Route path="/messages" element={<ProtectedRoute><PageTransition><Messages /></PageTransition></ProtectedRoute>} />
                    <Route path="/messages/:id" element={<ProtectedRoute><PageTransition><Messages /></PageTransition></ProtectedRoute>} />
                    <Route path="/search" element={<ProtectedRoute><PageTransition><SearchResults /></PageTransition></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><PageTransition><Settings /></PageTransition></ProtectedRoute>} />
                    <Route path="/virtual-id" element={<ProtectedRoute><PageTransition><VirtualID /></PageTransition></ProtectedRoute>} />
                    <Route path="/library" element={<ProtectedRoute><PageTransition><ResourceLibrary /></PageTransition></ProtectedRoute>} />
                    <Route path="/admin" element={<AdminRoute><PageTransition><AdminDashboard /></PageTransition></AdminRoute>} />
                    <Route path="/events" element={<ProtectedRoute><PageTransition><Events /></PageTransition></ProtectedRoute>} />
                    <Route path="/gallery" element={<ProtectedRoute><PageTransition><CampusGallery /></PageTransition></ProtectedRoute>} />
                    <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                    <Route path="/academic-calendar" element={<ProtectedRoute><PageTransition><AcademicCalendar /></PageTransition></ProtectedRoute>} />
                    <Route path="/announcements" element={<ProtectedRoute><PageTransition><Announcements /></PageTransition></ProtectedRoute>} />
                    <Route path="/community-directory" element={<ProtectedRoute><PageTransition><CommunityDirectory /></PageTransition></ProtectedRoute>} />
                    <Route path="/community-initiatives" element={<ProtectedRoute><PageTransition><CommunityInitiatives /></PageTransition></ProtectedRoute>} />
                    <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
                  </Routes>
                </AnimatePresence>
              </main>
              <RightSidebar />
            </div>
          </div>
        ) : (
          /* ===== Full Width (Auth Pages) ===== */
          <main className="flex-grow">
            <Routes location={location} key={location.pathname}>
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
            </Routes>
          </main>
        )}
      </Suspense>

      {showLayout && <MobileBottomNav />}
      <FloatingFocusHub />
      <InstallPWA />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <AuthProvider>
          <Router>
            <Toaster 
              position="top-center" 
              richColors 
              toastOptions={{
                style: {
                  background: '#0a0f1e',
                  border: '1px solid rgba(255,255,255,0.06)',
                  color: '#e2e8f0',
                  borderRadius: '16px',
                }
              }}
            />
            <SocketProvider>
              <AppContent />
            </SocketProvider>
          </Router>
        </AuthProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
