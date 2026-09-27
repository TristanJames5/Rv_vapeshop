/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder') {
  console.warn(
    'Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file or Vercel dashboard.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
