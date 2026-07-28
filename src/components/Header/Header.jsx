import { useEffect, useState } from 'react'
import styles from './Header.module.css'
import { site } from '../../content/site.js'

const SECTIONS = [
  { id: 'work', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
]

export default function Header() {
  const [active, setActive] = useState(null)

  /*
   * Marks the section you are currently in. The observer watches a thin band
   * just under the header rather than the whole viewport, so the active link
   * changes when a section reaches the top — which is what the reader
   * perceives as "being in" it.
   */
  useEffect(() => {
    const elements = SECTIONS.map(({ id }) => document.getElementById(id)).filter(Boolean)
    if (elements.length === 0) return

    const visible = new Set()

    const update = () => {
      /*
       * The last section is usually too short to ever reach the band — the page
       * runs out of scroll first. Once you are at the bottom you are looking at
       * it, so say so.
       */
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4

      if (atBottom) {
        setActive(SECTIONS.at(-1).id)
        return
      }

      const current = SECTIONS.find(({ id }) => visible.has(id))
      setActive(current?.id ?? null)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id)
          else visible.delete(entry.target.id)
        }

        update()
      },
      { rootMargin: '-18% 0px -74% 0px' },
    )

    elements.forEach((element) => observer.observe(element))
    window.addEventListener('scroll', update, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', update)
    }
  }, [])

  return (
    <header className={styles.header}>
      <div className={styles.shell}>
        <a className={styles.name} href="#top">
          {site.name}
        </a>

        <nav className={styles.nav} aria-label="Sections">
          {SECTIONS.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={styles.link}
              data-active={active === section.id || undefined}
              aria-current={active === section.id ? 'true' : undefined}
            >
              {section.label}
            </a>
          ))}
        </nav>

        {site.status && (
          <p className={styles.status}>
            <span className={styles.dot} aria-hidden="true" />
            {site.status}
          </p>
        )}
      </div>
    </header>
  )
}
