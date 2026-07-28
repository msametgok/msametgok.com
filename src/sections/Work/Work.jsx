import styles from './Work.module.css'
import { projects } from '../../content/projects.js'

export default function Work() {
  return (
    <section className={styles.work} id="work">
      <div className={styles.shell}>
        <h2 className={styles.heading}>Selected work</h2>

        <div className={styles.list}>
          {projects.map((project) => {
            const links = (project.links ?? []).filter((link) => link.href)

            return (
              <article key={project.slug} className={styles.project}>
                <div className={styles.meta}>
                  <span className={styles.year}>{project.year}</span>
                  {links.length > 0 && (
                    <ul className={styles.links}>
                      {links.map((link) => (
                        <li key={link.label}>
                          <a href={link.href}>{link.label}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className={styles.body}>
                  <h3 className={styles.name}>{project.name}</h3>
                  <p className={styles.summary}>{project.summary}</p>

                  <dl className={styles.spec}>
                    <div className={styles.row}>
                      <dt>Role</dt>
                      <dd>{project.role}</dd>
                    </div>
                    <div className={styles.row}>
                      <dt>Stack</dt>
                      <dd>{project.stack.join(' · ')}</dd>
                    </div>
                    {project.scale && (
                      <div className={styles.row}>
                        <dt>Scale</dt>
                        <dd>{project.scale}</dd>
                      </div>
                    )}
                  </dl>

                  {project.notes?.length > 0 && (
                    <div className={styles.notes}>
                      <h4 className={styles.notesHeading}>Decisions</h4>
                      <ul className={styles.noteList}>
                        {project.notes.map((note) => (
                          <li key={note.title} className={styles.note}>
                            <h5 className={styles.noteTitle}>{note.title}</h5>
                            <p className={styles.noteBody}>{note.body}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
