import { useId, useRef, useState } from 'react'
import styles from './ContactForm.module.css'
import { site } from '../../content/site.js'

/*
 * Client-side rules mirror server/lib/validate.js. They exist for fast
 * feedback, not for safety — the server rejects the same things independently.
 */
function validate({ name, email, message }) {
  const errors = {}

  if (!name.trim()) errors.name = 'Enter your name.'
  if (!email.trim()) errors.email = 'Enter an email address so I can reply.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'That does not look like an email address. Check for a typo.'
  }

  if (!message.trim()) errors.message = 'Add a message.'
  else if (message.trim().length < 10) {
    errors.message = 'Tell me a little more — at least 10 characters.'
  }

  return errors
}

const EMPTY = { name: '', email: '', message: '', website: '' }

/*
 * Shown when nothing answered for the API — a dead port, a dropped connection,
 * a proxy or gateway erroring on its own. Distinct from the server's own
 * delivery failure, which arrives as {errors} and speaks for itself.
 */
const UNREACHABLE = 'Could not reach the server. Check your connection and try again.'

/* Focus order when a submit fails, matching the visual order of the fields. */
const ORDER = ['name', 'email', 'message']

export default function ContactForm() {
  const id = useId()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle') // idle | sending | sent

  /*
   * Every field registers here on every render, so focusing the first invalid
   * one works inside the submit handler — before React has re-rendered with the
   * new errors. A conditional ref would still be pointing at the last render.
   */
  const fields = useRef({})
  const register = (key) => (node) => {
    fields.current[key] = node
  }

  const hasErrors = Object.values(errors).some(Boolean)

  const field = (key) => ({
    id: `${id}-${key}`,
    name: key,
    value: values[key],
    onChange: (event) => {
      setValues((prev) => ({ ...prev, [key]: event.target.value }))
      /* Clear a field's error as soon as the visitor edits it. */
      if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
    },
    'aria-invalid': errors[key] ? true : undefined,
    'aria-describedby': errors[key] ? `${id}-${key}-error` : undefined,
  })

  async function handleSubmit(event) {
    event.preventDefault()

    const found = validate(values)
    setErrors(found)

    const firstInvalid = ORDER.find((key) => found[key])
    if (firstInvalid) {
      fields.current[firstInvalid]?.focus()
      return
    }

    setState('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        /*
         * The API refuses in exactly one shape: {errors}. A body that will not
         * parse never came from it — in development that is the Vite proxy
         * answering an empty 500 because the API is not running yet. Blaming
         * delivery there sends you looking at the mailer for a dead port.
         */
        const body = await response.json().catch(() => null)

        setErrors(body?.errors ?? { form: UNREACHABLE })
        setState('idle')
        return
      }

      setValues(EMPTY)
      setErrors({})
      setState('sent')
    } catch {
      setErrors({ form: UNREACHABLE })
      setState('idle')
    }
  }

  /* The readout in the panel head, mirroring the duration in the trace head. */
  const readout =
    state === 'sent' ? 'sent' : state === 'sending' ? 'sending' : hasErrors ? 'error' : 'ready'

  return (
    <div className={styles.panel}>
      <div className={styles.head}>
        <span className={styles.endpoint}>POST /api/contact</span>
        <span className={styles.readout} data-state={readout}>
          {readout}
        </span>
      </div>

      {state === 'sent' ? (
        <div className={styles.sent} role="status">
          <h3 className={styles.sentTitle}>Message sent</h3>
          <p>I read everything that lands here and reply to most of it within a few days.</p>
          <button type="button" className={styles.again} onClick={() => setState('idle')}>
            Send another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.rows}>
            <div className={styles.row} data-invalid={errors.name || undefined}>
              <label className={styles.label} htmlFor={`${id}-name`}>
                Name
              </label>
              <div className={styles.control}>
                <input
                  className={styles.input}
                  type="text"
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  ref={register('name')}
                  {...field('name')}
                />
                {errors.name && (
                  <span className={styles.error} id={`${id}-name-error`}>
                    {errors.name}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.row} data-invalid={errors.email || undefined}>
              <label className={styles.label} htmlFor={`${id}-email`}>
                Email
              </label>
              <div className={styles.control}>
                <input
                  className={styles.input}
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  ref={register('email')}
                  {...field('email')}
                />
                {errors.email && (
                  <span className={styles.error} id={`${id}-email-error`}>
                    {errors.email}
                  </span>
                )}
              </div>
            </div>

            <div
              className={`${styles.row} ${styles.rowTall}`}
              data-invalid={errors.message || undefined}
            >
              <label className={styles.label} htmlFor={`${id}-message`}>
                Message
              </label>
              <div className={styles.control}>
                <textarea
                  className={styles.textarea}
                  rows={5}
                  placeholder="What are you building, and where does it hurt?"
                  ref={register('message')}
                  {...field('message')}
                />
                {errors.message && (
                  <span className={styles.error} id={`${id}-message-error`}>
                    {errors.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/*
            Honeypot. Real people never see it, so anything typed here came from
            a bot filling every field it finds. Hidden from assistive tech too.
          */}
          <p className={styles.trap} aria-hidden="true">
            <label htmlFor={`${id}-website`}>Leave this field empty</label>
            <input
              id={`${id}-website`}
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, website: event.target.value }))
              }
            />
          </p>

          <div className={styles.foot}>
            <button className={styles.submit} type="submit" disabled={state === 'sending'}>
              {state === 'sending' ? 'Sending…' : 'Send message'}
            </button>

            <p className={styles.fallback}>
              or <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
          </div>

          <p className={styles.formError} role="status">
            {errors.form}
          </p>
        </form>
      )}
    </div>
  )
}
