import { Fragment, type ReactNode } from "react"

import { loadCV } from "@/lib/cv"
import { Inline } from "@/lib/cv/markdown"
import type { Entry, SkillGroup } from "@/lib/cv/types"

import styles from "./cv.module.css"
import { PrintButton } from "./print-button"

const linkClass =
  "underline decoration-foreground/25 underline-offset-2 transition-colors hover:decoration-foreground print:decoration-foreground/40"

const chipClass =
  "inline-flex items-center rounded-full border border-border/80 bg-secondary/55 px-3 py-1.5 text-[0.72rem] font-medium tracking-[0.08em] text-foreground/80 transition-colors hover:border-foreground/20 hover:bg-secondary/80 print:border-0 print:bg-transparent print:px-0 print:py-0 print:text-[0.76rem] print:tracking-normal"

function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "")
}

type Contact = { label: string; href?: string }

function buildContacts(meta: Record<string, string>): Contact[] {
  const contacts: Contact[] = []

  if (meta.location) contacts.push({ label: meta.location })
  if (meta.email) contacts.push({ label: meta.email, href: `mailto:${meta.email}` })
  if (meta.website) contacts.push({ label: stripProtocol(meta.website), href: meta.website })
  if (meta.linkedin) {
    const href = meta.linkedin.startsWith("http")
      ? meta.linkedin
      : `https://www.linkedin.com/in/${meta.linkedin}`
    const label = stripProtocol(href).replace(/^www\./, "")
    contacts.push({ label, href })
  }
  if (meta.github) {
    const href = meta.github.startsWith("http")
      ? meta.github
      : `https://github.com/${meta.github}`
    const label = stripProtocol(href).replace(/^www\./, "")
    contacts.push({ label, href })
  }

  for (const [key, value] of Object.entries(meta)) {
    if (!value) continue
    if (["location", "email", "website", "linkedin", "github"].includes(key)) {
      continue
    }
    contacts.push(
      value.startsWith("http")
        ? { label: stripProtocol(value), href: value }
        : { label: value },
    )
  }

  return contacts
}

function ContactChip({ contact }: { contact: Contact }) {
  if (!contact.href) {
    return <span className={chipClass}>{contact.label}</span>
  }

  const external = contact.href.startsWith("http")
  return (
    <a
      href={contact.href}
      className={chipClass}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {contact.label}
    </a>
  )
}

function Header({ name, title, contacts }: { name: string; title: string; contacts: Contact[] }) {
  return (
    <header className="max-w-4xl">
      {name && (
        <h1 className="font-[family-name:var(--font-cv-serif)] text-[clamp(3rem,8vw,5.7rem)] leading-[0.92] tracking-[-0.05em] text-balance text-foreground">
          {name}
        </h1>
      )}
      {title && <p className="mt-4 max-w-3xl text-[1.05rem] leading-relaxed text-foreground/74 sm:text-[1.12rem]">{title}</p>}
      {contacts.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {contacts.map((contact, i) => (
            <ContactChip key={`${contact.label}-${i}`} contact={contact} />
          ))}
        </div>
      )}
    </header>
  )
}

function ProfilePanel({ summary }: { summary: string[] }) {
  if (summary.length === 0) return null

  return (
    <section
      className={`${styles.profileCard} mt-10 rounded-[1.75rem] border border-border/80 bg-secondary/35 p-5 sm:p-6 print:mt-8 print:rounded-none print:border-0 print:bg-transparent print:p-0`}
    >
      <div className="flex items-center gap-3">
        <h2
          className={`${styles.sectionTitle} text-[0.7rem] font-semibold tracking-[0.28em] text-muted-foreground uppercase`}
        >
          Profile
        </h2>
        <div className="h-px flex-1 bg-border/80" />
      </div>
      <div className="mt-5 max-w-4xl space-y-4 text-[1rem] leading-7 text-foreground/84">
        {summary.map((text, i) => (
          <p key={i}>
            <Inline text={text} linkClassName={linkClass} />
          </p>
        ))}
      </div>
    </section>
  )
}

function SectionShell({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <section className="rounded-[1.75rem] border border-border/80 bg-secondary/28 p-5 sm:p-6 print:rounded-none print:border-0 print:bg-transparent print:p-0">
      <div className="flex items-center gap-3">
        <h2
          className={`${styles.sectionTitle} text-[0.7rem] font-semibold tracking-[0.28em] text-muted-foreground uppercase`}
        >
          {label}
        </h2>
        <div className="h-px flex-1 bg-border/80" />
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  )
}

function EntryMeta({ entry }: { entry: Entry }) {
  const org = entry.meta.company ?? entry.meta.school ?? ""
  const location = entry.meta.location
  const url = entry.meta.url
  const parts: ReactNode[] = []

  if (org) {
    parts.push(
      url ? (
        <a
          key="org"
          href={url}
          target="_blank"
          rel="noreferrer"
          className={linkClass}
        >
          {org}
        </a>
      ) : (
        <span key="org">{org}</span>
      ),
    )
  }

  if (location) {
    parts.push(<span key="location">{location}</span>)
  }

  if (!org && url) {
    parts.push(
      <a
        key="url"
        href={url}
        target="_blank"
        rel="noreferrer"
        className={linkClass}
      >
        {stripProtocol(url)}
      </a>,
    )
  }

  if (parts.length === 0) return null

  return (
    <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.92rem] leading-relaxed text-muted-foreground">
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="text-muted-foreground/35">|</span>}
          {part}
        </Fragment>
      ))}
    </p>
  )
}

function EntryCard({ entry }: { entry: Entry }) {
  const url = entry.meta.url
  const headingLinks = Boolean(url && !entry.meta.company && !entry.meta.school)

  return (
    <article
      className={`${styles.entry} border-b border-border/60 pb-4 last:border-b-0 last:pb-0`}
    >
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h3 className="text-[1.05rem] font-semibold leading-snug text-foreground text-balance">
            {headingLinks && url ? (
              <a href={url} target="_blank" rel="noreferrer" className={linkClass}>
                {entry.heading}
              </a>
            ) : (
              entry.heading
            )}
          </h3>
          <EntryMeta entry={entry} />
        </div>

        {entry.meta.period && (
          <p className="shrink-0 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground sm:pt-1">
            {entry.meta.period}
          </p>
        )}
      </div>

      {entry.paragraphs.length > 0 && (
        <div className="mt-4 space-y-3 text-[0.96rem] leading-7 text-foreground/82">
          {entry.paragraphs.map((text, i) => (
            <p key={i} className="text-pretty">
              <Inline text={text} linkClassName={linkClass} />
            </p>
          ))}
        </div>
      )}

      {entry.bullets.length > 0 && (
        <ul className="mt-4 space-y-2">
          {entry.bullets.map((text, i) => (
            <li
              key={i}
              className="flex gap-3 text-[0.93rem] leading-7 text-foreground/82"
            >
              <span aria-hidden className="mt-[0.7em] h-px w-4 shrink-0 bg-border/90" />
              <span className="min-w-0 text-pretty">
                <Inline text={text} linkClassName={linkClass} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

function Skills({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className="space-y-4">
      {groups.map((group, index) => (
        <div
          key={group.name}
          className={`grid gap-3 ${index === groups.length - 1 ? "" : "border-b border-border/60 pb-4"} sm:grid-cols-[11rem_minmax(0,1fr)]`}
        >
          <h3 className="text-[0.72rem] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
            {group.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {group.items.map((item, i) => (
              <span
                key={`${group.name}-${i}`}
                className="inline-flex items-center rounded-full border border-border/80 bg-background/80 px-3 py-1 text-[0.86rem] leading-none text-foreground/80 print:bg-transparent"
              >
                <Inline text={item} linkClassName={linkClass} />
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Page() {
  const { profile, experience, education, projects, skills } = loadCV()
  const contacts = buildContacts(profile.meta)
  const visibleSkills = skills.filter((group) => group.items.length > 0)

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 print:max-w-none print:px-0 print:py-0">
      <div className="rounded-[2rem] border border-border/80 bg-background/90 shadow-[0_40px_110px_rgba(15,23,42,0.08)] backdrop-blur-sm print:rounded-none print:border-0 print:bg-transparent print:shadow-none">
        <div className="flex justify-end px-5 pt-5 sm:px-8 sm:pt-8 print:hidden">
          <PrintButton />
        </div>

        <div className="px-5 pb-6 pt-2 sm:px-8 sm:pb-8 sm:pt-0 lg:px-12 lg:pb-10">
          <Header
            name={profile.name}
            title={profile.title}
            contacts={contacts}
          />

          <ProfilePanel summary={profile.summary} />

          <div className="mt-10 grid gap-8 lg:grid-cols-2 print:mt-8 print:block">
            <div className="space-y-8 print:space-y-8">
              {experience.length > 0 && (
                <SectionShell label="Experience">
                  {experience.map((entry, i) => (
                    <EntryCard key={`${entry.heading}-${i}`} entry={entry} />
                  ))}
                </SectionShell>
              )}

              {projects.length > 0 && (
                <SectionShell label="Projects">
                  {projects.map((entry, i) => (
                    <EntryCard key={`${entry.heading}-${i}`} entry={entry} />
                  ))}
                </SectionShell>
              )}
            </div>

            <div className="space-y-8 print:mt-8 print:space-y-8">
              {education.length > 0 && (
                <SectionShell label="Education">
                  {education.map((entry, i) => (
                    <EntryCard key={`${entry.heading}-${i}`} entry={entry} />
                  ))}
                </SectionShell>
              )}

              {visibleSkills.length > 0 && (
                <SectionShell label="Skills">
                  <Skills groups={visibleSkills} />
                </SectionShell>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
