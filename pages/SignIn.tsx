import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signInWithEmail(formData.email, formData.password);
    if (res.error) {
      setError(res.error);
      setLoading(false);
    } else {
      setLoading(false);
      navigate('/');
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    const res = await signInWithGoogle();
    if (res.error) {
        setError(res.error);
        setLoading(false);
    }
    // If successful, Supabase redirects, so no need to stop loading manually
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 p-8 rounded-3xl shadow-xl border border-emerald-100 dark:border-slate-700 transition-colors duration-300"
      >
        <h1 className="text-3xl font-bold text-center text-slate-800 dark:text-white mb-8 transition-colors">Sign In</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            id="email"
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            id="password"
            onChange={handleChange}
            required
          />

          <button
            disabled={loading}
            className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white p-3 rounded-xl uppercase font-semibold hover:opacity-95 disabled:opacity-80 transition-all shadow-lg shadow-emerald-500/20"
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
          
          <div className="flex items-center my-2">
            <div className="flex-1 border-t border-slate-200 dark:border-slate-700 transition-colors"></div>
            <span className="px-3 text-slate-400 dark:text-slate-500 text-sm font-medium">OR</span>
            <div className="flex-1 border-t border-slate-200 dark:border-slate-700 transition-colors"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="bg-red-600 text-white p-3 rounded-xl uppercase font-semibold hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
          >
            Continue with Google
          </button>
        </form>
        
        {error && (
            <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg text-rose-600 dark:text-rose-400 text-sm text-center">
                <p className="font-semibold mb-1">Authentication Error</p>
                <p>{error}</p>
                
                {error.includes('provider') && (
                  <div className="mt-2 text-xs text-rose-500 dark:text-rose-400 border-t border-rose-200 dark:border-rose-800 pt-2">
                    <strong>Fix:</strong> Go to Supabase Dashboard &rarr; Authentication &rarr; Providers &rarr; Google and toggle it ON.
                  </div>
                )}
                
                {/* Generic hint for Google 403/Popup errors which often result in generic messages */}
                {!error.includes('provider') && (
                  <div className="mt-2 text-xs text-rose-500 dark:text-rose-400 border-t border-rose-200 dark:border-rose-800 pt-2 text-left">
                    <strong>Seeing a Google 403 Error?</strong><br/>
                    1. Go to Google Cloud Console &rarr; OAuth Consent Screen.<br/>
                    2. Set User Type to <strong>External</strong>.<br/>
                    3. If in "Testing", add your email to <strong>Test Users</strong>.
                  </div>
                )}
            </div>
        )}

        <div className="flex gap-2 mt-6 justify-center text-sm">
          <p className="text-slate-500 dark:text-slate-400">Don't have an account?</p>
          <Link to="/sign-up" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline transition-colors">
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;