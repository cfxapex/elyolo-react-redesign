
import { createClient } from '@supabase/supabase-js';

// These environment variables will need to be set in a .env file later
// For development, we'll gracefully handle if they are missing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
