import { NOTES } from '../content/notes.js';

export async function notesView() {
  const wrap = document.createElement('div');
  wrap.className = 'notes-page';
  wrap.innerHTML = `
    <header class="page-hero">
      <p class="eyebrow">Field notes / ${NOTES.length} entries</p>
      <h1>Engineering notes from the workbench.</h1>
      <p>Short observations about systems, product decisions, and the parts of software that become visible only after the demo works.</p>
      <a class="text-link" href="/feed.xml" target="_blank" rel="noopener">Subscribe via RSS</a>
    </header>
    <section class="notes-list" aria-label="All notes"></section>
  `;

  const list = wrap.querySelector('.notes-list');
  for (const note of NOTES) {
    const article = document.createElement('article');
    article.className = 'note';
    article.id = note.slug;
    article.innerHTML = `
      <div class="note__meta">
        <time datetime="${esc(note.date)}">${formatDate(note.date)}</time>
        <p>${note.tags.map(esc).join(' / ')}</p>
      </div>
      <div class="note__content">
        <h2><a href="#${esc(note.slug)}">${esc(note.title)}</a></h2>
        <p class="note__dek">${esc(note.dek)}</p>
        ${note.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}
      </div>
    `;
    list.appendChild(article);
  }

  if (location.hash) {
    const targetId = decodeURIComponent(location.hash.slice(1));
    requestAnimationFrame(() => document.getElementById(targetId)?.scrollIntoView({ block: 'start' }));
  }

  return wrap;
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}
