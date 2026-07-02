import { supabase } from './supabase.js';

// Call the `transcribe` Edge Function. Returns array of word objects:
//   { word, punctuated_word, start, end, confidence }
export async function transcribeAudio(audioUrl) {
  const { data, error } = await supabase.functions.invoke('transcribe', {
    body: { audioUrl },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data.words || [];
}

// Convert Deepgram word array → hyperaudio-lite transcript HTML.
// `audioId` is the DOM id of the audio element the transcript drives.
export function wordsToTranscriptHtml(words, audioId) {
  if (!words?.length) return '';
  const spans = words
    .map((w) => {
      const startMs = Math.round((w.start || 0) * 1000);
      const durMs = Math.round(((w.end || w.start) - w.start) * 1000);
      const text = escapeHtml(w.punctuated_word || w.word || '');
      return `<span data-m="${startMs}" data-d="${durMs}">${text}</span>`;
    })
    .join(' ');
  return `<div class="transcript" data-hyperaudio-target="${audioId}">${spans}</div>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}
