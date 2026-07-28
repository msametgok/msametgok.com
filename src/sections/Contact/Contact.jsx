import styles from './Contact.module.css'
import ContactForm from '../../components/ContactForm/ContactForm.jsx'
import { site } from '../../content/site.js'

export default function Contact() {
  return (
    <section className={styles.contact} id="contact">
      <div className={styles.shell}>
        <div className={styles.intro}>
          <h2 className={styles.heading}>Get in touch</h2>
          <p className={styles.line}>
            Tell me what you are building and where it hurts.
          </p>

          <ul className={styles.links}>
            {site.links.map((link) => (
              <li key={link.label}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <ContactForm />
      </div>

      <div className={styles.foot}>
        <p className={styles.colophon}>
          
        </p>
      </div>
    </section>
  )
}
