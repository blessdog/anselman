// Tiny vanilla History API router. Matches paths against /-separated
// patterns with :param segments. Intercepts <a href> clicks for same-origin
// internal links so navigation stays SPA.

const routes = [];
let outletEl = null;
let notFound = () => '';

export function defineRoute(pattern, handler) {
  const segs = pattern.split('/').filter(Boolean);
  const re = new RegExp(
    '^/' +
      segs
        .map((s) => (s.startsWith(':') ? '([^/]+)' : s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')))
        .join('/') +
      '/?$'
  );
  const params = segs.filter((s) => s.startsWith(':')).map((s) => s.slice(1));
  routes.push({ re, params, handler });
}

export function setNotFound(fn) { notFound = fn; }
export function setOutlet(el) { outletEl = el; }

export function navigate(to, { replace = false } = {}) {
  if (replace) history.replaceState({}, '', to);
  else history.pushState({}, '', to);
  render();
}

function match(path) {
  for (const r of routes) {
    const m = path.match(r.re);
    if (m) {
      const params = {};
      r.params.forEach((p, i) => (params[p] = decodeURIComponent(m[i + 1])));
      return { handler: r.handler, params };
    }
  }
  return null;
}

export async function render() {
  if (!outletEl) { console.warn('[router] no outlet set, skipping render'); return; }
  const path = location.pathname || '/';
  const found = match(path);
  console.log('[router] render path=%s matched=%s', path, !!found);
  try {
    const node = found
      ? await found.handler({ params: found.params, outlet: outletEl })
      : await notFound({ outlet: outletEl });
    outletEl.innerHTML = '';
    if (node instanceof Node) outletEl.appendChild(node);
    else if (typeof node === 'string') outletEl.innerHTML = node;
    else console.warn('[router] handler returned %o (not Node/string)', node);
  } catch (err) {
    console.error('[router] handler threw:', err);
    outletEl.innerHTML = `<pre style="color:#ff8a8a;white-space:pre-wrap;text-shadow:var(--tshadow)">[router] ${escapeText(String(err && err.stack || err))}</pre>`;
  }
}

function escapeText(s) {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
}

function onClick(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  const a = e.target.closest('a');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href || href.startsWith('#') || a.target === '_blank' || a.hasAttribute('download')) return;
  const url = new URL(a.href, location.origin);
  if (url.origin !== location.origin) return;
  e.preventDefault();
  navigate(url.pathname + url.search + url.hash);
}

export function startRouter() {
  document.addEventListener('click', onClick);
  window.addEventListener('popstate', render);
  render();
}
