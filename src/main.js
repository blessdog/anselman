import './style.css';

// `video` is optional. When a project has one it replaces the icon; until then
// the icon stands in. Demo videos are coming (Ryan, 2026-09-10).
const PROJECTS = [
  {
    name: 'Write On',
    href: 'https://write-on.app',
    icon: '/projects/write-on-icon.png',
    blurb: 'Voice to text for Mac. You talk, it types.',
  },
  {
    name: 'Rant Recorder',
    href: 'https://rantrecorder.com',
    icon: '/projects/rantrecorder-icon.png',
    blurb: 'A tape recorder for ideas, on iPhone. Press once to record, once to stop, then search what you said. In beta.',
  },
  {
    name: 'github.com/blessdog',
    href: 'https://github.com/blessdog',
    blurb: 'The rest of it.',
  },
];

function projectItem(p) {
  const li = document.createElement('li');
  li.className = 'project';
  const media = p.video
    ? `<video class="project__media" src="${p.video}" autoplay muted loop playsinline></video>`
    : p.icon
      ? `<img class="project__media" src="${p.icon}" alt="" width="72" height="72" />`
      : '';
  li.innerHTML = `
    <a class="project__link" href="${p.href}" target="_blank" rel="noopener">
      ${media}
      <span class="project__text">
        <span class="project__name">${p.name}</span>
        <span class="project__blurb">${p.blurb}</span>
      </span>
    </a>`;
  return li;
}

const list = document.getElementById('projects');
for (const p of PROJECTS) list.appendChild(projectItem(p));

// ─── The lamp ───────────────────────────────────────────────────────────
// Autoplay can be refused until the first gesture; retry on it.
// F toggles fullscreen. A click anywhere that is not a link shifts the hue.
const lamp = document.getElementById('lamp-bg');
const startLamp = () => lamp?.play().catch(() => {});
startLamp();
document.addEventListener('pointerdown', startLamp, { once: true, passive: true });

let hue = 0;
document.addEventListener('click', (e) => {
  if (e.target.closest('a')) return;
  hue = (hue + 40) % 360;
  lamp.style.filter = hue ? `hue-rotate(${hue}deg)` : '';
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'f' && e.key !== 'F') return;
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen?.();
});
