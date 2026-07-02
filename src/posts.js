import { supabase } from './supabase.js';
import { firstImageUrl } from './markdown.js';

const PAGE = 20;

export async function listPublished({ offset = 0, limit = PAGE } = {}) {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, body, thumbnail_url, created_at, updated_at')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data;
}

export async function getPost(id) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createPost({ title, body, authorId }) {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      title,
      body,
      thumbnail_url: firstImageUrl(body),
      author_id: authorId,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePost(id, { title, body }) {
  const { data, error } = await supabase
    .from('posts')
    .update({
      title,
      body,
      thumbnail_url: firstImageUrl(body),
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePost(id) {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw error;
}

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB

// Upload any file to the post-images bucket. Returns {url, mime, name, size}.
// MIME-routed insertion into the body is the caller's job.
export async function uploadFile(file) {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`file too big: ${(file.size / 1024 / 1024).toFixed(1)} MB (max ${MAX_UPLOAD_BYTES / 1024 / 1024} MB)`);
  }
  const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage
    .from('post-images')
    .upload(path, file, {
      cacheControl: '31536000',
      upsert: false,
      contentType: file.type || undefined,
    });
  if (error) throw error;
  const { data } = supabase.storage.from('post-images').getPublicUrl(path);
  return { url: data.publicUrl, mime: file.type || '', name: file.name, size: file.size };
}

// Translate an uploaded file into the markdown/HTML snippet that should
// be inserted at the cursor. Images use markdown image syntax (cleanest).
// Video/audio use inline HTML tags so DOMPurify can render them at view
// time. Audio gets a stable id so a transcript can target it later.
// Anything else is a fallback link.
export function snippetForUpload({ url, mime, name }) {
  if (mime.startsWith('image/')) {
    return { snippet: `![${name}](${url})`, mediaId: null };
  }
  if (mime.startsWith('video/')) {
    const id = 'vid-' + randomId();
    return { snippet: `<video id="${id}" controls src="${url}" style="max-width:100%"></video>`, mediaId: id, kind: 'video' };
  }
  if (mime.startsWith('audio/')) {
    const id = 'aud-' + randomId();
    return { snippet: `<audio id="${id}" controls src="${url}"></audio>`, mediaId: id, kind: 'audio' };
  }
  return { snippet: `[${name}](${url})`, mediaId: null };
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}
