import { useRef, useState } from 'react'
import styles from './Trace.module.css'
import { spanLegend, layers, defaultSpanId } from '../../content/site.js'

/**
 * An explorable trace waterfall.
 *
 * Spans are tabs and the detail column is their panel — the same shape an APM
 * tool uses when you click a span. That gives keyboard support the semantics
 * already imply: arrow keys move between spans, and the panel is labelled by
 * whichever span is selected.
 *
 * Bars are aria-hidden; the row text already states the label and duration.
 */
export default function Trace({ operation, total, spans }) {
  const [selectedId, setSelectedId] = useState(defaultSpanId)
  const tabRefs = useRef(new Map())

  const selectedIndex = spans.findIndex((span) => span.id === selectedId)
  const selected = spans[selectedIndex] ?? spans[0]
  const layer = layers[selected.kind]

  function select(index) {
    const next = spans[(index + spans.length) % spans.length]
    setSelectedId(next.id)
    tabRefs.current.get(next.id)?.focus()
  }

  function handleKeyDown(event) {
    const moves = {
      ArrowDown: selectedIndex + 1,
      ArrowRight: selectedIndex + 1,
      ArrowUp: selectedIndex - 1,
      ArrowLeft: selectedIndex - 1,
      Home: 0,
      End: spans.length - 1,
    }

    if (!(event.key in moves)) return
    event.preventDefault()
    select(moves[event.key])
  }

  return (
    <figure className={styles.trace}>
      <div className={styles.head}>
        <span className={styles.operation}>{operation}</span>
        <span className={styles.total}>{total} ms</span>
      </div>

      <div className={styles.body}>
        <div
          className={styles.spans}
          role="tablist"
          aria-orientation="vertical"
          aria-label="Spans in this request"
          onKeyDown={handleKeyDown}
        >
          {spans.map((span, i) => {
            const isSelected = span.id === selected.id

            return (
              <button
                key={span.id}
                type="button"
                id={`span-${span.id}`}
                role="tab"
                aria-selected={isSelected}
                aria-controls="span-detail"
                tabIndex={isSelected ? 0 : -1}
                ref={(node) => {
                  if (node) tabRefs.current.set(span.id, node)
                  else tabRefs.current.delete(span.id)
                }}
                onClick={() => setSelectedId(span.id)}
                className={styles.span}
                data-selected={isSelected || undefined}
                style={{ '--i': i, '--hue': `var(--${span.kind})` }}
              >
                <span className={styles.label} style={{ '--depth': span.depth }}>
                  {span.label}
                </span>

                <span className={styles.track} aria-hidden="true">
                  <span
                    className={styles.bar}
                    style={{
                      '--start': `${(span.start / total) * 100}%`,
                      '--width': `${(span.dur / total) * 100}%`,
                    }}
                  />
                </span>

                <span className={styles.duration}>{span.dur} ms</span>
              </button>
            )
          })}
        </div>

        <div
          className={styles.detail}
          id="span-detail"
          role="tabpanel"
          aria-labelledby={`span-${selected.id}`}
          tabIndex={-1}
          key={selected.kind}
          style={{ '--hue': `var(--${selected.kind})` }}
        >
          <h3 className={styles.layer}>{layer.title}</h3>
          <p className={styles.does}>{layer.does}</p>
          <ul className={styles.items}>
            {layer.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <figcaption className={styles.caption}>
        <ul className={styles.legend}>
          {spanLegend.map((entry) => (
            <li key={entry.kind} style={{ '--hue': `var(--${entry.kind})` }}>
              {entry.label}
            </li>
          ))}
        </ul>
        <p>
          One request through a service I would build. Pick a span to see what I
          work on at that layer.
        </p>
      </figcaption>
    </figure>
  )
}
