import { getUser, sendMagicLink } from '../auth.js';
import { createPost, updatePost, getPost, uploadFile, snippetForUpload } from '../posts.js';
import { render } from '../markdown.js';
import { navigate } from '../router.js';
import { enhanceMedia } from '../media-player.js';
import { initCaption } from '../caption.js';
import { transcribeAudio, wordsToTranscriptHtml } from '../transcribe.js';

export async function postView({ params }) {
  const user = getUser();
  const editingId = params.id || null;

  if (!user) return loginForm();

  let existing = null;
  if (editingId) {
    try {
      existing = await getPost(editingId);
    } catch (err) {
      const msg = document.createElement('section');
      msg.className = 'section';
      msg.innerHTML = `<h2 class="section__title">Edit Post</h2><div class="section__body"><p>Could not load post: ${esc(err.message || err)}</p></div>`;
      return msg;
    }
  }

  return composer({ user, editingId, existing });
}

// ─── Login form ─────────────────────────────────────────────────────────

function loginForm() {
  const wrap = document.createElement('section');
  wrap.className = 'section';
  wrap.innerHTML = `
    <h2 class="section__title">Login</h2>
    <div class="section__body">
      <p>Magic link sign-in. Enter your email and click send.</p>
      <form class="auth-form" autocomplete="off" novalidate>
        <input type="email" name="email" placeholder="you@example.com" required autofocus />
        <button type="submit">send magic link</button>
      </form>
      <p class="auth-status" aria-live="polite"></p>
    </div>
  `;

  const form = wrap.querySelector('form');
  const status = wrap.querySelector('.auth-status');
  const button = wrap.querySelector('button');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = new FormData(form).get('email')?.toString().trim();
    if (!email) return;
    button.disabled = true;
    status.textContent = 'sending…';
    try {
      await sendMagicLink(email);
      status.textContent = `link sent to ${email}. check your inbox, click the link, and you'll come back logged in.`;
    } catch (err) {
      status.textContent = `error: ${err.message || err}`;
      button.disabled = false;
    }
  });

  return wrap;
}

// ─── Composer ───────────────────────────────────────────────────────────

function composer({ editingId, existing }) {
  const wrap = document.createElement('section');
  wrap.className = 'section composer-section';
  wrap.innerHTML = `
    <h2 class="section__title">${editingId ? 'Edit Post' : 'New Post'}</h2>
    <div class="composer">
      <div class="composer__editor">
        <input class="composer__title" type="text" name="title" placeholder="title" value="${esc(existing?.title || '')}" />
        <textarea class="composer__body" name="body" placeholder="write in markdown. drag, paste, or pick an image / video / audio file. paste a youtube url on its own line to embed it." spellcheck="false">${esc(existing?.body || '')}</textarea>
        <div class="composer__bar">
          <label class="composer__pick">
            <input type="file" hidden multiple />
            <span>attach file</span>
          </label>
          <span class="composer__status" aria-live="polite"></span>
          <span class="composer__spacer"></span>
          <button class="composer__publish" type="button">${editingId ? 'save' : 'publish'}</button>
        </div>
      </div>
      <div class="composer__preview">
        <div class="composer__preview-label">preview</div>
        <div class="post-body composer__preview-body"></div>
      </div>
    </div>
  `;

  const titleEl   = wrap.querySelector('.composer__title');
  const bodyEl    = wrap.querySelector('.composer__body');
  const previewEl = wrap.querySelector('.composer__preview-body');
  const statusEl  = wrap.querySelector('.composer__status');
  const pickEl    = wrap.querySelector('.composer__pick input');
  const publishEl = wrap.querySelector('.composer__publish');

  // Live preview, debounced.
  let renderTimer = null;
  const refreshPreview = () => {
    clearTimeout(renderTimer);
    renderTimer = setTimeout(() => {
      previewEl.innerHTML = render(bodyEl.value);
      enhanceMedia(previewEl);
      initCaption(previewEl);
    }, 180);
  };
  bodyEl.addEventListener('input', refreshPreview);
  refreshPreview();

  // ─── Upload: shared handler for drag, paste, file-picker ─────────────
  async function ingestFiles(files) {
    if (!files || !files.length) return;
    for (const f of files) {
      statusEl.textContent = `uploading ${f.name} (${(f.size / 1024 / 1024).toFixed(1)}MB)…`;
      try {
        const result = await uploadFile(f);
        const { snippet, mediaId, kind } = snippetForUpload(result);
        insertAtCursor(bodyEl, snippet + '\n\n');
        refreshPreview();
        statusEl.textContent = `inserted ${f.name}`;

        // Audio? Kick off Deepgram transcription. Best-effort: if it fails,
        // the audio still works without a transcript.
        if (kind === 'audio' && mediaId) {
          transcribeAndInsert(result.url, mediaId, f.name).catch((err) => {
            console.warn('[transcribe] failed:', err);
            statusEl.textContent = `transcribe failed: ${err.message || err}`;
          });
        }
      } catch (err) {
        statusEl.textContent = `upload failed: ${err.message || err}`;
        return;
      }
    }
    setTimeout(() => { if (statusEl.textContent.startsWith('inserted')) statusEl.textContent = ''; }, 3000);
  }

  async function transcribeAndInsert(audioUrl, audioId, fileName) {
    statusEl.textContent = `transcribing ${fileName}…`;
    const words = await transcribeAudio(audioUrl);
    if (!words.length) {
      statusEl.textContent = `${fileName}: no words returned`;
      return;
    }
    const html = wordsToTranscriptHtml(words, audioId);
    // Insert at the end of the body (so transcript follows the audio block).
    if (!bodyEl.value.endsWith('\n')) bodyEl.value += '\n';
    bodyEl.value += '\n' + html + '\n';
    refreshPreview();
    statusEl.textContent = `transcript ready (${words.length} words)`;
  }

  // file picker
  pickEl.addEventListener('change', () => {
    ingestFiles(Array.from(pickEl.files || []));
    pickEl.value = '';
  });

  // drag and drop onto the textarea
  ['dragenter', 'dragover'].forEach((ev) =>
    bodyEl.addEventListener(ev, (e) => {
      e.preventDefault();
      bodyEl.classList.add('is-dragover');
    })
  );
  ['dragleave', 'drop'].forEach((ev) =>
    bodyEl.addEventListener(ev, (e) => {
      e.preventDefault();
      bodyEl.classList.remove('is-dragover');
    })
  );
  bodyEl.addEventListener('drop', (e) => {
    const files = e.dataTransfer?.files;
    if (files?.length) ingestFiles(Array.from(files));
  });

  // paste from clipboard
  bodyEl.addEventListener('paste', (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const files = [];
    for (const item of items) {
      if (item.kind === 'file') {
        const f = item.getAsFile();
        if (f) files.push(f);
      }
    }
    if (files.length) {
      e.preventDefault();
      ingestFiles(files);
    }
  });

  // ─── Publish / Save ─────────────────────────────────────────────────
  publishEl.addEventListener('click', async () => {
    const title = titleEl.value.trim();
    const body  = bodyEl.value.trim();
    if (!title) { statusEl.textContent = 'needs a title.'; titleEl.focus(); return; }
    if (!body)  { statusEl.textContent = 'needs a body.';  bodyEl.focus();  return; }
    publishEl.disabled = true;
    statusEl.textContent = editingId ? 'saving…' : 'publishing…';
    try {
      const user = getUser();
      const result = editingId
        ? await updatePost(editingId, { title, body })
        : await createPost({ title, body, authorId: user.id });
      statusEl.textContent = editingId ? 'saved.' : 'published.';
      // Land on the feed with the new post expanded.
      navigate(`/#post-${result.id}`);
    } catch (err) {
      statusEl.textContent = `error: ${err.message || err}`;
      publishEl.disabled = false;
    }
  });

  return wrap;
}

// ─── helpers ────────────────────────────────────────────────────────────

function insertAtCursor(el, text) {
  const start = el.selectionStart ?? el.value.length;
  const end   = el.selectionEnd   ?? el.value.length;
  el.value = el.value.slice(0, start) + text + el.value.slice(end);
  const caret = start + text.length;
  el.setSelectionRange(caret, caret);
  el.focus();
}

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
