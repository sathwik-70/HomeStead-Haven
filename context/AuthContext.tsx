import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { MOCK_USER } from '../constants';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

interface AuthContextType {
  user: User | null;
  signInWithGoogle: () => Promise<{ error?: string }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If not configured, just stop loading
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    // Check active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        mapSupabaseUserToAppUser(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        mapSupabaseUserToAppUser(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const mapSupabaseUserToAppUser = (supabaseUser: any) => {
    const newUser: User = {
      id: supabaseUser.id,
      name: supabaseUser.user_metadata?.full_name || supabaseUser.email?.split('@')[0] || 'User',
      email: supabaseUser.email || '',
      avatar: supabaseUser.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${supabaseUser.email}&background=10b981&color=fff`,
      role: supabaseUser.email === 'sathwikpamu@gmail.com' ? UserRole.ADMIN : UserRole.USER
    };
    setUser(newUser);
    setIsLoading(false);
  };

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      console.warn("Supabase not configured. Using Mock Login.");
      setTimeout(() => {
        setUser(MOCK_USER);
        setIsLoading(false);
      }, 1000);
      return {};
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      return {};
    } catch (error: any) {
      console.error('Google Login error:', error);
      return { error: error.message || "Failed to login with Google. Ensure provider is enabled." };
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Mock login for demo
      if (email === MOCK_USER.email) {
          setUser(MOCK_USER);
          return {};
      }
      return { error: "Mock Login: Use sathwikpamu@gmail.com" };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    if (!isSupabaseConfigured) return { error: "Supabase not configured" };

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            avatar_url: `https://ui-avatars.com/api/?name=${name}&background=10b981&color=fff`
          }
        }
      });
      if (error) return { error: error.message };
      return {};
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const logout = async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle, signInWithEmail, signUpWithEmail, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};