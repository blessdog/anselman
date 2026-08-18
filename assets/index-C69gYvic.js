(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=[],t=null,n=()=>``;function r(t,n){let r=t.split(`/`).filter(Boolean),i=RegExp(`^/`+r.map(e=>e.startsWith(`:`)?`([^/]+)`:e.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`)).join(`/`)+`/?$`),a=r.filter(e=>e.startsWith(`:`)).map(e=>e.slice(1));e.push({re:i,params:a,handler:n})}function i(e){n=e}function a(e){t=e}function o(e,{replace:t=!1}={}){t?history.replaceState({},``,e):history.pushState({},``,e),c()}function s(t){for(let n of e){let e=t.match(n.re);if(e){let t={};return n.params.forEach((n,r)=>t[n]=decodeURIComponent(e[r+1])),{handler:n.handler,params:t}}}return null}async function c(){if(!t){console.warn(`[router] no outlet set, skipping render`);return}let e=location.pathname||`/`,r=s(e);console.log(`[router] render path=%s matched=%s`,e,!!r);try{let e=r?await r.handler({params:r.params,outlet:t}):await n({outlet:t});t.innerHTML=``,e instanceof Node?t.appendChild(e):typeof e==`string`?t.innerHTML=e:console.warn(`[router] handler returned %o (not Node/string)`,e)}catch(e){console.error(`[router] handler threw:`,e),t.innerHTML=`<pre style="color:#ff8a8a;white-space:pre-wrap;text-shadow:var(--tshadow)">[router] ${l(String(e&&e.stack||e))}</pre>`}}function l(e){return e.replace(/[&<>]/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`})[e])}function u(e){if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;let t=e.target.closest(`a`);if(!t)return;let n=t.getAttribute(`href`);if(!n||n.startsWith(`#`)||t.target===`_blank`||t.hasAttribute(`download`))return;let r=new URL(t.href,location.origin);r.origin===location.origin&&(e.preventDefault(),o(r.pathname+r.search+r.hash))}function d(){document.addEventListener(`click`,u),window.addEventListener(`popstate`,c),c()}var f=[{slug:`the-website-got-smaller`,date:`2026-07-09`,title:`The website got smaller`,dek:`A public portfolio does not need an authentication system, a database, or a miniature CMS to prove that its owner can engineer software.`,tags:[`architecture`,`web`],paragraphs:[`The old version of this site made every public page depend on an application stack that visitors never asked for. The notes page went through a hosted database. Publishing required authentication, uploads, transcription, rich media, and a collection of client-side recovery paths. That is a lot of surface area for a portfolio.`,`This version is deliberately smaller. Notes live in source control, the public page renders without a network request, and the RSS file is generated from the same data during the build. There is one source of truth and very little that can fail between the first byte and the reader.`,`Complexity is worth paying for when it creates leverage. When it mainly creates more states to debug, subtraction is the engineering work.`]},{slug:`tools-need-contracts`,date:`2026-06-24`,title:`Agent tools still need ordinary contracts`,dek:`The useful part of an agent system is not that a model can call a tool. It is that the boundary around the tool is explicit, observable, and recoverable.`,tags:[`mcp`,`systems`],paragraphs:[`BlessDog exposes more than 40 operations for controlling Ableton Live. The model-facing layer is the newest part of the stack; underneath it are familiar engineering concerns: typed inputs, bounded side effects, transport reliability, idempotent operations, and error messages that preserve enough context to recover.`,`Separating the MCP tool server from the OSC bridge turned out to be more important than making prompts clever. Each boundary has a narrow job, each can be tested independently, and failures have a place to live. The same rule applies to any automation system: make state and responsibility visible before making the interface magical.`]},{slug:`voice-is-a-state-machine`,date:`2026-05-18`,title:`Voice interfaces are state machines`,dek:`A transcription demo can stop at words on a screen. A usable voice product has to make capture, latency, interruption, correction, and recovery legible.`,tags:[`voice`,`product engineering`],paragraphs:[`In Write-On, the difficult work is around the stream: deciding when capture begins, what pause means, which utterance is still provisional, how a user resumes, and what the interface shows when the network or microphone disagrees with the happy path.`,`A last-utterance preview and explicit pause-and-resume behavior sound like interface details. They are really projections of the application state model. Once the underlying states are coherent, the UI can be quiet. When they are not, animation and copy cannot rescue the experience.`]}],p=[{eyebrow:`Realtime desktop systems`,name:`Write-On`,href:`https://write-on.app`,blurb:`A native macOS transcription app built around live audio capture, Deepgram Nova-3 streaming, explicit pause-and-resume state, and a last-utterance preview.`,tech:`Swift / SwiftUI / AVFoundation / Deepgram`},{eyebrow:`Tool protocols & automation`,name:`BlessDog Music System`,href:`https://github.com/blessdog/blessdog`,blurb:`A dual-MCP-server architecture that exposes 40+ typed tools for Ableton Live, backed by an OSC bridge, sample indexing, session templates, and audio analysis.`,tech:`Python / Node.js / MCP / OSC / Demucs / librosa`},{eyebrow:`Document intelligence`,name:`TortWin`,href:`https://github.com/blessdog/chronology_mvp`,blurb:`An end-to-end medical chronology pipeline: OCR, clinical entity extraction, timeline assembly, duplicate consolidation, API services, and vector-backed retrieval.`,tech:`Python / FastAPI / React / PostgreSQL / AWS Textract`},{eyebrow:`Browser & workflow automation`,name:`JobCanon`,href:`https://github.com/blessdog/jobhard`,blurb:`Multi-ATS automation for Workday, Greenhouse, and Lever using stable selectors, adaptive fallbacks, local model-assisted field resolution, and IMAP verification flows.`,tech:`Python / Playwright / TypeScript / Ollama / IMAP`}],m=[{dates:`2024 - present`,role:`Independent Software Engineer`,company:`MatterMixers`,text:`Own product architecture and implementation across native Swift apps, Python and TypeScript services, browser automation, data pipelines, and applied AI. Shipped working systems in voice, music tooling, legal-tech, and workflow automation.`},{dates:`2023 - present`,role:`Network Infrastructure Engineer (contract)`,company:`Iron Systems`,text:`Deploy and support LAN/WAN infrastructure at Meta data-center facilities, including Linux administration, network security, and fiber and copper plant work.`},{dates:`2023`,role:`Network Infrastructure Lead`,company:`Meta data centers, via Ericsson`,text:`Promoted from technician to project lead mid-engagement. Coordinated facility-wide deployments and QA/QC across project management, engineering, and on-site crews; completed the buildout on schedule.`},{dates:`2021 - 2022`,role:`Firmware Validation Engineer`,company:`Micron Technology`,text:`Built Python test automation for memory-controller and SSD firmware, debugged bench failures, caught regressions before production, and maintained C++ components in a distributed review workflow.`}];async function h(){let e=document.createElement(`div`);e.className=`home`,e.innerHTML=`
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
  `;let t=e.querySelector(`.experience-list`);for(let e of m){let n=document.createElement(`article`);n.className=`experience`,n.innerHTML=`
      <p class="experience__dates">${_(e.dates)}</p>
      <div class="experience__body">
        <h3>${_(e.role)}</h3>
        <p class="experience__company">${_(e.company)}</p>
        <p>${_(e.text)}</p>
      </div>
    `,t.appendChild(n)}let n=e.querySelector(`.systems-grid`);for(let e of p){let t=document.createElement(`article`);t.className=`system-card`,t.innerHTML=`
      <p class="eyebrow">${_(e.eyebrow)}</p>
      <h3><a href="${_(e.href)}" target="_blank" rel="noopener">${_(e.name)} <span aria-hidden="true">↗</span></a></h3>
      <p>${_(e.blurb)}</p>
      <p class="system-card__tech">${_(e.tech)}</p>
    `,n.appendChild(t)}let r=e.querySelector(`.notes-preview__list`);for(let e of f.slice(0,2)){let t=document.createElement(`article`);t.className=`note-teaser`,t.innerHTML=`
      <time datetime="${_(e.date)}">${g(e.date)}</time>
      <h3><a href="/notes#${_(e.slug)}">${_(e.title)}</a></h3>
      <p>${_(e.dek)}</p>
    `,r.appendChild(t)}return e}function g(e){return new Intl.DateTimeFormat(`en-US`,{month:`short`,day:`numeric`,year:`numeric`,timeZone:`UTC`}).format(new Date(`${e}T00:00:00Z`))}function _(e){return String(e??``).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}async function v(){let e=document.createElement(`div`);e.className=`notes-page`,e.innerHTML=`
    <header class="page-hero">
      <p class="eyebrow">Field notes / ${f.length} entries</p>
      <h1>Engineering notes from the workbench.</h1>
      <p>Short observations about systems, product decisions, and the parts of software that become visible only after the demo works.</p>
      <a class="text-link" href="/feed.xml" target="_blank" rel="noopener">Subscribe via RSS</a>
    </header>
    <section class="notes-list" aria-label="All notes"></section>
  `;let t=e.querySelector(`.notes-list`);for(let e of f){let n=document.createElement(`article`);n.className=`note`,n.id=e.slug,n.innerHTML=`
      <div class="note__meta">
        <time datetime="${b(e.date)}">${y(e.date)}</time>
        <p>${e.tags.map(b).join(` / `)}</p>
      </div>
      <div class="note__content">
        <h2><a href="#${b(e.slug)}">${b(e.title)}</a></h2>
        <p class="note__dek">${b(e.dek)}</p>
        ${e.paragraphs.map(e=>`<p>${b(e)}</p>`).join(``)}
      </div>
    `,t.appendChild(n)}if(location.hash){let e=decodeURIComponent(location.hash.slice(1));requestAnimationFrame(()=>document.getElementById(e)?.scrollIntoView({block:`start`}))}return e}function y(e){return new Intl.DateTimeFormat(`en-US`,{month:`long`,day:`numeric`,year:`numeric`,timeZone:`UTC`}).format(new Date(`${e}T00:00:00Z`))}function b(e){return String(e??``).replace(/[&<>"']/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`})[e])}r(`/`,h),r(`/notes`,v),r(`/feed`,v),i(async()=>{let e=document.createElement(`section`);return e.className=`section`,e.innerHTML=`
    <p class="eyebrow">404</p>
    <h1 class="not-found__title">That page is not part of the system.</h1>
    <p><a class="text-link" href="/">Return home</a></p>
  `,e}),a(document.getElementById(`root`)),d();