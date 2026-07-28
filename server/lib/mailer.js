import nodemailer from 'nodemailer'

/*
 * Delivery for contact messages.
 *
 * Without SMTP credentials the server logs submissions instead of sending them,
 * so the form works end to end in development and nothing fails silently. Set
 * the SMTP_* vars (see .env.example) to start delivering for real.
 */

const port = Number(process.env.SMTP_PORT ?? 587)

const config = {
  host: process.env.SMTP_HOST,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS,
  to: process.env.CONTACT_TO,
  /*
   * The address mail is sent as. Separate from SMTP_USER because a transactional
   * provider's username is not a mailbox — Resend's is the literal string
   * "resend" — so the two only coincide when authenticating against real inbox.
   */
  from: process.env.SMTP_FROM || process.env.SMTP_USER,
}

export const isConfigured = Boolean(config.host && config.user && config.pass && config.to)

/*
 * A username in the From header is a malformed address, so the provider rejects
 * every send. Catch it at startup rather than on a visitor's first message.
 */
export const fromIsMalformed = isConfigured && !config.from.includes('@')

let transport

function getTransport() {
  transport ??= nodemailer.createTransport({
    host: config.host,
    port,
    secure: port === 465,
    auth: { user: config.user, pass: config.pass },
  })

  return transport
}

export async function sendContactMessage({ name, email, message }) {
  if (!isConfigured) {
    console.warn('[contact] SMTP is not configured — logging this message instead of sending it.')
    console.info({ name, email, message })
    return
  }

  await getTransport().sendMail({
    /*
     * From is always the authenticated mailbox — putting the visitor's address
     * here would be a spoof and would fail SPF. Their address goes in replyTo,
     * so hitting reply in the inbox does the right thing.
     */
    from: { name: 'Portfolio contact form', address: config.from },
    to: config.to,
    replyTo: { name, address: email },
    subject: `Message from ${name}`,
    text: `${message}\n\n---\nFrom: ${name} <${email}>\nSent from the contact form on your site.`,
  })
}
