import './style.css';
import { getUser, onAuthChange, logout } from './auth.js';
import { defineRoute, setNotFound, setOutlet, startRouter, render, navigate } from './router.js';
import { homeView } from './views/home.js';
import { feedView } from './views/feed.js';
import { postView } from './views/post.js';

console.log('[anselman] main.js module loaded; document.readyState=', document.readyState);
console.log('[anselman] #root exists?', !!document.getElementById('root'));
console.log('[anselman] .forum__footer exists?', !!document.querySelector('.forum__footer'));

// ─── Routes ─────────────────────────────────────────────────────────────

defineRoute('/', homeView);
defineRoute('/feed', feedView);
defineRoute('/post', postView);
defineRoute('/post/:id/edit', postView);

setNotFound(async () => {
  const wrap = document.createElement('section');
  wrap.className = 'section';
  wrap.innerHTML = `
    <h2 class="section__title">404</h2>
    <div class="section__body"><p>not here. <a href="/">back to feed</a></p></div>
  `;
  return wrap;
});

setOutlet(document.getElementById('root'));

// ─── Footer auth indicator ──────────────────────────────────────────────

const footer = document.querySelector('.forum__footer');
const authSlot = document.createElement('p');
authSlot.className = 'forum__auth';
footer?.appendChild(authSlot);

function refreshAuthIndicator() {
  const user = getUser();
  console.log('[anselman] refreshAuthIndicator user=', user);
  if (user) {
    authSlot.innerHTML = `logged in as <strong>${escapeHtml(user.email || '')}</strong> · <a href="#" data-action="logout">logout</a>`;
  } else {
    authSlot.innerHTML = '';
  }
}

document.addEventListener('click', async (e) => {
  const a = e.target.closest('[data-action="logout"]');
  if (!a) return;
  e.preventDefault();
  await logout();
  navigate('/');
});

onAuthChange((session) => {
  console.log('[anselman] auth state changed:', session);
  refreshAuthIndicator();
  // Re-render the current view so /post flips between login form and composer.
  render();
});

// ─── Bootstrap ──────────────────────────────────────────────────────────

console.log('[anselman] bootstrap start');
refreshAuthIndicator();
console.log('[anselman] starting router');
startRouter();
console.log('[anselman] bootstrap done');

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
