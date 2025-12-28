
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import Listing from './pages/Listing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import AdminDashboard from './components/AdminDashboard';
import AIChatAssistant from './components/AIChatAssistant';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserRole } from './types';
import { motion } from 'framer-motion';

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: UserRole[] }> = ({ children, roles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (!user) {
    if (roles?.includes(UserRole.ADMIN)) {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/sign-in" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen relative text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col overflow-x-hidden font-sans">
    
    {/* Dynamic Background Layer */}
    <div className="fixed inset-0 -z-10 h-full w-full transition-colors duration-500 overflow-hidden bg-white dark:bg-slate-950">
        
        {/* Base Gradient - Light Mode (Vibrant Aurora) */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-cyan-50 to-indigo-50 dark:hidden opacity-90"></div>
        
        {/* Base Gradient - Dark Mode (Deep Glow) */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 hidden dark:block opacity-100"></div>

        {/* Dot Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.1] dark:opacity-[0.1]"></div>
        
        {/* Animated Gradient Blobs - Light Mode */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-300/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob dark:hidden"></div>
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyan-300/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000 dark:hidden"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-300/40 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000 dark:hidden"></div>

        {/* Dark Mode Glows */}
        <div className="hidden dark:block absolute top-0 -left-4 w-96 h-96 bg-emerald-500/20 rounded-full mix-blend-screen filter blur-[128px] animate-pulse"></div>
        <div className="hidden dark:block absolute bottom-0 -right-4 w-96 h-96 bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[128px] animate-pulse animation-delay-2000"></div>
    </div>
    
    <Navbar />
    <div className="flex-grow relative z-10 pb-20">
      {children}
    </div>
    <AIChatAssistant />
    <Footer />

    {/* Persistent Fixed Contact Footer - Floating Pill Design */}
    <motion.div 
      initial={{ y: 100, x: '-50%', opacity: 0 }}
      animate={{ y: 0, x: '-50%', opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-6 py-2.5 rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-slate-800/60 shadow-2xl flex items-center gap-3 whitespace-nowrap hover:bg-white/90 dark:hover:bg-slate-800 transition-all duration-300 group"
    >
      <div className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
      </div>
      
      <p className="text-[11px] sm:text-xs font-medium text-slate-600 dark:text-slate-300">
        for more details contact the developer at 
        <a 
          href="mailto:sathwikpamu@gmail.com" 
          className="ml-1.5 text-slate-900 dark:text-white font-bold hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors underline underline-offset-4 decoration-emerald-500/20 hover:decoration-emerald-500/50"
        >
          sathwikpamu@gmail.com
        </a>
      </p>
    </motion.div>
  </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/listing/:listingId" element={<Listing />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-listing" 
              element={
                <ProtectedRoute>
                  <CreateListing />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-listing/:listingId" 
              element={
                <ProtectedRoute>
                  <EditListing />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute roles={[UserRole.ADMIN]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
