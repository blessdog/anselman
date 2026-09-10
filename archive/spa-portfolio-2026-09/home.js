import { NOTES } from '../content/notes.js';

const SYSTEMS = [
  {
    eyebrow: 'Realtime desktop systems',
    name: 'Write-On',
    href: 'https://write-on.app',
    blurb: 'A native macOS transcription app built around live audio capture, Deepgram Nova-3 streaming, explicit pause-and-resume state, and a last-utterance preview.',
    tech: 'Swift / SwiftUI / AVFoundation / Deepgram',
  },
  {
    eyebrow: 'Tool protocols & automation',
    name: 'BlessDog Music System',
    href: 'https://github.com/blessdog/blessdog',
    blurb: 'A dual-MCP-server architecture that exposes 40+ typed tools for Ableton Live, backed by an OSC bridge, sample indexing, session templates, and audio analysis.',
    tech: 'Python / Node.js / MCP / OSC / Demucs / librosa',
  },
  {
    eyebrow: 'Document intelligence',
    name: 'TortWin',
    href: 'https://github.com/blessdog/chronology_mvp',
    blurb: 'An end-to-end medical chronology pipeline: OCR, clinical entity extraction, timeline assembly, duplicate consolidation, API services, and vector-backed retrieval.',
    tech: 'Python / FastAPI / React / PostgreSQL / AWS Textract',
  },
  {
    eyebrow: 'Browser & workflow automation',
    name: 'JobCanon',
    href: 'https://github.com/blessdog/jobhard',
    blurb: 'Multi-ATS automation for Workday, Greenhouse, and Lever using stable selectors, adaptive fallbacks, local model-assisted field resolution, and IMAP verification flows.',
    tech: 'Python / Playwright / TypeScript / Ollama / IMAP',
  },
];

const EXPERIENCE = [
  {
    dates: '2024 - present',
    role: 'Independent Software Engineer',
    company: 'MatterMixers',
    text: 'Own product architecture and implementation across native Swift apps, Python and TypeScript services, browser automation, data pipelines, and applied AI. Shipped working systems in voice, music tooling, legal-tech, and workflow automation.',
  },
  {
    dates: '2023 - present',
    role: 'Network Infrastructure Engineer (contract)',
    company: 'Iron Systems',
    text: 'Deploy and support LAN/WAN infrastructure at Meta data-center facilities, including Linux administration, network security, and fiber and copper plant work.',
  },
  {
    dates: '2023',
    role: 'Network Infrastructure Lead',
    company: 'Meta data centers, via Ericsson',
    text: 'Promoted from technician to project lead mid-engagement. Coordinated facility-wide deployments and QA/QC across project management, engineering, and on-site crews; completed the buildout on schedule.',
  },
  {
    dates: '2021 - 2022',
    role: 'Firmware Validation Engineer',
    company: 'Micron Technology',
    text: 'Built Python test automation for memory-controller and SSD firmware, debugged bench failures, caught regressions before production, and maintained C++ components in a distributed review workflow.',
  },
];

export async function homeView() {
  const wrap = document.createElement('div');
  wrap.className = 'home';
  wrap.innerHTML = `
    <section class="hero" aria-labelledby="hero-title">
      <p class="eyebrow">Software + systems engineer / Denver, Colorado</p>
      <h1 id="hero-title" class="hero__title">I build systems that have to work.</h1>
      <p class="hero__lede">
        My range runs from Python firmware validation and C++ components to data-center networks,
        native Swift apps, production APIs, and applied AI. The through-line is systems ownership:
        understand the constraints, make the interfaces explicit, and finish the job.
      </p>
      <div class="hero__actions">
        <a class="button button--primary" href="/resume.pdf" target="_blank" rel="noopener">Read the resume <span aria-hidden="true">↗</span></a>
        <a class="button" href="mailto:hire@anselman.com">hire@anselman.com</a>
      </div>
      <ul class="signal-bar" aria-label="Professional highlights">
        <li>Firmware validation</li>
        <li>Meta data centers</li>
        <li>Full-stack products</li>
        <li>Technical sales</li>
      </ul>
    </section>

    <section class="section" aria-labelledby="range-title">
      <div class="section__heading">
        <p class="section__number">01</p>
        <div>
          <p class="eyebrow">Engineering range</p>
          <h2 id="range-title">AI is one layer of the system, not the whole job.</h2>
        </div>
      </div>
      <div class="capability-grid">
        <article class="capability">
          <p class="capability__index">A</p>
          <h3>Validation & systems</h3>
          <p>Python test automation, C++ firmware maintenance, Linux, hardware debugging, LAN/WAN deployment, network security, and infrastructure QA/QC.</p>
        </article>
        <article class="capability">
          <p class="capability__index">B</p>
          <h3>Product engineering</h3>
          <p>Native macOS and iOS, backend services, browser automation, responsive web interfaces, PostgreSQL data models, Docker, and cloud integrations.</p>
        </article>
        <article class="capability">
          <p class="capability__index">C</p>
          <h3>Applied AI</h3>
          <p>Streaming voice interfaces, typed tool protocols, OCR and NLP pipelines, retrieval, evaluations, and local-model workflows built into conventional software.</p>
        </article>
      </div>
    </section>

    <section class="section" aria-labelledby="experience-title">
      <div class="section__heading">
        <p class="section__number">02</p>
        <div>
          <p class="eyebrow">Experience</p>
          <h2 id="experience-title">Software judgment grounded in physical systems.</h2>
        </div>
      </div>
      <div class="experience-list"></div>
      <p class="section__afterword">Earlier roles include field engineering for NCR, network deployments and Ekahau surveys for Kenyatta Computer Services, and full-cycle residential sales as a quota-carrying team lead.</p>
    </section>

    <section class="section" aria-labelledby="work-title">
      <div class="section__heading">
        <p class="section__number">03</p>
        <div>
          <p class="eyebrow">Selected systems</p>
          <h2 id="work-title">The proof is in the architecture.</h2>
        </div>
      </div>
      <div class="systems-grid"></div>
    </section>

    <section class="section notes-preview" aria-labelledby="notes-title">
      <div class="section__heading">
        <p class="section__number">04</p>
        <div>
          <p class="eyebrow">Field notes</p>
          <h2 id="notes-title">Short writing from the workbench.</h2>
        </div>
      </div>
      <div class="notes-preview__list"></div>
      <div class="notes-preview__footer">
        <a class="text-link" href="/notes">All notes</a>
        <a class="text-link" href="/feed.xml" target="_blank" rel="noopener">RSS feed</a>
      </div>
    </section>

    <section class="contact" aria-labelledby="contact-title">
      <p class="eyebrow">Open to the right full-time engineering role</p>
      <h2 id="contact-title">Need someone who can cross the boundary between software and systems?</h2>
      <p>US citizen. No sponsorship required. Based in Denver and open to remote or Colorado-based work.</p>
      <a class="button button--primary" href="mailto:hire@anselman.com">Start a conversation <span aria-hidden="true">↗</span></a>
    </section>
  `;

  const experienceEl = wrap.querySelector('.experience-list');
  for (const item of EXPERIENCE) {
    const article = document.createElement('article');
    article.className = 'experience';
    article.innerHTML = `
      <p class="experience__dates">${esc(item.dates)}</p>
      <div class="experience__body">
        <h3>${esc(item.role)}</h3>
        <p class="experience__company">${esc(item.company)}</p>
        <p>${esc(item.text)}</p>
      </div>
    `;
    experienceEl.appendChild(article);
  }

  const systemsEl = wrap.querySelector('.systems-grid');
  for (const system of SYSTEMS) {
    const article = document.createElement('article');
    article.className = 'system-card';
    article.innerHTML = `
      <p class="eyebrow">${esc(system.eyebrow)}</p>
      <h3><a href="${esc(system.href)}" target="_blank" rel="noopener">${esc(system.name)} <span aria-hidden="true">↗</span></a></h3>
      <p>${esc(system.blurb)}</p>
      <p class="system-card__tech">${esc(system.tech)}</p>
    `;
    systemsEl.appendChild(article);
  }

  const notesEl = wrap.querySelector('.notes-preview__list');
  for (const note of NOTES.slice(0, 2)) {
    const article = document.createElement('article');
    article.className = 'note-teaser';
    article.innerHTML = `
      <time datetime="${esc(note.date)}">${formatDate(note.date)}</time>
      <h3><a href="/notes#${esc(note.slug)}">${esc(note.title)}</a></h3>
      <p>${esc(note.dek)}</p>
    `;
    notesEl.appendChild(article);
  }

  return wrap;
}

function formatDate(value) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
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
