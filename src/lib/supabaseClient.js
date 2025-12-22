
import { createClient } from '@supabase/supabase-js';

// These environment variables will need to be set in a .env file later
// For development, we'll gracefully handle if they are missing
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase keys are missing! Check your .env file or deployment settings.');
}

// Create client only if keys comprise a valid URL setup, otherwise export a dummy or null
// Using a proxy or simple null check might be better, but for now let's use the URL if present,
// or a fallback to prevent immediate crash, though API calls will fail.
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : {
        auth: {
            getSession: () => Promise.resolve({ data: { session: null } }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
            signOut: () => Promise.resolve({ error: null }),
            signUp: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
        },
        from: () => ({
            select: () => Promise.resolve({ data: [], error: { message: 'Supabase not configured' } }),
            insert: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
            eq: () => ({ single: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }) })
        })
    };
