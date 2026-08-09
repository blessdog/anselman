import './style.css';
import { defineRoute, setNotFound, setOutlet, startRouter } from './router.js';
import { homeView } from './views/home.js';
import { notesView } from './views/notes.js';

// ─── Routes ─────────────────────────────────────────────────────────────

defineRoute('/', homeView);
defineRoute('/notes', notesView);
defineRoute('/feed', notesView);

setNotFound(async () => {
  const wrap = document.createElement('section');
  wrap.className = 'section';
  wrap.innerHTML = `
    <p class="eyebrow">404</p>
    <h1 class="not-found__title">That page is not part of the system.</h1>
    <p><a class="text-link" href="/">Return home</a></p>
  `;
  return wrap;
});

setOutlet(document.getElementById('root'));
startRouter();
