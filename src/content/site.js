/*
 * Site content. Edit this file, not the components.
 *
 * Lines marked TODO are placeholders. Replace them with real details before
 * publishing — an invented job history is worse than an empty section.
 */

export const site = {
  name: 'Mehmet Gok',
  role: 'Backend developer',
  location: 'New York City',

  headline: 'I design and run the services behind the product.',

  intro:
    'Backend developer with full-stack range. I build APIs and data models, ' +
    'keep them fast under real traffic, and own the deploys that carry them. ' +
    'Comfortable enough on the frontend to ship a feature end to end.',

  /*
   * Three short paragraphs: a stance, the stack that follows from it, and the
   * reach past the backend. Stated opinions do the work a biography would —
   * they say what you are like to work with, which a stack list cannot.
   *
   * TODO: read this aloud once and make the voice yours. The opinions have to
   * be ones you would defend in an interview, or they read as borrowed.
   *
   * Technologies stay in the middle paragraph only. The four layers reached
   * through the trace are already the skills list; the moment this becomes a
   * bare roll of technologies it is the skills grid that was deleted for
   * restating the diagram, just set in paragraph form.
   */
  about: [
    'I build the parts of a product people never see, and I have opinions about ' +
      'how. I would rather ship a schema I can explain than a clever one I can’t. ' +
      'I would rather find a bug in a test than in someone’s inbox.',
    'That shows up in the work: Node and Express over Postgres or MongoDB, Redis ' +
      'where state has to be fast or shared, all of it in Docker through CI — ' +
      'tested on both sides, and instrumented so a production problem is visible ' +
      'instead of guesswork.',
    'The frontend knowledge is there so a handoff never becomes a bottleneck. I ' +
      'would rather understand the whole path than defend a boundary.',
  ],

  // Shown as a fallback under the contact form, and where replies should go.
  email: 'msametgok@hotmail.com',

  links: [
    { label: 'GitHub', href: 'https://github.com/msametgok' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/msametgok' },
  ],

  // Availability line in the header. Set to null to hide it.
  status: 'Open to backend roles',
}

/*
 * The hero trace.
 *
 * This is a diagram of a request through a service, not a benchmark — the
 * numbers illustrate shape, not measured performance. Keep it that way, or
 * replace the durations with real ones from a system you actually ran.
 *
 * kind maps to a span color: edge | service | data | async
 * start and dur are in ms; depth controls indentation.
 */
export const trace = {
  operation: 'GET /api/orders',
  total: 78,
  spans: [
    { id: 'edge', label: 'edge · tls + route', kind: 'edge', start: 0, dur: 7, depth: 0 },
    { id: 'auth', label: 'auth · verify token', kind: 'service', start: 5, dur: 11, depth: 1 },
    { id: 'cache', label: 'redis · get session', kind: 'data', start: 16, dur: 4, depth: 2 },
    { id: 'orders', label: 'orders · handler', kind: 'service', start: 20, dur: 44, depth: 1 },
    { id: 'query', label: 'postgres · select', kind: 'data', start: 24, dur: 33, depth: 2 },
    { id: 'queue', label: 'rabbitmq · enqueue', kind: 'async', start: 58, dur: 9, depth: 2 },
    { id: 'resp', label: 'edge · 200 serialize', kind: 'edge', start: 67, dur: 11, depth: 0 },
  ],
}

export const spanLegend = [
  { kind: 'edge', label: 'Edge' },
  { kind: 'service', label: 'Services' },
  { kind: 'data', label: 'Data' },
  { kind: 'async', label: 'Async' },
]

/*
 * What sits at each layer of the trace. Selecting a span in the hero shows the
 * matching entry, so the skills list and the diagram are the same object — edit
 * a layer here and the hero updates.
 *
 * `does` is one plain sentence about the work at that layer, not a slogan.
 */
export const layers = {
  edge: {
    title: 'Edge',
    does: 'Where requests arrive, get authenticated, and get turned away or let through.',
    items: ['REST', 'GraphQL', 'Auth & sessions', 'Rate limiting'],
  },
  service: {
    title: 'Services',
    does: 'Where the business rules live, and where most bugs are worth preventing.',
    items: ['Node.js', 'Express', 'Domain modeling', 'Testing'],
  },
  data: {
    title: 'Data',
    does: 'Where state is kept honest, indexed, and fast to read.',
    items: ['PostgreSQL', 'Redis', 'Schema design', 'Query tuning'],
  },
  async: {
    title: 'Async & ops',
    does: 'Work that outlives the request, and the tooling that keeps it observable.',
    items: ['Queues & workers', 'Docker', 'CI/CD', 'Observability'],
  },
}

/* The span selected before the visitor touches anything. */
export const defaultSpanId = 'query'
