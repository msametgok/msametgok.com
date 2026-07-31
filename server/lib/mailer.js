/*
 * Delivery for contact messages, over Resend's HTTPS API.
 *
 * This spoke SMTP until it met production. Render blackholes outbound SMTP, so
 * a send from a deployed instance hung until the visitor gave up, while the
 * same code and credential delivered in half a second from a laptop. Port 443
 * is the one port a host cannot block without breaking itself.
 *
 * Without credentials the server logs submissions instead of sending them, so
 * the form works end to end in development and nothing fails silently.
 */

const ENDPOINT = 'https://api.resend.com/emails'

/*
 * A send must never outlast a visitor's patience. SMTP had no bound, which is
 * exactly how a blocked port turned into a button that span forever; this drops
 * into the route's 502 branch instead, which points them at the mailto link.
 */
const TIMEOUT_MS = 10_000

const config = {
  /*
   * Resend's SMTP password was always the API key, so an existing SMTP_PASS
   * keeps working and no redeploy needs new environment variables. Prefer the
   * honest name when it is set.
   */
  apiKey: process.env.RESEND_API_KEY || process.env.SMTP_PASS,
  to: process.env.CONTACT_TO,
  /*
   * The address mail is sent as. Must be on a domain verified with Resend —
   * never the visitor's address, which would be a spoof and would fail SPF.
   */
  from: process.env.MAIL_FROM || process.env.SMTP_FROM,
}

export const isConfigured = Boolean(config.apiKey && config.to && config.from)

/*
 * A username in the From header is a malformed address, so the provider rejects
 * every send. Catch it at startup rather than on a visitor's first message.
 */
export const fromIsMalformed = isConfigured && !config.from.includes('@')

export async function sendContactMessage({ name, email, message }) {
  if (!isConfigured) {
    console.warn('[contact] Mail is not configured — logging this message instead of sending it.')
    console.info({ name, email, message })
    return
  }

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json',
    },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    body: JSON.stringify({
      /*
       * from is the verified sender; the visitor goes in reply_to, so hitting
       * reply in the inbox reaches them. validateContact has already stripped
       * CR/LF from name, so neither field can smuggle a header.
       */
      from: `Portfolio contact form <${config.from}>`,
      to: [config.to],
      reply_to: `${name} <${email}>`,
      subject: `Message from ${name}`,
      text: `${message}\n\n---\nFrom: ${name} <${email}>\nSent from the contact form on your site.`,
    }),
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Resend answered ${response.status}. ${detail.slice(0, 200)}`)
  }
}
