// Supabase Edge Function — Deepgram transcription proxy.
// POST { audioUrl: "https://..." }  →  { words: [{ start, end, word, punctuated_word }, ...] }
// Requires DEEPGRAM_API_KEY secret.

const DEEPGRAM_API_KEY = Deno.env.get('DEEPGRAM_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json({ error: 'method not allowed' }, 405);
  }
  if (!DEEPGRAM_API_KEY) {
    return json({ error: 'DEEPGRAM_API_KEY not set on this project' }, 500);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid JSON body' }, 400);
  }
  const audioUrl = body?.audioUrl;
  if (!audioUrl || typeof audioUrl !== 'string') {
    return json({ error: 'audioUrl (string) required' }, 400);
  }

  // Deepgram nova-3, word-level timestamps + smart formatting + punctuation.
  const dgUrl =
    'https://api.deepgram.com/v1/listen?model=nova-3&smart_format=true&punctuate=true';
  const dgRes = await fetch(dgUrl, {
    method: 'POST',
    headers: {
      Authorization: `Token ${DEEPGRAM_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: audioUrl }),
  });

  if (!dgRes.ok) {
    const text = await dgRes.text();
    return json({ error: `deepgram ${dgRes.status}: ${text}` }, 502);
  }

  const data = await dgRes.json();
  const words =
    data?.results?.channels?.[0]?.alternatives?.[0]?.words ?? [];

  return json({ words });
});

function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}
