/*
 * A fixed-window rate limiter, in memory.
 *
 * In memory is the right call here and the wrong call at scale: it resets on
 * restart and does not span instances. For one small site behind one process
 * that is fine, and it avoids a dependency. If this ever runs on more than one
 * instance, move the counter to Redis rather than raising the limit.
 */

const hits = new Map()

export function rateLimit({ windowMs, max }) {
  return function limiter(req, res, next) {
    const now = Date.now()
    const key = req.ip ?? 'unknown'
    const recent = (hits.get(key) ?? []).filter((time) => now - time < windowMs)

    if (recent.length >= max) {
      res.set('Retry-After', String(Math.ceil(windowMs / 1000)))
      return res.status(429).json({
        errors: {
          form: 'That is a lot of messages from one place. Try again in a few minutes.',
        },
      })
    }

    recent.push(now)
    hits.set(key, recent)

    /* Opportunistic cleanup so the map cannot grow without bound. */
    if (hits.size > 5000) {
      for (const [entry, times] of hits) {
        if (!times.some((time) => now - time < windowMs)) hits.delete(entry)
      }
    }

    next()
  }
}
