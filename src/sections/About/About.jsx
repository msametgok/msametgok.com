import styles from './About.module.css'
import { site } from '../../content/site.js'

export default function About() {
  return (
    <section className={styles.about} id="about">
      <div className={styles.shell}>
        <h2 className={styles.heading}>About</h2>

        <div className={styles.prose}>
          {site.about.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
