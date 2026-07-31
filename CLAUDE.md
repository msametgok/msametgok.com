# msametgok.com

Personal website and developer portfolio for M. Samet Gök.

The site's job is to make a visitor — a hiring manager, a collaborator, a recruiter —
understand what this developer builds and how well they build it, then contact them.
Every decision below serves that. If a feature doesn't help a stranger form an accurate
impression in under two minutes, it doesn't belong on the page.

## Stack

- **Frontend:** React 19 + Vite
- **Language:** JavaScript with ES modules — `import`/`export` only, never `require`
- **Styling:** CSS Modules with CSS custom properties for design tokens
- **Backend:** Node.js + Express in `server/`, ESM. It exists for one reason — the contact
  form needs SMTP credentials that cannot ship to the browser. Keep it that small. A new
  endpoint needs the same justification.
- **Deployment target:** one Node process. `npm start` serves the built `dist/` and the
  API on a single port, so there is no CORS and no second host to manage.

### Decisions you can change

These were chosen without being specified. They are defaults, not constraints — if you
want something else, say so and update this file:

- **Vite** over Next.js, because the site is static and has no server-rendering or SEO
  requirement that a prerendered SPA can't meet.
- **CSS Modules + custom properties** over Tailwind, because a portfolio lives or dies on
  its visual identity, and an explicit token system keeps color/type/spacing decisions in
  one readable place instead of scattered across class strings.
- **JavaScript, not TypeScript.** If the project grows past a handful of data shapes,
  TypeScript is worth revisiting.

## ES modules — non-negotiable

`package.json` sets `"type": "module"`. Everything follows from that:

- Use `import x from './x.js'` and `export default` / `export const`.
- Never use `require()`, `module.exports`, `__dirname`, or `__filename`.
- For a directory path in Node code, derive it:
  `const __dirname = path.dirname(fileURLToPath(import.meta.url))`
- Config files are `.js` and use `export default`. If a tool demands CommonJS, give that
  one file a `.cjs` extension rather than switching the project off ESM.

## Structure

```
src/
  main.jsx           # entry — mounts <App />
  App.jsx            # page composition, top-level layout
  components/        # reusable presentational pieces
    Foo/
      Foo.jsx
      Foo.module.css
  sections/          # one file per page section (Hero, Work, About, Contact)
  content/           # site content as data — see below
  styles/
    tokens.css       # design tokens: color, type scale, spacing, motion
    global.css       # reset, base element styles, focus ring
  hooks/
  lib/               # framework-free helpers
server/
  index.js           # Express app, routes, static serving
  lib/
    validate.js      # contact rules — the authority, mirrored on the client
    mailer.js        # nodemailer transport, or console logging when unconfigured
    rateLimit.js     # in-memory fixed window
public/              # static assets served as-is
```

One component per directory, colocated with its stylesheet. Component files are
`PascalCase.jsx`; everything else is `camelCase.js`.

## Content is data, not markup

Projects, work history, and links live in `src/content/` as exported JS objects — not
hardcoded in JSX. Adding a project should mean editing one data file, never touching a
component.

```js
// src/content/projects.js
export const projects = [
  {
    slug: 'example',
    name: 'Example',
    summary: 'One sentence on what it does and who it is for.',
    role: 'What you personally built.',
    stack: ['React', 'Node'],
    links: { live: '', source: '' },
    year: 2026,
  },
]
```

**Never invent portfolio content.** Project names, descriptions, employers, dates, and
metrics must come from the user. If content is missing, use an obvious placeholder and
tell the user what's needed — a plausible-looking fabricated résumé is worse than a gap.

## Design

**Direction: instrument panel.** Backend work is invisible, so the page's whole job is
making systems legible. It borrows from observability tooling — trace waterfalls, span
colors, latency readouts — because that is the native visual world of the subject.

**Signature element:** the hero trace waterfall (`src/components/Trace/Trace.jsx`). It is
the page's thesis, and it is the only place the design raises its voice. Everything else
stays quiet and typographic on purpose. Do not add a second showpiece — if something new
needs emphasis, it competes with the trace rather than joining it.

The trace is explorable: spans are tabs, and selecting one shows that layer's detail
beside the waterfall. This replaced a separate four-column skills section, which restated
the same four layers the diagram already showed — two elements doing one job. Skills now
live in `layers` in `src/content/site.js` and are reached only through the trace. If a
skills list is ever wanted back as its own section, delete the detail panel rather than
running both.

**Color is semantic, never decorative.** The four span hues each mean one layer of a
system, and they mean the same thing everywhere: `--edge` (network boundary), `--service`
(application code), `--data` (stores and caches), `--async` (queues and workers). Adding a
fifth hue means adding a fifth layer to that model, not picking a nicer color.

**Type:** Archivo for display (heavy, tight tracking), IBM Plex Sans for body, IBM Plex
Mono for every label, timing, and table key. Plex carries engineering heritage rather than
being the default portfolio face; the mono is the vocabulary of the subject, so it does
real work instead of adding flavor.

**Motion:** exactly one orchestrated moment — the trace spans draw in on load, staggered.
Nothing else animates beyond hover feedback. Resist adding scroll reveals.

**The panel is the reusable shape.** White surface, one hairline border, and a head with a
mono label on the left and a live readout on the right. The trace uses it (`GET /api/orders`
· `78 ms`) and so does the contact form (`POST /api/contact` · `ready`). Anything new that
needs to feel part of the page should take this shape rather than invent another.

**The header is sticky**, so its height is a layout constant: `--header-h` in tokens, with
`[id] { scroll-margin-top }` in `global.css` derived from it. Change one and check the
other. The bar must stay a single row at every width — a wrapping sticky header eats the
top of a small screen, which is why availability is hidden below 46rem rather than allowed
to wrap. The active-section marker comes from an IntersectionObserver watching a band just
under the header, plus an explicit at-the-bottom rule, because the last section is too
short to ever reach that band.

Tokens live in `src/styles/tokens.css`. Derive every color and size from them; a raw hex
in a component stylesheet is a bug.

### Identity assets

Both are the trace, not separate marks. If the trace changes, they change.

- **`public/favicon.svg`** — four spans cascading right in the four layer colours. No
  background, so it reads on light and dark browser chrome. Square corners, like
  everything else here. SVG only; there is no `.ico` or apple-touch-icon yet.
- **`public/og.jpg`** — the share card, exported from `design/og-card.html`. That artboard
  lives outside `public/` so the build never ships it, and it hardcodes the site's tokens
  so the card cannot drift from the page.

The card is a 1.91:1 box centred on a background of the same colour. That is deliberate:
the export does not have to be exactly 1.91:1, because any centre crop lands on the card.
Nothing important may sit outside that box.

To re-export: run the dev server, open `/design/og-card.html`, screenshot the viewport,
and save it as `public/og.jpg`. Then update `og:image:width` and `og:image:height` in
`index.html` to the real pixel size — stale dimensions there make platforms lay the card
out wrong.

Hold this quality floor on anything built:

- **Responsive to mobile.** Test at 375px, not just desktop.
- **Visible keyboard focus.** Never `outline: none` without a replacement indicator.
  Every interactive element is reachable and operable by keyboard.
- **Reduced motion respected.** Wrap non-essential animation in
  `@media (prefers-reduced-motion: no-preference)`.
- **Semantic HTML.** One `<h1>`, real landmarks, `<a>` for navigation and `<button>` for
  actions. Images carry meaningful `alt` text.
- **Contrast** at WCAG AA or better for body text.

Copy is design material. Write in active voice and sentence case, name things the way a
visitor would, and let each element do one job. Buttons say what happens when pressed
("Send message", not "Submit"), and the wording stays consistent through a flow.

## Conventions

- Function components with hooks. No class components.
- Derive state during render rather than syncing it with `useEffect`. Reach for an effect
  only to synchronize with something outside React.
- Keep components presentational; put logic in `hooks/` or `lib/`.
- No dependency without a reason. A date formatter or an icon set is not worth a package
  when a few lines of local code do the job — bundle size is a design constraint on a
  portfolio, since the first impression is how fast it loads.

## The contact form

`POST /api/contact` takes `{ name, email, message, website }` and answers `202 {ok:true}`
or `400 {errors:{field:message}}`. Four things are load-bearing:

- **The server validates independently.** `src/components/ContactForm` mirrors the rules
  for fast feedback, but a request can arrive without ever touching the form. Change a
  rule in `server/lib/validate.js` first, then mirror it.
- **`website` is a honeypot.** People never see it. When it is filled the server answers
  exactly as if the send succeeded — explaining the rejection only teaches the bot.
- **`from` is always the verified sender**, never the visitor's address. Putting
  their address in `from` is a spoof and fails SPF. It goes in `reply_to`, so replying
  from the inbox reaches them.
- **Names are stripped of CR/LF** before reaching a mail header, or a name becomes a
  header injection.

Without mail env vars the server logs messages instead of sending them, and says so at
startup. That keeps development working without credentials and makes an unconfigured
production deploy obvious rather than silent. Copy `.env.example` to `.env` to configure;
`.env` is gitignored and must stay that way.

**Mail leaves over Resend's HTTPS API, not SMTP.** This is not a preference. The form
spoke SMTP first and worked locally in half a second, then hung forever from Render,
which blackholes outbound SMTP the way many hosts do — a green health check and a button
that spins until the visitor leaves. Port 443 is the one port a host cannot block. Any
future transport must be reachable from inside a PaaS, and any send must be bounded by a
timeout so a stalled network call fails into the 502 branch instead of hanging the
request. Sending needs no dependency: `fetch` is global in Node.

Use a transactional provider (Resend, Brevo, Mailgun, Postmark) as the sender rather than
a personal Hotmail account — Microsoft has been turning off SMTP password auth for
personal accounts, and provider-sent mail is far less likely to be filtered as spam.

## Commands

```
npm run dev       # site on :5173, proxies /api to :3001
npm run dev:api   # API on :3001, restarts on change
npm run build     # production build to dist/
npm start         # one process: serves dist/ and the API
```

`dev` and `dev:api` are separate processes — run them in two terminals.

Verify visual changes in a browser before reporting them done. A build that compiles is
not the same as a page that looks right.

## Open questions

Unresolved — ask rather than assume:

- Which projects go on the site, and what to say about each
- Whether a contact form is needed (this is the only thing likely to force a backend)
- The visual direction, which drives palette, typography, and the page's signature element
