import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate('/properties'); 
      setIsMobileMenuOpen(false);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const getLinkClasses = (path: string) => {
    return isActive(path) 
      ? 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500' 
      : 'font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-900/70 backdrop-blur-lg shadow-sm border-b border-white/20 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group min-w-fit">
            <span className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight transition-colors">
              HomeStead<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">Haven</span>
            </span>
          </Link>

          {/* Central Search Bar (Desktop) */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-white/50 dark:bg-slate-800/50 rounded-full px-4 py-2.5 w-full max-w-md mx-8 shadow-sm border border-slate-200/50 dark:border-slate-700 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 dark:focus-within:border-emerald-500 transition-all group backdrop-blur-sm">
            <input 
              type="text" 
              placeholder="Search properties..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none focus:outline-none w-full text-slate-700 dark:text-slate-200 placeholder-slate-400 text-sm"
            />
            <button type="submit" className="text-slate-400 group-focus-within:text-emerald-500 hover:text-emerald-600 transition-colors">
              <Search size={18} />
            </button>
          </form>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={getLinkClasses('/')}>
              Home
            </Link>
            <Link to="/properties" className={getLinkClasses('/properties')}>
              Properties
            </Link>
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors"
            >
              {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
            </button>
            
            {user ? (
              <Link to="/profile" className="relative group ml-2">
                 <div className="p-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 transition-transform group-hover:scale-105 shadow-md shadow-emerald-500/20">
                   <img src={user.avatar} alt="Profile" className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 object-cover" />
                 </div>
              </Link>
            ) : (
              <Link to="/sign-in" className={getLinkClasses('/sign-in')}>
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-600" />}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="text-slate-600 dark:text-slate-300 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 dark:bg-slate-900/95 border-b border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-300 shadow-xl backdrop-blur-xl"
          >
            <div className="px-4 pt-4 pb-6 space-y-4">
              <form onSubmit={handleSearch} className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-3 border border-slate-200 dark:border-slate-700 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all">
                <input 
                  type="text" 
                  placeholder="Search properties..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none focus:outline-none w-full text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400"
                />
                <button type="submit" className="text-slate-400">
                    <Search size={18} />
                </button>
              </form>
              <div className="space-y-2">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`block py-2 px-2 rounded-lg ${isActive('/') ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-600 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>Home</Link>
                <Link to="/properties" onClick={() => setIsMobileMenuOpen(false)} className={`block py-2 px-2 rounded-lg ${isActive('/properties') ? 'bg-emerald-50 dark:bg-slate-800 text-emerald-600 font-bold' : 'text-slate-600 dark:text-slate-300'}`}>Properties</Link>
              </div>
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                {user ? (
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                        <img src={user.avatar} alt="" className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700" />
                        <div>
                            <p className="font-bold text-slate-800 dark:text-white text-sm">{user.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">View Profile</p>
                        </div>
                    </Link>
                ) : (
                    <Link to="/sign-in" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm">Sign In</Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;