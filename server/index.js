import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import express from 'express'

import { validateContact } from './lib/validate.js'
import { rateLimit } from './lib/rateLimit.js'
import { sendContactMessage, isConfigured, fromIsMalformed } from './lib/mailer.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, '..', 'dist')
const port = Number(process.env.PORT ?? 3001)

const app = express()

/* Behind a reverse proxy this is what makes req.ip the visitor, not the proxy. */
app.set('trust proxy', 1)
app.disable('x-powered-by')
app.use(express.json({ limit: '32kb' }))

app.get('/api/health', (req, res) => {
  res.json({ ok: true, mail: isConfigured ? 'configured' : 'logging only' })
})

app.post('/api/contact', rateLimit({ windowMs: 15 * 60 * 1000, max: 5 }), async (req, res) => {
  const { ok, errors, value } = validateContact(req.body ?? {})

  if (!ok) return res.status(400).json({ errors })

  /*
   * The honeypot was filled, so this is a bot. Answer exactly as if it worked —
   * telling it why it was rejected only helps it try again.
   */
  if (value.trapped) return res.status(202).json({ ok: true })

  try {
    await sendContactMessage(value)
    res.status(202).json({ ok: true })
  } catch (error) {
    console.error('[contact] delivery failed:', error.message)
    res.status(502).json({
      errors: { form: 'The message could not be delivered just now.' },
    })
  }
})

/*
 * In production this process serves the built site too, so deploying is one
 * process and one port. In development Vite serves the site and proxies /api
 * here, so this block does nothing until you have run `npm run build`.
 */
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get('*', (req, res) => res.sendFile(path.join(distDir, 'index.html')))
}

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
  if (!isConfigured) {
    console.warn('Mail is not configured. Messages will be logged here, not delivered.')
  } else if (fromIsMalformed) {
    console.warn('SMTP_FROM is not set to an email address. Sends will be rejected.')
  }
})
