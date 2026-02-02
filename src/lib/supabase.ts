import { createClient } from '@supabase/supabase-js';

// Use environment variables if available, otherwise use hardcoded values for GitHub Pages
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yuphqbiwrmawdqoqbzlm.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1cGhxYml3cm1hd2Rxb3FiemxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwNDcwNDcsImV4cCI6MjA4NTYyMzA0N30.OW_kGfU2azpFwpHSX-1CuZRF5uvse55DWYE1qo46COM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
