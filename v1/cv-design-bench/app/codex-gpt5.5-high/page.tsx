import { Fragment, type ReactNode } from "react"
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Mail,
  MapPin,
  Milestone,
} from "lucide-react"

import { loadCV } from "@/lib/cv"
import { Inline } from "@/lib/cv/markdown"
import type { Entry, Profile, SkillGroup } from "@/lib/cv/types"
import { cn } from "@/lib/utils"

import { PrintButton } from "./print-button"

const linkClass =
  "underline decoration-[#9eb9ad] decoration-1 underline-offset-4 transition hover:text-[#2f5f55] hover:decoration-[#2f5f55] dark:decoration-[#668679] dark:hover:text-[#cfe9dc] print:text-black print:decoration-black"

const contactKeys = ["email", "website", "linkedin", "github", "location"]

type Contact = {
  label: string
  href?: string
  icon: ReactNode
}

function ensureUrl(value: string, prefix = "https://") {
  return value.startsWith("http://") || value.startsWith("https://")
    ? value
    : `${prefix}${value}`
}

function stripUrl(value: string) {
  return value
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "")
}

function contactLinks(profile: Profile): Contact[] {
  const meta = profile.meta
  const contacts: Contact[] = []

  if (meta.email) {
    contacts.push({
      label: meta.email,
      href: `mailto:${meta.email}`,
      icon: <Mail aria-hidden className="size-3.5" />,
    })
  }

  if (meta.website) {
    const href = ensureUrl(meta.website)
    contacts.push({
      label: stripUrl(href),
      href,
      icon: <ArrowUpRight aria-hidden className="size-3.5" />,
    })
  }

  if (meta.linkedin) {
    const href = meta.linkedin.startsWith("http")
      ? meta.linkedin
      : `https://www.linkedin.com/in/${meta.linkedin}`
    contacts.push({
      label: stripUrl(href).replace("linkedin.com/in/", "linkedin/"),
      href,
      icon: <BriefcaseBusiness aria-hidden className="size-3.5" />,
    })
  }

  if (meta.github) {
    const href = meta.github.startsWith("http")
      ? meta.github
      : `https://github.com/${meta.github}`
    contacts.push({
      label: stripUrl(href).replace("github.com/", "github/"),
      href,
      icon: <Code2 aria-hidden className="size-3.5" />,
    })
  }

  if (meta.location) {
    contacts.push({
      label: meta.location,
      icon: <MapPin aria-hidden className="size-3.5" />,
    })
  }

  for (const [key, value] of Object.entries(meta)) {
    if (!contactKeys.includes(key) && value) {
      contacts.push({
        label: value,
        href: value.startsWith("http") ? value : undefined,
        icon: <Milestone aria-hidden className="size-3.5" />,
      })
    }
  }

  return contacts
}

function PrintContactLine({ contacts }: { contacts: Contact[] }) {
  if (contacts.length === 0) return null

  return (
    <p className="hidden font-[family-name:var(--cv-sans)] text-[8.8pt] leading-snug text-black print:block">
      {contacts.map((contact, index) => (
        <Fragment key={`${contact.label}-${index}`}>
          {index > 0 && <span> / </span>}
          {contact.href ? (
            <a href={contact.href} className="text-black no-underline">
              {contact.label}
            </a>
          ) : (
            <span>{contact.label}</span>
          )}
        </Fragment>
      ))}
    </p>
  )
}

function ContactList({ contacts }: { contacts: Contact[] }) {
  if (contacts.length === 0) return null

  return (
    <ul className="grid gap-2.5 text-[13px] text-[#5d5952] dark:text-[#c9c0b4] print:hidden">
      {contacts.map((contact, index) => (
        <li key={`${contact.label}-${index}`}>
          {contact.href ? (
            <a
              href={contact.href}
              target={contact.href.startsWith("http") ? "_blank" : undefined}
              rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
              className="group flex min-w-0 items-center gap-2.5"
            >
              <span className="flex size-7 shrink-0 items-center justify-center border border-[#d8d1c5] bg-[#fbfaf7] text-[#2f5f55] transition group-hover:border-[#2f5f55]/40 dark:border-[#3a3732] dark:bg-[#1c1b19] dark:text-[#a7d8bf]">
                {contact.icon}
              </span>
              <span className={cn("min-w-0 break-all", linkClass)}>
                {contact.label}
              </span>
            </a>
          ) : (
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="flex size-7 shrink-0 items-center justify-center border border-[#d8d1c5] bg-[#fbfaf7] text-[#2f5f55] dark:border-[#3a3732] dark:bg-[#1c1b19] dark:text-[#a7d8bf]">
                {contact.icon}
              </span>
              <span className="min-w-0 break-words">{contact.label}</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

function Header({ profile }: { profile: Profile }) {
  const contacts = contactLinks(profile)

  return (
    <header className="border-b border-[#d8d1c5] pb-10 dark:border-[#39362f] print:border-black print:pb-4">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:justify-between">
        <div className="min-w-0">
          {profile.name && (
            <h1 className="max-w-[11ch] font-[family-name:var(--cv-serif)] text-[clamp(3.25rem,15vw,8.75rem)] leading-[0.83] font-semibold tracking-normal text-[#171513] dark:text-[#fffaf0] print:max-w-none print:text-[31pt] print:leading-none print:text-black">
              {profile.name}
            </h1>
          )}
          {profile.title && (
            <p className="mt-5 max-w-[35rem] font-[family-name:var(--cv-sans)] text-lg leading-tight font-medium text-[#2f5f55] dark:text-[#a7d8bf] print:mt-2 print:max-w-none print:text-[11pt] print:font-semibold print:text-black">
              {profile.title}
            </p>
          )}
        </div>
        <PrintButton />
      </div>
      <div className="mt-7 lg:hidden print:hidden">
        <ContactList contacts={contacts} />
      </div>
      <div className="mt-7 print:mt-2">
        <PrintContactLine contacts={contacts} />
      </div>
    </header>
  )
}

function Sidebar({ profile }: { profile: Profile }) {
  const contacts = contactLinks(profile)

  return (
    <aside className="hidden space-y-7 lg:sticky lg:top-10 lg:block lg:self-start print:hidden">
      <div>
        <p className="font-[family-name:var(--cv-mono)] text-[11px] tracking-[0.18em] text-[#877f73] uppercase dark:text-[#a69c90]">
          Contact
        </p>
        <div className="mt-4">
          <ContactList contacts={contacts} />
        </div>
      </div>
      {profile.title && (
        <>
          <div className="h-px bg-[#d8d1c5] dark:bg-[#39362f]" />
          <p className="max-w-[18rem] font-[family-name:var(--cv-serif)] text-lg leading-snug text-[#4c4943] dark:text-[#d8d1c5]">
            {profile.title}
          </p>
        </>
      )}
    </aside>
  )
}

function Summary({ paragraphs }: { paragraphs: string[] }) {
  if (paragraphs.length === 0) return null

  return (
    <section className="max-w-[68ch] space-y-4 print:space-y-2 print:break-inside-avoid">
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className="font-[family-name:var(--cv-serif)] text-xl leading-[1.55] text-[#38342e] dark:text-[#eee4d8] print:font-[family-name:var(--cv-sans)] print:text-[9.6pt] print:leading-[1.36] print:text-black"
        >
          <Inline text={paragraph} linkClassName={linkClass} />
        </p>
      ))}
    </section>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-5 border-t border-[#d8d1c5] pt-8 dark:border-[#39362f] print:block print:border-black print:pt-4 print:break-after-auto">
      <h2 className="font-[family-name:var(--cv-mono)] text-[12px] font-semibold tracking-[0.2em] text-[#2f5f55] uppercase dark:text-[#a7d8bf] print:mb-3 print:text-[8.5pt] print:tracking-[0.12em] print:text-black print:break-after-avoid">
        {title}
      </h2>
      {children}
    </section>
  )
}

function EntryMeta({ entry }: { entry: Entry }) {
  const organization = entry.meta.company ?? entry.meta.school
  const parts: ReactNode[] = []

  if (organization) parts.push(<span key="org">{organization}</span>)
  if (entry.meta.location) parts.push(<span key="loc">{entry.meta.location}</span>)
  if (entry.meta.url) {
    parts.push(
      <a
        key="url"
        href={entry.meta.url}
        target="_blank"
        rel="noreferrer"
        className={linkClass}
      >
        {stripUrl(entry.meta.url)}
      </a>,
    )
  }

  if (parts.length === 0) return null

  return (
    <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-[family-name:var(--cv-sans)] text-[13px] leading-snug text-[#706a60] dark:text-[#bcb3a5] print:mt-0.5 print:text-[8.6pt] print:text-black">
      {parts.map((part, index) => (
        <Fragment key={index}>
          {index > 0 && <span className="text-[#b5ab9d] print:text-black">/</span>}
          {part}
        </Fragment>
      ))}
    </p>
  )
}

function EntryBlock({ entry, compact = false }: { entry: Entry; compact?: boolean }) {
  return (
    <article
      className={cn(
        "grid gap-3 border-b border-[#e2dbcf] pb-7 last:border-b-0 last:pb-0 dark:border-[#302d28] print:block print:border-b-0 print:pb-0 print:break-inside-avoid",
        compact ? "print:mb-4" : "print:mb-5",
      )}
    >
      <div className="grid gap-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-4">
        <div className="min-w-0">
          <h3 className="font-[family-name:var(--cv-serif)] text-[1.45rem] leading-tight font-semibold text-[#171513] dark:text-[#fffaf0] print:font-[family-name:var(--cv-sans)] print:text-[10.3pt] print:leading-snug print:text-black">
            <Inline text={entry.heading} linkClassName={linkClass} />
          </h3>
          <EntryMeta entry={entry} />
        </div>
        {entry.meta.period && (
          <p className="font-[family-name:var(--cv-mono)] text-[12px] leading-relaxed tracking-[0.04em] text-[#877f73] uppercase dark:text-[#a69c90] sm:pt-1 sm:text-right print:text-[8.3pt] print:leading-snug print:text-black">
            {entry.meta.period}
          </p>
        )}
      </div>

      {entry.paragraphs.length > 0 && (
        <div className="space-y-2 print:mt-1 print:space-y-1">
          {entry.paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="font-[family-name:var(--cv-sans)] text-[15px] leading-[1.65] text-[#4c4943] dark:text-[#d8d1c5] print:text-[8.8pt] print:leading-[1.34] print:text-black"
            >
              <Inline text={paragraph} linkClassName={linkClass} />
            </p>
          ))}
        </div>
      )}

      {entry.bullets.length > 0 && (
        <ul className="grid gap-1.5 pl-0 print:mt-1 print:block print:space-y-0.5">
          {entry.bullets.map((bullet, index) => (
            <li
              key={index}
              className="grid grid-cols-[0.9rem_minmax(0,1fr)] gap-2 font-[family-name:var(--cv-sans)] text-[14.5px] leading-[1.55] text-[#4c4943] dark:text-[#d8d1c5] print:grid-cols-[10pt_minmax(0,1fr)] print:gap-1 print:text-[8.55pt] print:leading-[1.25] print:text-black"
            >
              <span aria-hidden className="pt-[0.04em] text-[#2f5f55] print:text-black">
                -
              </span>
              <span>
                <Inline text={bullet} linkClassName={linkClass} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

function EntryList({ entries, compact = false }: { entries: Entry[]; compact?: boolean }) {
  return (
    <div className={cn("grid gap-7 print:block", compact && "gap-6")}>
      {entries.map((entry, index) => (
        <EntryBlock key={`${entry.heading}-${index}`} entry={entry} compact={compact} />
      ))}
    </div>
  )
}

function Skills({ groups }: { groups: SkillGroup[] }) {
  if (groups.length === 0) return null

  return (
    <dl className="grid gap-4 sm:grid-cols-2 print:grid print:grid-cols-2 print:gap-x-7 print:gap-y-2">
      {groups.map((group) => (
        <div key={group.name} className="print:break-inside-avoid">
          <dt className="font-[family-name:var(--cv-mono)] text-[11px] font-semibold tracking-[0.14em] text-[#877f73] uppercase dark:text-[#a69c90] print:text-[8pt] print:text-black">
            {group.name}
          </dt>
          <dd className="mt-1 font-[family-name:var(--cv-sans)] text-[14.5px] leading-relaxed text-[#3f3b35] dark:text-[#e7ded2] print:text-[8.7pt] print:leading-snug print:text-black">
            {group.items.map((item, index) => (
              <Fragment key={`${item}-${index}`}>
                {index > 0 && <span className="text-[#9d9488] print:text-black">, </span>}
                <Inline text={item} linkClassName={linkClass} />
              </Fragment>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export default function Page() {
  const cv = loadCV()

  return (
    <main className="mx-auto grid w-full max-w-[82rem] grid-cols-1 gap-10 px-[var(--page-inline)] py-8 sm:py-12 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14 lg:py-16 print:block print:max-w-none print:px-0 print:py-0">
      <Sidebar profile={cv.profile} />

      <div className="min-w-0 space-y-10 bg-[#fffdf8] px-5 py-7 shadow-[0_24px_80px_rgba(31,29,24,0.10)] ring-1 ring-[#e4dccf] sm:px-9 sm:py-10 lg:px-12 lg:py-12 dark:bg-[#1d1c1a] dark:shadow-none dark:ring-[#37332d] print:space-y-4 print:bg-white print:p-0 print:shadow-none print:ring-0">
        <Header profile={cv.profile} />

        {cv.profile.summary.length > 0 && <Summary paragraphs={cv.profile.summary} />}

        {cv.experience.length > 0 && (
          <Section title="Experience">
            <EntryList entries={cv.experience} />
          </Section>
        )}

        {cv.education.length > 0 && (
          <Section title="Education">
            <EntryList entries={cv.education} compact />
          </Section>
        )}

        {cv.projects.length > 0 && (
          <Section title="Projects">
            <EntryList entries={cv.projects} compact />
          </Section>
        )}

        {cv.skills.length > 0 && (
          <Section title="Skills">
            <Skills groups={cv.skills} />
          </Section>
        )}
      </div>
    </main>
  )
}
