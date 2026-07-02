// Custom audio/video player. Hides native browser controls and renders our
// own — orange-on-dark, lava-lamp palette. Adds asymmetric skip buttons
// (-15s / +30s like iOS Podcasts), draggable scrubber, speed cycle, mute,
// keyboard shortcuts when focused.

const TEMPLATE = `
<div class="ap__controls">
  <button class="ap__btn ap__skip-back" type="button" title="back 10 seconds" aria-label="back 10 seconds">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="13" r="7.5"/>
      <polygon points="14.5 2 14.5 8 8 5" fill="currentColor" stroke="none"/>
      <text x="12" y="16.5" text-anchor="middle" font-size="8" font-weight="900" fill="currentColor" stroke="none" font-family="Verdana, Tahoma, sans-serif">10</text>
    </svg>
  </button>

  <button class="ap__btn ap__play" type="button" title="play / pause" aria-label="play">
    <svg class="ap__icon-play"  viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><polygon points="6,4 20,12 6,20"/></svg>
    <svg class="ap__icon-pause" viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="0.5"/><rect x="14" y="4" width="4" height="16" rx="0.5"/></svg>
  </button>

  <button class="ap__btn ap__skip-fwd" type="button" title="forward 10 seconds" aria-label="forward 10 seconds">
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="13" r="7.5"/>
      <polygon points="9.5 2 9.5 8 16 5" fill="currentColor" stroke="none"/>
      <text x="12" y="16.5" text-anchor="middle" font-size="8" font-weight="900" fill="currentColor" stroke="none" font-family="Verdana, Tahoma, sans-serif">10</text>
    </svg>
  </button>

  <div class="ap__progress" role="slider" tabindex="-1" aria-label="seek">
    <div class="ap__track">
      <div class="ap__fill"></div>
      <div class="ap__thumb"></div>
    </div>
  </div>

  <span class="ap__time" aria-live="off">0:00 / 0:00</span>

  <button class="ap__btn ap__speed" type="button" title="playback speed" aria-label="playback speed">1×</button>

  <button class="ap__btn ap__mute" type="button" title="mute" aria-label="mute">
    <svg class="ap__icon-vol"   viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3z"/></svg>
    <svg class="ap__icon-muted" viewBox="0 0 24 24" width="20" height="20" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="M3 9v6h4l5 5V4L7 9H3z" stroke="none"/>
      <line x1="16" y1="9" x2="22" y2="15"/>
      <line x1="22" y1="9" x2="16" y2="15"/>
    </svg>
  </button>
</div>
`;

const SPEEDS = [1, 1.25, 1.5, 2, 0.75];

const wrapped = new WeakSet();

export function enhanceMedia(container) {
  if (!container) return;
  container.querySelectorAll('audio, video').forEach(wrap);
}

function wrap(media) {
  if (wrapped.has(media)) return;
  wrapped.add(media);

  // Hide native controls — we draw our own.
  media.removeAttribute('controls');
  if (!media.preload) media.preload = 'metadata';

  const isVideo = media.tagName === 'VIDEO';
  const root = document.createElement('div');
  root.className = `ap ${isVideo ? 'ap--video' : 'ap--audio'}`;
  root.tabIndex = 0;

  media.parentNode.insertBefore(root, media);
  root.appendChild(media);
  root.insertAdjacentHTML('beforeend', TEMPLATE);

  const playBtn   = root.querySelector('.ap__play');
  const backBtn   = root.querySelector('.ap__skip-back');
  const fwdBtn    = root.querySelector('.ap__skip-fwd');
  const speedBtn  = root.querySelector('.ap__speed');
  const muteBtn   = root.querySelector('.ap__mute');
  const progress  = root.querySelector('.ap__progress');
  const fillEl    = root.querySelector('.ap__fill');
  const thumbEl   = root.querySelector('.ap__thumb');
  const timeEl    = root.querySelector('.ap__time');

  let speedIdx = 0;

  // ─── helpers ──────────────────────────────────────────────────────
  const fmt = (s) => {
    if (!isFinite(s) || s < 0) s = 0;
    const total = Math.floor(s);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const ss = (total % 60).toString().padStart(2, '0');
    return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${ss}` : `${m}:${ss}`;
  };

  const refreshTime = () => {
    const ct = media.currentTime, dur = media.duration;
    timeEl.textContent = `${fmt(ct)} / ${fmt(dur)}`;
    if (isFinite(dur) && dur > 0) {
      const pct = (ct / dur) * 100;
      fillEl.style.width = `${pct}%`;
      thumbEl.style.left = `${pct}%`;
    }
  };

  const updateSpeedLabel = () => {
    const v = SPEEDS[speedIdx];
    speedBtn.textContent = Number.isInteger(v) ? `${v}×` : `${v}×`;
  };

  const toggleSpeed = (dir = 1) => {
    speedIdx = (speedIdx + dir + SPEEDS.length) % SPEEDS.length;
    media.playbackRate = SPEEDS[speedIdx];
    updateSpeedLabel();
  };

  const togglePlay = () => {
    if (media.paused) media.play().catch(() => {}); else media.pause();
  };

  // ─── click handlers ───────────────────────────────────────────────
  playBtn .addEventListener('click', togglePlay);
  backBtn .addEventListener('click', () => { media.currentTime = Math.max(0, media.currentTime - 10); });
  fwdBtn  .addEventListener('click', () => { media.currentTime = Math.min(media.duration || Infinity, media.currentTime + 10); });
  speedBtn.addEventListener('click', () => toggleSpeed(+1));
  muteBtn .addEventListener('click', () => {
    media.muted = !media.muted;
    root.classList.toggle('is-muted', media.muted);
  });

  // ─── media state → UI ─────────────────────────────────────────────
  media.addEventListener('play',           () => root.classList.add('is-playing'));
  media.addEventListener('pause',          () => root.classList.remove('is-playing'));
  media.addEventListener('ended',          () => root.classList.remove('is-playing'));
  media.addEventListener('timeupdate',     refreshTime);
  media.addEventListener('loadedmetadata', refreshTime);
  media.addEventListener('durationchange', refreshTime);
  media.addEventListener('volumechange',   () => root.classList.toggle('is-muted', media.muted || media.volume === 0));

  // ─── scrubber drag + click ───────────────────────────────────────
  let dragging = false;
  const seek = (e) => {
    const rect = progress.getBoundingClientRect();
    const x = (e.clientX ?? e.touches?.[0]?.clientX ?? 0) - rect.left;
    const ratio = Math.max(0, Math.min(1, x / rect.width));
    const dur = media.duration;
    if (isFinite(dur) && dur > 0) media.currentTime = ratio * dur;
  };
  progress.addEventListener('pointerdown', (e) => {
    dragging = true;
    progress.setPointerCapture(e.pointerId);
    seek(e);
  });
  progress.addEventListener('pointermove', (e) => { if (dragging) seek(e); });
  progress.addEventListener('pointerup',   (e) => { dragging = false; try { progress.releasePointerCapture(e.pointerId); } catch {} });
  progress.addEventListener('pointercancel', () => { dragging = false; });

  // ─── keyboard (when player has focus) ─────────────────────────────
  root.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const skip = e.shiftKey ? 30 : 10;
    let handled = true;
    switch (e.key) {
      case ' ':
      case 'k':
        togglePlay();
        break;
      case 'ArrowLeft':
      case 'j':
        media.currentTime = Math.max(0, media.currentTime - skip);
        break;
      case 'ArrowRight':
      case 'l':
        media.currentTime = Math.min(media.duration || Infinity, media.currentTime + skip);
        break;
      case ',':
      case '<':
        toggleSpeed(-1);
        break;
      case '.':
      case '>':
        toggleSpeed(+1);
        break;
      case 'm':
        media.muted = !media.muted;
        root.classList.toggle('is-muted', media.muted);
        break;
      default:
        handled = false;
    }
    if (handled) e.preventDefault();
  });

  refreshTime();
  updateSpeedLabel();
}
