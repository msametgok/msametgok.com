/*
 * Validation for the contact form. The client runs the same rules for instant
 * feedback, but this is the copy that decides — a request can arrive without
 * ever touching the form.
 *
 * Error strings are user-facing. Each one says what is wrong and what to do
 * about it, in the site's voice.
 */

const LIMITS = {
  name: { min: 1, max: 100 },
  email: { max: 254 },
  message: { min: 10, max: 5000 },
}

/* Strips CR/LF so a name can never inject extra mail headers. */
const singleLine = (value) => String(value ?? '').replace(/[\r\n]+/g, ' ').trim()

const asText = (value) => String(value ?? '').trim()

/*
 * Deliberately loose. Strict email regexes reject valid addresses; the real
 * test is whether a reply arrives.
 */
const looksLikeEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export function validateContact(body) {
  const name = singleLine(body.name)
  const email = singleLine(body.email).toLowerCase()
  const message = asText(body.message)
  const trapped = asText(body.website).length > 0

  const errors = {}

  if (!name) {
    errors.name = 'Enter your name.'
  } else if (name.length > LIMITS.name.max) {
    errors.name = `Keep your name under ${LIMITS.name.max} characters.`
  }

  if (!email) {
    errors.email = 'Enter an email address so I can reply.'
  } else if (email.length > LIMITS.email.max || !looksLikeEmail(email)) {
    errors.email = 'That does not look like an email address. Check for a typo.'
  }

  if (!message) {
    errors.message = 'Add a message.'
  } else if (message.length < LIMITS.message.min) {
    errors.message = `Tell me a little more — at least ${LIMITS.message.min} characters.`
  } else if (message.length > LIMITS.message.max) {
    errors.message = `That is over ${LIMITS.message.max} characters. Trim it down or email me directly.`
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    value: { name, email, message, trapped },
  }
}

export { LIMITS }
