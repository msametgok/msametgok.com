/*
 * Projects. Adding one means editing this array and nothing else.
 *
 * Every entry here must be real. `scale` is optional — give it a number you can
 * defend in an interview, or omit the field and the row will not render. Omit a
 * field entirely rather than leaving TODO on a live site.
 *
 * `notes` is optional too, and it is what turns a listing into evidence: a
 * feature list says what the thing does, notes say why it is built that way.
 * Only the second one is hard to fake.
 */

export const projects = [
  {
    slug: 'real-time-chat',
    name: 'Real-time chat',
    year: '2025–2026',
    summary:
      'A one-to-one and group messaging app where presence, typing, delivery ' +
      'and read receipts all ride a single Socket.IO connection, and message ' +
      'bodies are encrypted at rest.',
    role:
      'Built solo, end to end: the socket event contract and its handlers, the ' +
      'Mongo schema, Redis-backed presence and chat caching, and the React client.',
    stack: ['Node.js', 'Express', 'Socket.IO', 'MongoDB', 'Redis', 'React'],

    /*
     * Decisions, not features. Each one is a call that could have gone the other
     * way, with the reason it did not — that is the part a feature list cannot
     * show. Keep them to two sentences; this section is skimmed, not studied.
     */
    notes: [
      {
        title: 'Unread counts are computed, never cached',
        body:
          'The chat list sits in Redis for five minutes and is invalidated when a ' +
          'message is created — but not when one is read. A cached count would keep ' +
          'badging a chat you had already opened, so it is recomputed on every fetch ' +
          'and incremented on the client in between.',
      },
      {
        title: 'Deleting a chat hides it for one person, not both',
        body:
          'It used to remove the chat and every message for both participants, so one ' +
          'person tidying their sidebar destroyed the other’s history. It is now a ' +
          'per-user soft delete, and a new message un-hides it — which needs its own ' +
          'event, because a hidden user has left the chat’s socket room and the normal ' +
          'broadcast cannot reach them.',
      },
      {
        title: 'Presence is a set of sockets in Redis, not a flag in Mongo',
        body:
          'An online boolean on the user document goes stale the moment a process dies ' +
          'without cleaning up. Tracking open socket ids per user stays correct across ' +
          'multiple tabs and lets last-seen expire on its own.',
      },
      {
        title: 'Removing a group member is ordered, not just executed',
        body:
          'Their sockets have to leave the room before the group-updated broadcast goes ' +
          'out, or the notice that someone was removed is delivered to the person who ' +
          'was just removed.',
      },
    ],

    /*
     * The Live link is filtered out while its href is empty, so it costs nothing
     * to keep the slot here. Fill it in when the app is deployed.
     */
    links: [
      { label: 'Source', href: 'https://github.com/msametgok/real-time-chat' },
      { label: 'Live demo', href: '' },
    ],
  },
]
