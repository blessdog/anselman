import { supabase } from './supabase.js';

// `supabase.auth.getSession()` can deadlock during token-refresh negotiation
// on cold start. We avoid awaiting it at boot — instead keep a synchronous
// cache fed by `onAuthStateChange`, and seed it once at module load.

let cachedSession = null;
let seeded = false;
const subscribers = new Set();

function notify(session) {
  for (const cb of subscribers) {
    try { cb(session); } catch (e) { console.error('[auth] subscriber threw:', e); }
  }
}

supabase.auth.onAuthStateChange((event, session) => {
  console.log('[auth] event=', event, 'hasSession=', !!session);
  cachedSession = session;
  seeded = true;
  notify(session);
});

// Best-effort seed. If this hangs forever (the deadlock), the onAuthStateChange
// listener above still fires INITIAL_SESSION and we recover.
supabase.auth.getSession().then(({ data: { session } }) => {
  console.log('[auth] getSession() resolved, hasSession=', !!session);
  if (!seeded) { cachedSession = session; seeded = true; notify(session); }
}).catch((err) => console.error('[auth] getSession() rejected:', err));

export function getSession() { return cachedSession; }
export function getUser() { return cachedSession?.user || null; }

export function onAuthChange(cb) {
  subscribers.add(cb);
  // Fire current state in a microtask so subscribers don't see synchronous re-entry.
  Promise.resolve().then(() => cb(cachedSession));
  return () => subscribers.delete(cb);
}

export async function sendMagicLink(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin + '/' },
  });
  if (error) throw error;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
