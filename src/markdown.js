import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({
  gfm: true,
  breaks: false,
  headerIds: false,
  mangle: false,
});

// DOMPurify allowlist — extend the default html profile to permit video,
// audio, and iframe (with a strict src/srcdoc/sandbox attr set so we can embed
// YouTube). Sanitizer still strips javascript: URLs, on* handlers, etc.
const PURIFY_OPTS = {
  USE_PROFILES: { html: true },
  ADD_TAGS: ['video', 'audio', 'source', 'iframe'],
  ADD_ATTR: [
    'controls', 'autoplay', 'loop', 'muted', 'playsinline', 'preload', 'poster',
    'allow', 'allowfullscreen', 'frameborder', 'sandbox',
    'crossorigin',
    // Hyperaudio-Lite transcript attributes — word timing in ms.
    'data-m', 'data-d', 'data-hyperaudio-target',
  ],
};

// Detect a paragraph that is just a YouTube URL and replace with an iframe
// embed. Matches both youtu.be/<id> and youtube.com/watch?v=<id> (+ shorts).
const YT_RE = /^https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,15})(?:[?&][^\s]*)?$/;

function youtubeEmbed(id) {
  return `<iframe class="yt-embed" src="https://www.youtube.com/embed/${id}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
}

function preprocessYouTube(md) {
  if (!md) return md;
  return md
    .split(/\r?\n/)
    .map((line) => {
      const m = line.trim().match(YT_RE);
      return m ? youtubeEmbed(m[1]) : line;
    })
    .join('\n');
}

export function render(md) {
  if (!md) return '';
  const preprocessed = preprocessYouTube(md);
  const raw = marked.parse(preprocessed);
  return DOMPurify.sanitize(raw, PURIFY_OPTS);
}

// Strip markdown to plain text for feed snippets.
export function toSnippet(md, n = 150) {
  if (!md) return '';
  const text = md
    .replace(/<[^>]+>/g, '')              // any html
    .replace(/!\[.*?\]\(.*?\)/g, '')       // images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links → text
    .replace(/`{1,3}[^`]*`{1,3}/g, '')     // code
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_~]{1,3}/g, '')
    .replace(/^---+$/gm, '')
    .replace(/https?:\/\/\S+/g, '')        // bare URLs (YouTube, etc)
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > n ? text.slice(0, n).trimEnd() + '…' : text;
}

// First markdown image URL — used as auto-thumbnail on save.
export function firstImageUrl(md) {
  if (!md) return null;
  const m = md.match(/!\[[^\]]*\]\(([^)\s]+)/);
  return m ? m[1] : null;
}
