
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
  <div className="min-h-screen relative text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col overflow-x-hidden font-sans pb-10">
    
    {/* Dynamic Background Layer */}
    <div className="fixed inset-0 -z-10 h-full w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-500 overflow-hidden">
        {/* Dot Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.4] dark:opacity-[0.1]"></div>
        
        {/* Animated Gradient Blobs - Light Mode */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob dark:hidden"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 dark:hidden"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-4000 dark:hidden"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-blob animation-delay-2000 dark:hidden"></div>

        {/* Animated Gradient Blobs - Dark Mode */}
        <div className="hidden dark:block absolute top-0 -left-4 w-96 h-96 bg-emerald-900/40 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-blob"></div>
        <div className="hidden dark:block absolute bottom-0 -right-4 w-96 h-96 bg-indigo-900/40 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>
    </div>
    
    <Navbar />
    <div className="flex-grow relative z-10">
      {children}
    </div>
    <AIChatAssistant />
    <Footer />

    {/* Persistent Fixed Contact Footer - Refined Style */}
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white/40 dark:bg-slate-950/40 backdrop-blur-xl border-t border-white/20 dark:border-slate-800/50 py-2.5 px-4 text-center">
      <p className="text-[10px] sm:text-xs font-medium text-slate-500/80 dark:text-slate-400/80 tracking-normal">
        Developed by <span className="text-slate-800 dark:text-slate-200 font-bold">Sathwik Pamu</span> 
        <span className="mx-2 text-slate-300 dark:text-slate-700">|</span> 
        Contact: <a href="mailto:sathwikpamu@gmail.com" className="text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors decoration-emerald-500/30 underline underline-offset-4 decoration-2 select-all">sathwikpamu@gmail.com</a>
      </p>
    </div>
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
