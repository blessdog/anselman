import { listPublished, getPost } from '../posts.js';
import { render as renderMd, toSnippet } from '../markdown.js';
import { enhanceMedia } from '../media-player.js';
import { initCaption } from '../caption.js';

const PAGE = 20;

export async function feedView() {
  const wrap = document.createElement('section');
  wrap.className = 'section feed';
  wrap.innerHTML = `
    <h2 class="section__title">Recent</h2>
    <div class="section__body">
      <div class="feed__rows"></div>
      <div class="feed__sentinel" aria-hidden="true"></div>
      <p class="feed__status" aria-live="polite"></p>
    </div>
  `;

  const rowsEl     = wrap.querySelector('.feed__rows');
  const sentinelEl = wrap.querySelector('.feed__sentinel');
  const statusEl   = wrap.querySelector('.feed__status');

  let offset = 0;
  let exhausted = false;
  let loading = false;
  const seenIds = new Set();

  async function loadMore() {
    if (loading || exhausted) return;
    loading = true;
    statusEl.textContent = offset === 0 ? 'loading…' : '';
    try {
      const batch = await listPublished({ offset, limit: PAGE });
      for (const post of batch) {
        if (seenIds.has(post.id)) continue;
        seenIds.add(post.id);
        rowsEl.appendChild(buildRow(post));
      }
      offset += batch.length;
      if (batch.length < PAGE) exhausted = true;
      if (offset === 0) statusEl.textContent = 'no posts yet.';
      else statusEl.textContent = exhausted ? '' : '';
    } catch (err) {
      statusEl.textContent = `feed error: ${err.message || err}`;
    } finally {
      loading = false;
    }
  }

  // Deep-link: if URL has #post-{id}, fetch that post and pre-pin it expanded
  // at the top of the list. The regular query will dedupe by id.
  const hashId = parseHash();
  let pinned = null;
  if (hashId) {
    try {
      pinned = await getPost(hashId);
      if (pinned && pinned.published) {
        seenIds.add(pinned.id);
        const row = buildRow(pinned, { expanded: true });
        rowsEl.appendChild(row);
      }
    } catch {
      /* fall through — regular feed load still happens */
    }
  }

  await loadMore();

  // Infinite scroll
  if (!exhausted) {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadMore();
    }, { rootMargin: '400px' });
    io.observe(sentinelEl);
  }

  // After mount, scroll the deep-linked row into view.
  if (pinned) {
    requestAnimationFrame(() => {
      const targetEl = rowsEl.querySelector(`[data-post-id="${pinned.id}"]`);
      targetEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  return wrap;
}

// ─── Row ────────────────────────────────────────────────────────────────

function buildRow(post, { expanded = false } = {}) {
  const row = document.createElement('article');
  row.className = 'feed-row' + (expanded ? ' is-expanded' : '');
  row.dataset.postId = post.id;
  row._post = post; // stash for lazy body render

  row.innerHTML = `
    <button class="feed-row__head" type="button">
      ${post.thumbnail_url ? `<img class="feed-row__thumb" src="${esc(post.thumbnail_url)}" alt="" loading="lazy">` : '<span class="feed-row__thumb feed-row__thumb--blank" aria-hidden="true"></span>'}
      <span class="feed-row__title-wrap">
        <span class="feed-row__title">${esc(post.title)}</span>
        <span class="feed-row__snippet">${esc(toSnippet(post.body, 150))}</span>
      </span>
      <span class="feed-row__meta">${formatDate(post.created_at)}</span>
      <span class="feed-row__caret" aria-hidden="true">▾</span>
    </button>
    <div class="post-body feed-row__body"></div>
  `;

  const head = row.querySelector('.feed-row__head');
  head.addEventListener('click', () => toggleRow(row));

  if (expanded) renderBody(row);
  return row;
}

function toggleRow(row) {
  const willExpand = !row.classList.contains('is-expanded');
  row.classList.toggle('is-expanded');
  if (willExpand) {
    renderBody(row);
    history.replaceState({}, '', `${location.pathname}#post-${row.dataset.postId}`);
  } else if (location.hash === `#post-${row.dataset.postId}`) {
    history.replaceState({}, '', location.pathname);
  }
}

function renderBody(row) {
  const bodyEl = row.querySelector('.feed-row__body');
  if (bodyEl.dataset.rendered) return;
  bodyEl.innerHTML = renderMd(row._post.body);
  enhanceMedia(bodyEl);
  initCaption(bodyEl);
  bodyEl.dataset.rendered = 'true';
}

// ─── helpers ────────────────────────────────────────────────────────────

function parseHash() {
  const m = location.hash.match(/^#post-([a-f0-9-]{8,})$/i);
  return m ? m[1] : null;
}

function formatDate(iso) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} · ${hh}:${mi}`;
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
