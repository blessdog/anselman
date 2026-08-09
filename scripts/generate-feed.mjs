import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { NOTES } from '../src/content/notes.js';

const SITE = 'https://anselman.com';
const OUTPUT = resolve('public/feed.xml');

const items = NOTES.map((note) => {
  const url = `${SITE}/notes#${note.slug}`;
  const content = note.paragraphs.map((paragraph) => `<p>${html(paragraph)}</p>`).join('');
  return `
    <item>
      <title>${xml(note.title)}</title>
      <link>${xml(url)}</link>
      <guid isPermaLink="true">${xml(url)}</guid>
      <pubDate>${new Date(`${note.date}T12:00:00Z`).toUTCString()}</pubDate>
      <description>${xml(note.dek)}</description>
      <content:encoded><![CDATA[${cdata(content)}]]></content:encoded>
    </item>`;
}).join('');

const document = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Ryan Anselman - Field Notes</title>
    <link>${SITE}/notes</link>
    <description>Engineering notes from the workbench.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(`${NOTES[0].date}T12:00:00Z`).toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>
`;

await mkdir(resolve('public'), { recursive: true });
await writeFile(OUTPUT, document, 'utf8');
console.log(`Generated ${OUTPUT} with ${NOTES.length} entries.`);

function xml(value) {
  return String(value).replace(/[<>&"']/g, (char) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
  })[char]);
}

function html(value) {
  return String(value).replace(/[<>&]/g, (char) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[char]);
}

function cdata(value) {
  return value.replaceAll(']]>', ']]]]><![CDATA[>');
}
