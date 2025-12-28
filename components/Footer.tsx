import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Github, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 text-slate-600 dark:text-slate-400 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                HomeStead<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-blue-500">Haven</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              The premier marketplace for luxury rentals and dream homes. 
              Experience the comfort of modern living with our curated selection of properties.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://github.com/sathwik-70" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 transition-colors"><Github size={18} /></a>
              <a href="https://linkedin.com/in/sathwikpamu" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 transition-colors"><Linkedin size={18} /></a>
              <a href="mailto:sathwikpamu@gmail.com" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-emerald-600 transition-colors"><Mail size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Home</Link></li>
              <li><Link to="/properties" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Browse Properties</Link></li>
              <li><Link to="/sign-in" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Sign In</Link></li>
              <li><Link to="/create-listing" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">List Your Property</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-6">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Safety Information</a></li>
              <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Cancellation Options</a></li>
              <li><a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Report Issue</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white mb-6">Developer Contact</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-emerald-500 shrink-0" />
                <span>Hyderabad, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Github size={18} className="text-emerald-500 shrink-0" />
                <a href="https://github.com/sathwik-70" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 dark:hover:text-emerald-400">github.com/sathwik-70</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-emerald-500 shrink-0" />
                <a href="mailto:sathwikpamu@gmail.com" className="hover:text-emerald-600 dark:hover:text-emerald-400">sathwikpamu@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            © {new Date().getFullYear()} HomeStead Haven. Developed by <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Sathwik Pamu</span>.
          </p>
          <div className="flex gap-6 text-xs text-slate-400 dark:text-slate-500">
            <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-600 dark:hover:text-emerald-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;