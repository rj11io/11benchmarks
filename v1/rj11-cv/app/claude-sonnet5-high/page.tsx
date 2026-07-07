import { Fragment, type ReactNode } from "react"

import { loadCV } from "@/lib/cv"
import { Inline } from "@/lib/cv/markdown"
import type { Entry, Profile, SkillGroup } from "@/lib/cv/types"

import { PrintButton } from "./print-button"

const LINK_CLASS =
  "underline decoration-stone-300 underline-offset-2 transition-colors hover:text-stone-900 hover:decoration-stone-500"

function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "")
}

type Contact = { label: string; href?: string }

const KNOWN_CONTACT_KEYS = [
  "email",
  "website",
  "linkedin",
  "github",
  "location",
]

function contactLinks(meta: Record<string, string>): Contact[] {
  const items: Contact[] = []

  if (meta.email) {
    items.push({ label: meta.email, href: `mailto:${meta.email}` })
  }
  if (meta.website) {
    const href = meta.website.startsWith("http")
      ? meta.website
      : `https://${meta.website}`
    items.push({ label: stripProtocol(href), href })
  }
  if (meta.linkedin) {
    const href = meta.linkedin.startsWith("http")
      ? meta.linkedin
      : `https://www.linkedin.com/in/${meta.linkedin}`
    const handle = meta.linkedin.replace(
      /^https?:\/\/(www\.)?linkedin\.com\/(in\/)?/,
      "",
    )
    items.push({ label: `linkedin/${stripProtocol(handle)}`, href })
  }
  if (meta.github) {
    const href = meta.github.startsWith("http")
      ? meta.github
      : `https://github.com/${meta.github}`
    const handle = meta.github.replace(/^https?:\/\/(www\.)?github\.com\//, "")
    items.push({ label: `github/${stripProtocol(handle)}`, href })
  }
  if (meta.location) {
    items.push({ label: meta.location })
  }

  for (const [key, value] of Object.entries(meta)) {
    if (!KNOWN_CONTACT_KEYS.includes(key) && value) {
      items.push({ label: value })
    }
  }

  return items
}

function Header({ profile }: { profile: Profile }) {
  const contacts = contactLinks(profile.meta)

  return (
    <header className="mb-12 print:mb-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          {profile.name && (
            <h1 className="text-[2.5rem] leading-[1.05] font-semibold tracking-tight text-balance text-stone-900 sm:text-[3.25rem]">
              {profile.name}
            </h1>
          )}
          {profile.title && (
            <p className="mt-3 font-[family-name:var(--font-cv-mono)] text-[13px] tracking-[0.16em] text-stone-500 uppercase">
              {profile.title}
            </p>
          )}
        </div>
        <PrintButton />
      </div>

      {contacts.length > 0 && (
        <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 font-[family-name:var(--font-cv-mono)] text-[12px] text-stone-500 print:mt-4">
          {contacts.map((c, i) => (
            <li key={i} className="break-all">
              {c.href ? (
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className={LINK_CLASS}
                >
                  {c.label}
                </a>
              ) : (
                c.label
              )}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 h-px w-full bg-stone-200 print:mt-6" />
    </header>
  )
}

function Summary({ paragraphs }: { paragraphs: string[] }) {
  return (
    <section className="mb-14 print:mb-8 print:break-inside-avoid">
      <div className="max-w-[62ch] space-y-4">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-[1.05rem] leading-relaxed text-stone-700">
            <Inline text={p} linkClassName={LINK_CLASS} />
          </p>
        ))}
      </div>
    </section>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="mb-14 last:mb-0 print:mb-8">
      <h2 className="mb-6 flex items-center gap-4 font-[family-name:var(--font-cv-mono)] text-[11px] font-medium tracking-[0.2em] text-stone-400 uppercase print:mb-4 print:break-after-avoid">
        {title}
        <span aria-hidden className="h-px flex-1 bg-stone-200" />
      </h2>
      {children}
    </section>
  )
}

function EntryMetaLine({ entry }: { entry: Entry }) {
  const primary = entry.meta.company ?? entry.meta.school
  const parts: ReactNode[] = []

  if (primary) parts.push(<span key="primary">{primary}</span>)
  if (entry.meta.location) parts.push(<span key="loc">{entry.meta.location}</span>)
  if (entry.meta.url) {
    parts.push(
      <a
        key="url"
        href={entry.meta.url}
        target="_blank"
        rel="noreferrer"
        className={LINK_CLASS}
      >
        {stripProtocol(entry.meta.url)}
      </a>,
    )
  }

  if (parts.length === 0) return null

  return (
    <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-[family-name:var(--font-cv-mono)] text-[11px] text-stone-400 uppercase">
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="text-stone-300">·</span>}
          {part}
        </Fragment>
      ))}
    </p>
  )
}

function EntryBlock({ entry }: { entry: Entry }) {
  return (
    <article className="mb-9 last:mb-0 print:mb-6 print:break-inside-avoid">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h3 className="text-[1.1rem] leading-snug font-semibold text-stone-900">
          <Inline text={entry.heading} />
        </h3>
        {entry.meta.period && (
          <p className="shrink-0 font-[family-name:var(--font-cv-mono)] text-[11px] tracking-wide text-stone-400 sm:text-right">
            {entry.meta.period}
          </p>
        )}
      </div>

      <EntryMetaLine entry={entry} />

      {entry.paragraphs.length > 0 && (
        <div className="mt-2.5 space-y-2">
          {entry.paragraphs.map((p, i) => (
            <p key={i} className="text-[0.95rem] leading-relaxed text-stone-600">
              <Inline text={p} linkClassName={LINK_CLASS} />
            </p>
          ))}
        </div>
      )}

      {entry.bullets.length > 0 && (
        <ul className="mt-2.5 list-none space-y-1.5 pl-0">
          {entry.bullets.map((b, i) => (
            <li key={i} className="flex gap-2.5 text-[0.925rem] leading-relaxed text-stone-600">
              <span
                aria-hidden
                className="mt-[3px] shrink-0 font-[family-name:var(--font-cv-mono)] text-[10px] text-stone-300"
              >
                –
              </span>
              <span>
                <Inline text={b} linkClassName={LINK_CLASS} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

function SkillsGrid({ groups }: { groups: SkillGroup[] }) {
  return (
    <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-[140px_1fr]">
      {groups.map((group) => (
        <Fragment key={group.name}>
          <dt className="font-[family-name:var(--font-cv-mono)] text-[11px] tracking-wide text-stone-400 uppercase sm:pt-0.5">
            {group.name}
          </dt>
          <dd className="text-[0.95rem] leading-relaxed text-stone-700">
            {group.items.map((item, i) => (
              <span key={i}>
                {i > 0 && <span className="text-stone-300"> · </span>}
                <Inline text={item} linkClassName={LINK_CLASS} />
              </span>
            ))}
          </dd>
        </Fragment>
      ))}
    </dl>
  )
}

export default function Page() {
  const cv = loadCV()

  return (
    <main className="mx-auto max-w-[45rem] px-6 py-14 sm:px-10 sm:py-20 print:max-w-none print:px-0 print:py-0">
      <Header profile={cv.profile} />

      {cv.profile.summary.length > 0 && <Summary paragraphs={cv.profile.summary} />}

      {cv.experience.length > 0 && (
        <Section title="Experience">
          {cv.experience.map((entry, i) => (
            <EntryBlock key={i} entry={entry} />
          ))}
        </Section>
      )}

      {cv.education.length > 0 && (
        <Section title="Education">
          {cv.education.map((entry, i) => (
            <EntryBlock key={i} entry={entry} />
          ))}
        </Section>
      )}

      {cv.projects.length > 0 && (
        <Section title="Projects">
          {cv.projects.map((entry, i) => (
            <EntryBlock key={i} entry={entry} />
          ))}
        </Section>
      )}

      {cv.skills.length > 0 && (
        <Section title="Skills">
          <SkillsGrid groups={cv.skills} />
        </Section>
      )}
    </main>
  )
}
