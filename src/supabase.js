import { createClient } from '@supabase/supabase-js';

// Fallbacks let host builds (Hostinger has no env config) produce a working
// bundle. The publishable key is public by design — it ships in every built
// bundle regardless; RLS is the security boundary. Nothing here may throw:
// createClient throwing at module scope kills the entire SPA, including
// routes that never touch Supabase.
const url = import.meta.env.VITE_SUPABASE_URL || 'https://yhpzfhiewxdlbynocdjn.supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_JGCMiegY8wf1_b2JSW1LrQ_4ya_MQvt';

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
