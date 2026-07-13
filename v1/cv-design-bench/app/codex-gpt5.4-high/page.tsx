import { Fragment } from "react"

import { loadCV, type Entry, type Profile, type SkillGroup } from "@/lib/cv"
import { Inline } from "@/lib/cv/markdown"

import styles from "./cv.module.css"
import { PrintButton } from "./print-button"

const BODY_LINK =
  "underline decoration-[color:var(--cv-line)] underline-offset-[0.2em] transition-colors duration-200 hover:text-[color:var(--cv-accent)] hover:decoration-[color:var(--cv-accent)]"

type ContactItem = {
  label: string
  value: string
  href?: string
}

function stripProtocol(value: string) {
  return value.replace(/^https?:\/\//, "").replace(/\/$/, "")
}

function titleCase(value: string) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function isUrl(value: string) {
  return /^https?:\/\//.test(value)
}

function buildContactItems(meta: Record<string, string>): ContactItem[] {
  const items: ContactItem[] = []

  if (meta.location) {
    items.push({ label: "Base", value: meta.location })
  }

  if (meta.email) {
    items.push({
      label: "Email",
      value: meta.email,
      href: `mailto:${meta.email}`,
    })
  }

  if (meta.website) {
    const href = meta.website.startsWith("http")
      ? meta.website
      : `https://${meta.website}`
    items.push({
      label: "Website",
      value: stripProtocol(href),
      href,
    })
  }

  if (meta.linkedin) {
    const href = meta.linkedin.startsWith("http")
      ? meta.linkedin
      : `https://www.linkedin.com/in/${meta.linkedin}`
    const handle = stripProtocol(href).replace(/^www\./, "")
    items.push({
      label: "LinkedIn",
      value: handle,
      href,
    })
  }

  if (meta.github) {
    const href = meta.github.startsWith("http")
      ? meta.github
      : `https://github.com/${meta.github}`
    items.push({
      label: "GitHub",
      value: stripProtocol(href).replace(/^www\./, ""),
      href,
    })
  }

  for (const [key, value] of Object.entries(meta)) {
    if (["location", "email", "website", "linkedin", "github"].includes(key)) {
      continue
    }

    if (!value) continue

    items.push({
      label: titleCase(key),
      value: value,
      href: isUrl(value) ? value : undefined,
    })
  }

  return items
}

function metaGroups(meta: Entry["meta"]) {
  const primary = meta.company ?? meta.school ?? ""
  const supporting = [
    meta.location,
    ...Object.entries(meta)
      .filter(
        ([key]) =>
          !["company", "school", "period", "location", "url"].includes(key)
      )
      .map(([, value]) => value),
  ].filter(Boolean) as string[]

  return {
    primary,
    supporting,
    url: meta.url,
  }
}

function SectionHeading({ label }: { label: string }) {
  return (
    <div className="mb-5 flex items-center gap-4 print:mb-3">
      <h2
        className={`${styles.sectionTitle} font-[family-name:var(--font-cv-mono)] text-[11px] font-medium tracking-[0.26em] text-[color:var(--cv-accent)] uppercase`}
      >
        {label}
      </h2>
      <span aria-hidden className="h-px flex-1 bg-[color:var(--cv-line)]" />
    </div>
  )
}

function ContactRail({ profile }: { profile: Profile }) {
  const contacts = buildContactItems(profile.meta)

  if (contacts.length === 0) return null

  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 lg:gap-3 print:grid-cols-2 print:gap-x-6 print:gap-y-3">
      {contacts.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className="grid gap-1 border-t border-[color:var(--cv-line)] pt-3"
        >
          <dt className="font-[family-name:var(--font-cv-mono)] text-[10px] font-medium tracking-[0.22em] text-[color:var(--cv-soft)] uppercase">
            {item.label}
          </dt>
          <dd className="min-w-0 text-[0.95rem] leading-snug text-[color:var(--cv-ink)]">
            {item.href ? (
              <a
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className={`${BODY_LINK} break-all`}
              >
                {item.value}
              </a>
            ) : (
              item.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function Summary({ paragraphs }: { paragraphs: string[] }) {
  if (paragraphs.length === 0) return null

  return (
    <section className="space-y-5 print:space-y-4">
      <SectionHeading label="Profile" />
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p
            key={`${paragraph.slice(0, 24)}-${index}`}
            className={
              index === 0
                ? `${styles.summaryLead} text-[color:var(--cv-ink)]`
                : `${styles.summaryBody} text-[color:var(--cv-soft)]`
            }
          >
            <Inline text={paragraph} linkClassName={BODY_LINK} />
          </p>
        ))}
      </div>
    </section>
  )
}

function SkillGroups({ groups }: { groups: SkillGroup[] }) {
  if (groups.length === 0) return null

  return (
    <section className="space-y-4 print:space-y-3">
      <SectionHeading label="Capabilities" />
      <div className="space-y-3">
        {groups.map((group) => (
          <article
            key={group.name}
            className={`${styles.skillsCard} rounded-[1.35rem] border border-[color:var(--cv-line)] bg-[color:var(--cv-panel)] p-4 sm:p-5 print:rounded-none print:border-x-0 print:border-b-0 print:bg-transparent print:px-0 print:py-3`}
          >
            <h3 className="font-[family-name:var(--font-cv-mono)] text-[10px] font-medium tracking-[0.2em] text-[color:var(--cv-soft)] uppercase">
              {group.name}
            </h3>
            <p className="mt-2 text-[0.96rem] leading-7 text-[color:var(--cv-ink)]">
              {group.items.map((item, index) => (
                <Fragment key={`${group.name}-${index}`}>
                  {index > 0 && (
                    <span
                      aria-hidden
                      className="text-[color:var(--cv-accent)] opacity-50"
                    >
                      {" "}
                      /{" "}
                    </span>
                  )}
                  <Inline text={item} linkClassName={BODY_LINK} />
                </Fragment>
              ))}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

function EntryBlock({ entry }: { entry: Entry }) {
  const meta = metaGroups(entry.meta)
  const keepTogether = entry.paragraphs.length <= 1 && entry.bullets.length <= 4

  return (
    <article
      className={`${keepTogether ? styles.avoidBreak : ""} relative pb-8 pl-7 last:pb-0 print:pb-5`}
    >
      <span aria-hidden className={styles.timelineDot} />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h3 className="font-[family-name:var(--font-cv-serif)] text-[1.55rem] leading-[1.02] font-semibold tracking-[-0.02em] text-[color:var(--cv-ink)] sm:text-[1.72rem]">
            <Inline text={entry.heading} linkClassName={BODY_LINK} />
          </h3>

          {(meta.primary || meta.url || meta.supporting.length > 0) && (
            <div className="mt-2 space-y-1.5">
              {(meta.primary || meta.url) && (
                <p className="text-[0.98rem] leading-snug text-[color:var(--cv-soft)]">
                  {meta.url ? (
                    <a
                      href={meta.url}
                      target="_blank"
                      rel="noreferrer"
                      className={BODY_LINK}
                    >
                      {meta.primary || stripProtocol(meta.url)}
                    </a>
                  ) : (
                    meta.primary
                  )}
                </p>
              )}

              {meta.supporting.length > 0 && (
                <p className="flex flex-wrap gap-x-2 gap-y-1 font-[family-name:var(--font-cv-mono)] text-[10px] tracking-[0.18em] text-[color:var(--cv-soft)] uppercase">
                  {meta.supporting.map((item, index) => (
                    <Fragment key={`${item}-${index}`}>
                      {index > 0 && (
                        <span
                          aria-hidden
                          className="text-[color:var(--cv-accent)] opacity-40"
                        >
                          ·
                        </span>
                      )}
                      <span>{item}</span>
                    </Fragment>
                  ))}
                </p>
              )}
            </div>
          )}
        </div>

        {entry.meta.period && (
          <p className="shrink-0 font-[family-name:var(--font-cv-mono)] text-[11px] font-medium tracking-[0.18em] text-[color:var(--cv-accent)] uppercase sm:pt-1 sm:text-right">
            {entry.meta.period}
          </p>
        )}
      </div>

      {entry.paragraphs.length > 0 && (
        <div className="mt-4 space-y-3">
          {entry.paragraphs.map((paragraph, index) => (
            <p
              key={`${entry.heading}-paragraph-${index}`}
              className="max-w-[68ch] text-[0.99rem] leading-7 text-[color:var(--cv-soft)]"
            >
              <Inline text={paragraph} linkClassName={BODY_LINK} />
            </p>
          ))}
        </div>
      )}

      {entry.bullets.length > 0 && (
        <ul className="mt-4 space-y-2.5">
          {entry.bullets.map((bullet, index) => (
            <li
              key={`${entry.heading}-bullet-${index}`}
              className="grid grid-cols-[0.9rem_1fr] gap-3 text-[0.96rem] leading-7 text-[color:var(--cv-soft)]"
            >
              <span
                aria-hidden
                className="pt-[0.78rem] text-[11px] text-[color:var(--cv-accent)] opacity-70"
              >
                —
              </span>
              <span>
                <Inline text={bullet} linkClassName={BODY_LINK} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

function EntrySection({ label, entries }: { label: string; entries: Entry[] }) {
  if (entries.length === 0) return null

  return (
    <section>
      <SectionHeading label={label} />
      <div className={`${styles.timeline} space-y-0`}>
        {entries.map((entry, index) => (
          <EntryBlock key={`${entry.heading}-${index}`} entry={entry} />
        ))}
      </div>
    </section>
  )
}

export default function Page() {
  const { profile, experience, education, projects, skills } = loadCV()

  return (
    <main className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-10 print:max-w-none print:p-0">
      <div
        className={`${styles.sheet} rounded-[2rem] border border-[color:var(--cv-line)] shadow-[0_24px_80px_rgb(34_25_17_/_0.12)] print:rounded-none print:border-0 print:shadow-none`}
      >
        <div className="flex justify-end px-5 pt-5 sm:px-8 sm:pt-7 lg:px-10 lg:pt-8 print:hidden">
          <PrintButton />
        </div>

        <div className="px-5 pb-6 sm:px-8 sm:pb-9 lg:px-10 lg:pb-10 xl:px-12 print:px-0 print:pb-0">
          <header className="grid gap-8 border-b border-[color:var(--cv-line)] pb-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] lg:gap-10 print:grid-cols-1 print:gap-6 print:pb-6">
            <div>
              <p className="font-[family-name:var(--font-cv-mono)] text-[11px] font-medium tracking-[0.22em] text-[color:var(--cv-accent)] uppercase">
                Curriculum Vitae
              </p>
              <h1 className="mt-3 max-w-[12ch] font-[family-name:var(--font-cv-serif)] text-[3.65rem] leading-[0.9] font-semibold tracking-[-0.05em] text-balance text-[color:var(--cv-ink)] sm:text-[4.4rem] lg:text-[5.3rem] print:max-w-none print:text-[3.6rem]">
                {profile.name || "Curriculum Vitae"}
              </h1>
              {profile.title && (
                <p className="mt-4 max-w-[34rem] text-[1.05rem] leading-7 font-medium text-[color:var(--cv-soft)] sm:text-[1.15rem]">
                  {profile.title}
                </p>
              )}
            </div>

            <ContactRail profile={profile} />
          </header>

          <div className="grid gap-10 pt-8 lg:grid-cols-[minmax(0,0.84fr)_minmax(0,1.36fr)] lg:gap-12 print:grid-cols-1 print:gap-8 print:pt-6">
            <aside className="space-y-8 print:space-y-6">
              <Summary paragraphs={profile.summary} />
              <SkillGroups groups={skills} />
            </aside>

            <div className="space-y-8 print:space-y-6">
              <EntrySection label="Experience" entries={experience} />
              <EntrySection label="Projects" entries={projects} />
              <EntrySection label="Education" entries={education} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
