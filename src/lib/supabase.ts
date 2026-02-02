import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise use hardcoded values for GitHub Pages
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yuphqbiwrmawdqoqbzlm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_qoMm_Oue20UX1wrJDc4WRQ_eGHekh3p';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
