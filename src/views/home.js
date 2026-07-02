// Home — recruiter-facing portfolio. Type-on-lamp, no surfaces. Copy is
// kept in lockstep with the canonical resume (jobhard-v2/profiles/resume.md);
// if one changes, change the other.

const PROJECTS = [
  {
    name: 'Write-On',
    href: 'https://write-on.app',
    blurb:
      'Shipped push-to-talk voice transcription for macOS, in daily use. Real-time Deepgram Nova-3 streaming with pause-and-resume and a last-utterance preview.',
    tech: 'Swift · SwiftUI · AVFoundation · Deepgram SDK',
  },
  {
    name: 'YapZapp',
    href: 'https://yapzapp.com',
    blurb:
      'Passive voice capture with LLM-based intent routing — ramble freely and the backend classifies and routes content where it belongs. Web shipped; native iOS in active development with Metal-shader waveform rendering.',
    tech: 'Swift · SwiftUI · Metal · Anthropic API',
  },
  {
    name: 'BlessDog Music System',
    href: 'https://github.com/blessdog/blessdog',
    blurb:
      'AI-controlled Ableton Live. Dual-MCP-server architecture exposing 40+ tools to LLM agents for clip creation, MIDI sequencing, mixing, and device control. Five-stage pipeline from OSC bridge to reference-track analyzer (Demucs + librosa).',
    tech: 'Python · Node.js · MCP · OSC · Anthropic SDK',
  },
  {
    name: 'TortWin',
    href: 'https://github.com/blessdog/chronology_mvp',
    blurb:
      'Medical chronology MVP for personal injury law firms. AWS Textract Medical for OCR, BioClinicalBERT and scispaCy for entity extraction, timeline assembly with duplicate consolidation.',
    tech: 'Python · FastAPI · React · PostgreSQL + pgvector · AWS Textract',
  },
  {
    name: 'JobCanon',
    href: 'https://github.com/blessdog/jobhard',
    blurb:
      'Multi-ATS job application automation — Workday, Greenhouse, Lever — on stable data-automation-id selectors with adaptive fallbacks. Local LLM resolves free-form dropdowns; IMAP polling handles email verification flows.',
    tech: 'Python · Playwright · Ollama · TypeScript rebuild in progress',
  },
];

export async function homeView() {
  const wrap = document.createElement('div');
  wrap.className = 'home';
  wrap.innerHTML = `
    <section class="section home__intro">
      <h1 class="home__name">Ryan Anselman</h1>
      <p class="home__tagline">
        AI product engineer in Denver. Voice AI, MCP-driven agent systems,
        NLP pipelines — designed, built, and shipped solo.
      </p>
      <p class="home__facts">Open to full-time roles · US citizen, no sponsorship needed</p>
      <p class="home__links">
        <a href="/resume.pdf" target="_blank" rel="noopener">resume</a>
        <span class="sep">·</span>
        <a href="https://github.com/blessdog" target="_blank" rel="noopener">github</a>
        <span class="sep">·</span>
        <a href="https://linkedin.com/in/ryan-anselman" target="_blank" rel="noopener">linkedin</a>
        <span class="sep">·</span>
        <a href="mailto:hire@anselman.com">hire@anselman.com</a>
      </p>
    </section>

    <section class="section">
      <h2 class="section__title">About</h2>
      <div class="section__body">
        <p>
          Since 2024 I've been building AI products end to end and shipping
          them: Write-On, a macOS voice transcription app in daily production
          use; YapZapp, voice-to-intent capture with LLM routing; BlessDog, a
          dual-MCP-server system driving Ableton Live through 40+ agent tools;
          TortWin, a clinical-NLP chronology pipeline; JobCanon, multi-ATS
          browser automation. I work the full stack — Swift on macOS/iOS,
          Python and TypeScript services, React and vanilla-JS frontends,
          Postgres — and I ship.
        </p>
        <p>
          Before that: firmware validation at Micron — Python test automation
          for SSD and memory controllers — and network infrastructure
          buildouts for Meta data centers, where I was promoted to project
          lead mid-engagement and finished the buildout on schedule. Before
          any of that I sold, door to door and then as a team lead carrying my
          own quota — which is why customer discovery is part of how I build,
          not a separate department.
        </p>
      </div>
    </section>

    <section class="section">
      <h2 class="section__title">Selected work</h2>
      <div class="section__body home__projects"></div>
    </section>

    <section class="section">
      <h2 class="section__title">Elsewhere</h2>
      <div class="section__body">
        <p><a href="/feed">Notes feed</a> — things I'm building and thinking about, posted as they happen.</p>
      </div>
    </section>

    <section class="section home__quote">
      <h2 class="section__title">Quote of the day</h2>
      <div class="section__body">
        <p class="home__quote-text">&hellip;</p>
        <p class="home__quote-author">&nbsp;</p>
      </div>
    </section>
  `;

  const projectsEl = wrap.querySelector('.home__projects');
  for (const p of PROJECTS) {
    const art = document.createElement('article');
    art.className = 'project';
    art.innerHTML = `
      <h3 class="project__name"><a href="${p.href}" target="_blank" rel="noopener">${esc(p.name)}</a></h3>
      <p class="project__blurb">${esc(p.blurb)}</p>
      <p class="project__tech">${esc(p.tech)}</p>
    `;
    projectsEl.appendChild(art);
  }

  const [text, author] = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  wrap.querySelector('.home__quote-text').textContent = `“${text}”`;
  wrap.querySelector('.home__quote-author').textContent = `— ${author}`;

  return wrap;
}

const QUOTES = [
  ['Civilization is like a thin layer of ice upon a deep ocean of chaos and darkness.', 'Werner Herzog'],
  ['The poet must not avert his eyes.', 'Werner Herzog'],
  ['Tourism is sin, and travel on foot virtue.', 'Werner Herzog'],
  ['Beauty is mysterious as well as terrible. God and the devil are fighting there, and the battlefield is the heart of man.', 'Fyodor Dostoevsky'],
  ["Above all, don't lie to yourself.", 'Fyodor Dostoevsky'],
  ['The mystery of human existence lies not in just staying alive, but in finding something to live for.', 'Fyodor Dostoevsky'],
  ['Everyone thinks of changing the world, but no one thinks of changing himself.', 'Leo Tolstoy'],
  ['No man ever steps in the same river twice, for it is not the same river and he is not the same man.', 'Heraclitus'],
  ['Anxiety is the dizziness of freedom.', 'Søren Kierkegaard'],
  ['Life can only be understood backwards; but it must be lived forwards.', 'Søren Kierkegaard'],
  ['Whereof one cannot speak, thereof one must be silent.', 'Ludwig Wittgenstein'],
  ['Attention is the rarest and purest form of generosity.', 'Simone Weil'],
  ['All sins are attempts to fill voids.', 'Simone Weil'],
  ['When I let go of what I am, I become what I might be.', 'Lao Tzu'],
  ['The mind of the perfect man is like a mirror. It grasps nothing. It expects nothing. It reflects but does not hold.', 'Chuang Tzu'],
  ['I have always imagined that Paradise will be a kind of library.', 'Jorge Luis Borges'],
  ["Don't talk unless you can improve the silence.", 'Jorge Luis Borges'],
  ['The inferno of the living is not something that will be; if there is one, it is what is already here, the inferno where we live every day.', 'Italo Calvino'],
  ['Be patient toward all that is unsolved in your heart and try to love the questions themselves.', 'Rainer Maria Rilke'],
  ['The only journey is the one within.', 'Rainer Maria Rilke'],
  ['A book must be the axe for the frozen sea within us.', 'Franz Kafka'],
  ['From a certain point onward there is no longer any turning back. That is the point that must be reached.', 'Franz Kafka'],
  ['In the depth of winter, I finally learned that there was within me an invincible summer.', 'Albert Camus'],
  ['Between the wish and the thing the world lies waiting.', 'Cormac McCarthy'],
  ['You forget what you want to remember, and you remember what you want to forget.', 'Cormac McCarthy'],
  ['How we spend our days is, of course, how we spend our lives.', 'Annie Dillard'],
  ['We do not remember days, we remember moments.', 'Cesare Pavese'],
  ['The richness of life lies in memories we have forgotten.', 'Cesare Pavese'],
  ['Every man is born as many men and dies as a single one.', 'Martin Heidegger'],
  ['Do not seek to follow in the footsteps of the wise. Seek what they sought.', 'Matsuo Bashō'],
  ['Talent hits a target no one else can hit; genius hits a target no one else can see.', 'Arthur Schopenhauer'],
  ["The past is never dead. It's not even past.", 'William Faulkner'],
];

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
