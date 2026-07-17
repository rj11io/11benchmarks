import type { ReactNode } from "react"

import { cv, type ExperienceItem } from "./content"
import styles from "./cv.module.css"
import { Toolbar } from "./toolbar"

function Sep() {
  return (
    <span className={styles.contactSep} aria-hidden="true">
      ·
    </span>
  )
}

function Experience({ item }: { item: ExperienceItem }) {
  return (
    <article className={styles.exp}>
      <div className={styles.expHead}>
        <h3 className={styles.expRole}>{item.role}</h3>
        <span className={styles.expPeriod}>{item.period}</span>
      </div>
      <p className={styles.expCompany}>
        {item.href ? (
          <a
            className={styles.link}
            href={item.href}
            target="_blank"
            rel="noreferrer"
          >
            {item.company}
          </a>
        ) : (
          item.company
        )}
        {item.meta ? (
          <>
            {" · "}
            {item.meta}
          </>
        ) : null}
      </p>
      {item.lead ? <p className={styles.expLead}>{item.lead}</p> : null}
      {item.bullets.length > 0 ? (
        <ul className={styles.bullets}>
          {item.bullets.map((b) => (
            <li key={b} className={styles.bullet}>
              {b}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  )
}

function Section({
  title,
  children,
  rail = false,
}: {
  title: string
  children: ReactNode
  rail?: boolean
}) {
  return (
    <section className={rail ? styles.railSection : styles.section}>
      <h2 className={styles.eyebrow}>{title}</h2>
      {children}
    </section>
  )
}

export default function Page() {
  const page1Roles = cv.experience.slice(0, 3)
  const page2Roles = cv.experience.slice(3)

  return (
    <main className={styles.viewport}>
      <Toolbar />

      {/* ---------------------------------------------------------------- */}
      {/* Page 1                                                            */}
      {/* ---------------------------------------------------------------- */}
      <div className={styles.sheet}>
        <header className={styles.masthead}>
          <div className={styles.mastheadTop}>
            <h1 className={styles.name}>
              {cv.name}
              <span className={styles.role}>{cv.title}</span>
            </h1>
            <span className={styles.siteTag}>{cv.site}</span>
          </div>
          <div className={styles.contactRow}>
            <span className={styles.contactItem}>{cv.location}</span>
            <Sep />
            <a className={styles.link} href={`mailto:${cv.email}`}>
              {cv.email}
            </a>
            {cv.links.map((l) => (
              <span key={l.href} className={styles.contactItem}>
                <Sep />{" "}
                <a
                  className={styles.link}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {l.label}
                </a>
              </span>
            ))}
          </div>
        </header>

        <section className={styles.summary} aria-label="Summary">
          {cv.summary.map((p, i) => (
            <p key={i} className={styles.summaryText}>
              {p}
            </p>
          ))}
        </section>

        <div className={styles.grid}>
          <div className={styles.main}>
            <Section title="Experience">
              {page1Roles.map((item) => (
                <Experience key={item.role + item.period} item={item} />
              ))}
            </Section>
          </div>

          <aside className={styles.rail}>
            <Section title="Skills" rail>
              {cv.skills.map((group) => (
                <div key={group.label} className={styles.skillGroup}>
                  <p className={styles.skillLabel}>{group.label}</p>
                  <p className={styles.skillItems}>{group.items.join(" · ")}</p>
                </div>
              ))}
            </Section>
          </aside>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Page 2                                                            */}
      {/* ---------------------------------------------------------------- */}
      <div className={styles.sheet}>
        <div className={styles.runningHead} aria-hidden="true">
          <span className={styles.runningName}>
            {cv.name} <em>{cv.title}</em>
          </span>
          <span className={styles.runningMeta}>{cv.site} · page 2 / 2</span>
        </div>

        <div className={styles.grid}>
          <div className={styles.main}>
            <Section title="Experience — continued">
              {page2Roles.map((item) => (
                <Experience key={item.role + item.period} item={item} />
              ))}
              <div className={styles.earlier}>
                <p className={styles.earlierBody}>
                  <span className={styles.earlierLabel}>
                    {cv.earlier.label}:
                  </span>{" "}
                  {cv.earlier.entries.join("; ")}.
                </p>
              </div>
            </Section>
          </div>

          <aside className={styles.rail}>
            <Section title="Projects" rail>
              {cv.projects.map((p) => (
                <div key={p.name} className={styles.project}>
                  <div className={styles.projTop}>
                    <h3 className={styles.projName}>{p.name}</h3>
                    <span className={styles.projPeriod}>{p.period}</span>
                  </div>
                  <a
                    className={`${styles.link} ${styles.projDomain}`}
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {p.domain}
                  </a>
                  <p className={styles.projBlurb}>{p.blurb}</p>
                </div>
              ))}
            </Section>

            <Section title="Education" rail>
              {cv.education.map((e) => (
                <div key={e.program} className={styles.edu}>
                  <h3 className={styles.eduProgram}>{e.program}</h3>
                  <p className={styles.eduMeta}>
                    {e.school} · {e.place}
                  </p>
                  <p className={styles.eduPeriod}>{e.period}</p>
                  <p className={`${styles.eduMeta} ${styles.eduNote}`}>
                    {e.note}
                  </p>
                </div>
              ))}
            </Section>

            <Section title="Beyond the résumé" rail>
              <ul className={styles.beyond}>
                {cv.beyond.map((b) => (
                  <li key={b} className={styles.beyondItem}>
                    {b}
                  </li>
                ))}
              </ul>
            </Section>
          </aside>
        </div>
      </div>
    </main>
  )
}
