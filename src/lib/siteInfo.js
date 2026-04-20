import { supabase } from './supabaseClient';

export async function fetchSiteInfo() {
  try {
    if (typeof supabase?.from !== 'function') return null;
    const { data, error } = await supabase
      .from('site_info')
      .select('*')
      .eq('id', 1)
      .single();

    if (error) return null;
    return data ?? null;
  } catch {
    return null;
  }
}

