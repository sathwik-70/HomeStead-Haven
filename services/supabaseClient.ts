import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables in various environments (Vite, generic)
const getEnv = (key: string) => {
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return '';
};

// Use provided credentials as defaults so the app works immediately
const supabaseUrl = getEnv('VITE_SUPABASE_URL') || 'https://fiaqictypnjdkrgtxppi.supabase.co';
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpYXFpY3R5cG5qZGtyZ3R4cHBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NzA2NTMsImV4cCI6MjA3OTU0NjY1M30.rT_O8ELgYp1-oyFIIlcXsqXcTZ5YM4r7JM1xNadI0P0';

// Check if specific Supabase keys are present (not just placeholders)
export const isSupabaseConfigured = supabaseUrl.startsWith('https://') && supabaseUrl !== 'https://placeholder.supabase.co';

export const supabase = createClient(supabaseUrl, supabaseKey);