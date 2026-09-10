export const NOTES = [
  {
    slug: 'the-website-got-smaller',
    date: '2026-07-09',
    title: 'The website got smaller',
    dek: 'A public portfolio does not need an authentication system, a database, or a miniature CMS to prove that its owner can engineer software.',
    tags: ['architecture', 'web'],
    paragraphs: [
      'The old version of this site made every public page depend on an application stack that visitors never asked for. The notes page went through a hosted database. Publishing required authentication, uploads, transcription, rich media, and a collection of client-side recovery paths. That is a lot of surface area for a portfolio.',
      'This version is deliberately smaller. Notes live in source control, the public page renders without a network request, and the RSS file is generated from the same data during the build. There is one source of truth and very little that can fail between the first byte and the reader.',
      'Complexity is worth paying for when it creates leverage. When it mainly creates more states to debug, subtraction is the engineering work.',
    ],
  },
  {
    slug: 'tools-need-contracts',
    date: '2026-06-24',
    title: 'Agent tools still need ordinary contracts',
    dek: 'The useful part of an agent system is not that a model can call a tool. It is that the boundary around the tool is explicit, observable, and recoverable.',
    tags: ['mcp', 'systems'],
    paragraphs: [
      'BlessDog exposes more than 40 operations for controlling Ableton Live. The model-facing layer is the newest part of the stack; underneath it are familiar engineering concerns: typed inputs, bounded side effects, transport reliability, idempotent operations, and error messages that preserve enough context to recover.',
      'Separating the MCP tool server from the OSC bridge turned out to be more important than making prompts clever. Each boundary has a narrow job, each can be tested independently, and failures have a place to live. The same rule applies to any automation system: make state and responsibility visible before making the interface magical.',
    ],
  },
  {
    slug: 'voice-is-a-state-machine',
    date: '2026-05-18',
    title: 'Voice interfaces are state machines',
    dek: 'A transcription demo can stop at words on a screen. A usable voice product has to make capture, latency, interruption, correction, and recovery legible.',
    tags: ['voice', 'product engineering'],
    paragraphs: [
      'In Write-On, the difficult work is around the stream: deciding when capture begins, what pause means, which utterance is still provisional, how a user resumes, and what the interface shows when the network or microphone disagrees with the happy path.',
      'A last-utterance preview and explicit pause-and-resume behavior sound like interface details. They are really projections of the application state model. Once the underlying states are coherent, the UI can be quiet. When they are not, animation and copy cannot rescue the experience.',
    ],
  },
];
