// TikTok / CapCut-style caption driver.
// For each `.transcript` element in the container:
//   1. Pulls the timed word spans out (data-m, data-d).
//   2. Hides the wall-of-text by default.
//   3. Inserts a big bold `.caption` above the audio player that shows a
//      sliding window of words — previous 2 + current + next 2.
//   4. Adds a "show transcript" toggle so users can still see the wall on
//      demand. The wall remains click-to-seek.

const SETUP = new WeakSet();

export function initCaption(container) {
  if (!container) return;
  container.querySelectorAll('.transcript').forEach(setupOne);
}

function setupOne(transcript) {
  if (SETUP.has(transcript)) return;
  SETUP.add(transcript);

  const targetId = transcript.dataset.hyperaudioTarget;
  if (!targetId) return;
  const audio = document.getElementById(targetId);
  if (!audio) return;

  const spans = Array.from(transcript.querySelectorAll('span[data-m]'));
  if (!spans.length) return;

  const words = spans.map((el) => {
    const m = parseInt(el.dataset.m, 10) || 0;
    const d = parseInt(el.dataset.d, 10) || 250;
    return {
      el,
      start: m / 1000,
      end: (m + d) / 1000,
      text: el.textContent,
    };
  });

  // Build wrapper: caption (above audio) + toggle + (hidden) wall.
  const captionWrap = document.createElement('div');
  captionWrap.className = 'caption-wrap';
  const caption = document.createElement('div');
  caption.className = 'caption';
  captionWrap.appendChild(caption);

  // The audio is wrapped by .ap (custom player). Anchor caption visually
  // above the player wrapper if present, else above the bare audio.
  const playerWrap = audio.closest('.ap') || audio;
  playerWrap.parentNode.insertBefore(captionWrap, playerWrap);

  // Toggle + wall live AFTER the audio player.
  const after = document.createElement('div');
  after.className = 'caption-extras';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'caption-toggle';
  toggle.textContent = 'show transcript';
  after.appendChild(toggle);

  // Move the transcript into our wrapper area, hide by default.
  transcript.hidden = true;
  playerWrap.parentNode.insertBefore(after, playerWrap.nextSibling);
  after.appendChild(transcript);

  toggle.addEventListener('click', () => {
    transcript.hidden = !transcript.hidden;
    toggle.textContent = transcript.hidden ? 'show transcript' : 'hide transcript';
  });

  // Click any word in the wall view to seek.
  transcript.addEventListener('click', (e) => {
    const span = e.target.closest('span[data-m]');
    if (!span) return;
    audio.currentTime = parseInt(span.dataset.m, 10) / 1000;
    if (audio.paused) audio.play().catch(() => {});
  });

  // ─── caption update loop ────────────────────────────────────────────
  let currentIdx = -1;

  const findIndex = (t) => {
    // Linear scan with a small early-exit. For long transcripts (1000+ words)
    // this is still <0.1ms per timeupdate — not worth a binary search.
    for (let i = 0; i < words.length; i++) {
      if (words[i].start > t) return Math.max(0, i - 1);
    }
    return words.length - 1;
  };

  const update = () => {
    const t = audio.currentTime;
    const idx = audio.paused && t === 0 ? -1 : findIndex(t);
    if (idx === currentIdx) return;
    currentIdx = idx;

    // Update .active on the wall view so the open-transcript toggle stays
    // in sync with playback.
    for (const w of words) w.el.classList.remove('active');

    if (idx < 0) {
      caption.innerHTML = '';
      return;
    }

    words[idx].el.classList.add('active');

    // Sliding window: 3 already-spoken words + current. No upcoming preview
    // (the surprise stays intact).
    const start = Math.max(0, idx - 3);
    const end = idx + 1;
    const parts = [];
    for (let i = start; i < end; i++) {
      const cls = i === idx ? 'caption__word is-current' : 'caption__word';
      parts.push(`<span class="${cls}">${escapeText(words[i].text)}</span>`);
    }
    caption.innerHTML = parts.join(' ');
  };

  audio.addEventListener('timeupdate', update);
  audio.addEventListener('seeked', update);
  audio.addEventListener('play', update);
}

function escapeText(s) {
  return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}
