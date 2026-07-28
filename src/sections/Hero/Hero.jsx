import styles from './Hero.module.css'
import Trace from '../../components/Trace/Trace.jsx'
import { site, trace } from '../../content/site.js'

export default function Hero() {
  return (
    <section className={styles.hero} id="top">
      <div className={styles.shell}>
        <p className={styles.eyebrow}>
          {site.role} <span aria-hidden="true">·</span> {site.location}
        </p>

        <h1 className={styles.headline}>{site.headline}</h1>

        <p className={styles.intro}>{site.intro}</p>

        <div className={styles.diagram}>
          <Trace {...trace} />
        </div>
      </div>
    </section>
  )
}
