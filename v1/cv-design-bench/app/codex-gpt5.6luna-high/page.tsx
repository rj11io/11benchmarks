import { Fragment, type ReactNode } from "react"
import {
  ArrowUpRight,
  AtSign,
  BriefcaseBusiness,
  Code2,
  MapPin,
} from "lucide-react"

import { loadCV } from "@/lib/cv"
import { Inline } from "@/lib/cv/markdown"
import type { Entry, Profile, SkillGroup } from "@/lib/cv/types"

import { PrintButton } from "./print-button"
import styles from "./cv.module.css"

const inlineLink =
  "text-[#a44025] underline decoration-[#e5b7a8] decoration-1 underline-offset-4 transition hover:text-[#c55432] hover:decoration-[#c55432] dark:text-[#efc2b2] dark:decoration-[#9b5d4a] print:text-black print:decoration-black"

const reservedContactKeys = new Set([
  "email",
  "website",
  "linkedin",
  "github",
  "location",
])

type Contact = {
  label: string
  href?: string
  icon: ReactNode
}

function toUrl(value: string, prefix = "https://") {
  return /^https?:\/\//.test(value) ? value : `${prefix}${value}`
}

function displayUrl(value: string) {
  return value.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "")
}

function contactsFor(profile: Profile): Contact[] {
  const { meta } = profile
  const contacts: Contact[] = []

  if (meta.location) {
    contacts.push({ label: meta.location, icon: <MapPin aria-hidden className="size-3.5" /> })
  }
  if (meta.email) {
    contacts.push({
      label: meta.email,
      href: `mailto:${meta.email}`,
      icon: <AtSign aria-hidden className="size-3.5" />,
    })
  }
  if (meta.website) {
    const href = toUrl(meta.website)
    contacts.push({
      label: displayUrl(href),
      href,
      icon: <ArrowUpRight aria-hidden className="size-3.5" />,
    })
  }
  if (meta.linkedin) {
    const href = toUrl(meta.linkedin, "https://www.linkedin.com/in/")
    contacts.push({
      label: displayUrl(href).replace("linkedin.com/in/", "linkedin/").replace("www.", ""),
      href,
      icon: <BriefcaseBusiness aria-hidden className="size-3.5" />,
    })
  }
  if (meta.github) {
    const href = toUrl(meta.github, "https://github.com/")
    contacts.push({
      label: displayUrl(href).replace("github.com/", "github/"),
      href,
      icon: <Code2 aria-hidden className="size-3.5" />,
    })
  }

  for (const [key, value] of Object.entries(meta)) {
    if (!reservedContactKeys.has(key) && value) {
      contacts.push({
        label: value,
        href: /^https?:\/\//.test(value) ? value : undefined,
        icon: <ArrowUpRight aria-hidden className="size-3.5" />,
      })
    }
  }

  return contacts
}

function Initials({ name }: { name: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")

  if (!initials) return null

  return (
    <div className="flex size-12 items-center justify-center rounded-full bg-[#c55432] font-[family-name:var(--cv-mono)] text-[11px] font-medium tracking-[0.12em] text-white dark:bg-[#e06c46] print:size-9 print:bg-black print:text-white">
      {initials}
    </div>
  )
}

function ContactList({ contacts, print = false }: { contacts: Contact[]; print?: boolean }) {
  if (contacts.length === 0) return null

  if (print) {
    return (
      <p className="hidden font-[family-name:var(--cv-mono)] text-[8.5pt] leading-[1.55] text-black print:block">
        {contacts.map((contact, index) => (
          <Fragment key={`${contact.label}-${index}`}>
            {index > 0 && <span className="text-[#777777]"> · </span>}
            {contact.href ? (
              <a href={contact.href} className="text-black no-underline">
                {contact.label}
              </a>
            ) : (
              contact.label
            )}
          </Fragment>
        ))}
      </p>
    )
  }

  return (
    <ul className="space-y-2.5">
      {contacts.map((contact, index) => (
        <li key={`${contact.label}-${index}`}>
          {contact.href ? (
            <a
              href={contact.href}
              target={contact.href.startsWith("http") ? "_blank" : undefined}
              rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
              className="group flex min-w-0 items-start gap-2.5 text-[12px] leading-snug text-[#676963] transition hover:text-[#c55432] dark:text-[#c5c6bd] dark:hover:text-[#efc2b2]"
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-[#c55432] transition group-hover:translate-x-0.5 dark:text-[#efc2b2]">
                {contact.icon}
              </span>
              <span className="min-w-0 break-all underline decoration-transparent underline-offset-4 transition group-hover:decoration-current">
                {contact.label}
              </span>
            </a>
          ) : (
            <span className="flex min-w-0 items-start gap-2.5 text-[12px] leading-snug text-[#676963] dark:text-[#c5c6bd]">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center text-[#c55432] dark:text-[#efc2b2]">
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

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className={`${styles.sectionHeading} mb-8 flex items-end justify-between gap-4 border-b border-[#d8d5cd] pb-3 dark:border-[#3b3c37] print:mb-4 print:border-black print:pb-2`}>
      <div>
        <p className="mb-2 font-[family-name:var(--cv-mono)] text-[9px] font-medium tracking-[0.22em] text-[#c55432] uppercase dark:text-[#efc2b2] print:mb-1 print:text-[7pt] print:text-black">
          {eyebrow}
        </p>
        <h2 className="font-[family-name:var(--cv-display)] text-[32px] leading-none tracking-[-0.02em] text-[#20211e] dark:text-[#f4f1eb] print:text-[19pt] print:text-black">
          {title}
        </h2>
      </div>
      <span className="mb-1 hidden h-2 w-2 rounded-full bg-[#c55432] sm:block print:hidden" aria-hidden />
    </div>
  )
}

function ProfileHeader({ profile }: { profile: Profile }) {
  const contacts = contactsFor(profile)

  return (
    <header className="border-b border-[#d8d5cd] pb-8 dark:border-[#3b3c37] print:border-black print:pb-4">
      <div className="flex items-start justify-between gap-5">
        <div className="flex min-w-0 items-center gap-4">
          <Initials name={profile.name} />
          <div className="min-w-0">
            {profile.name && (
              <h1 className="font-[family-name:var(--cv-display)] text-[clamp(2.5rem,7vw,4.75rem)] leading-[0.9] tracking-[-0.035em] text-[#20211e] dark:text-[#f4f1eb] print:text-[29pt] print:text-black">
                {profile.name}
              </h1>
            )}
            {profile.title && (
              <p className="mt-2 font-[family-name:var(--cv-mono)] text-[10px] font-medium tracking-[0.15em] text-[#c55432] uppercase dark:text-[#efc2b2] print:mt-1 print:text-[9pt] print:text-black">
                {profile.title}
              </p>
            )}
          </div>
        </div>
        <PrintButton />
      </div>
      <div className="mt-5 sm:hidden print:hidden">
        <ContactList contacts={contacts} />
      </div>
      <div className="mt-4 print:mt-2">
        <ContactList contacts={contacts} print />
      </div>
    </header>
  )
}

function Rail({ profile }: { profile: Profile }) {
  const contacts = contactsFor(profile)

  return (
    <aside className="hidden lg:block print:hidden">
      <div className="sticky top-8">
        <div className="mb-10 flex items-center gap-3">
          <Initials name={profile.name} />
          <span className="font-[family-name:var(--cv-mono)] text-[9px] tracking-[0.18em] text-[#8a8b84] uppercase">
            Curriculum vitae
          </span>
        </div>
        <div className="mb-12 h-px w-12 bg-[#c55432]" />
        <p className="mb-4 font-[family-name:var(--cv-mono)] text-[9px] font-medium tracking-[0.22em] text-[#c55432] uppercase">
          Contact
        </p>
        <ContactList contacts={contacts} />
        <div className="mt-12 border-t border-[#d8d5cd] pt-5 dark:border-[#3b3c37]">
          <p className="max-w-[15rem] font-[family-name:var(--cv-display)] text-[20px] leading-[1.15] text-[#4c4e48] dark:text-[#d8d9d1]">
            {profile.title}
          </p>
        </div>
        {profile.meta.location && (
          <p className="mt-12 font-[family-name:var(--cv-mono)] text-[9px] leading-relaxed tracking-[0.16em] text-[#8a8b84] uppercase">
            {profile.meta.location}
          </p>
        )}
      </div>
    </aside>
  )
}

function Summary({ paragraphs }: { paragraphs: string[] }) {
  if (paragraphs.length === 0) return null

  return (
    <section className={styles.profileSummary}>
      <SectionHeading eyebrow="01 / About" title="Profile" />
      <div className="grid gap-5 text-[15px] leading-[1.75] text-[#454741] sm:grid-cols-2 sm:gap-x-10 sm:text-[15px] dark:text-[#d1d2ca] print:grid-cols-2 print:gap-x-8 print:text-[9.2pt] print:leading-[1.45] print:text-black">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-pretty">
            <Inline text={paragraph} linkClassName={inlineLink} />
          </p>
        ))}
      </div>
    </section>
  )
}

function EntryMeta({ entry }: { entry: Entry }) {
  const organization = entry.meta.company ?? entry.meta.school
  const items: ReactNode[] = []

  if (organization) {
    items.push(
      entry.meta.url ? (
        <a key="organization" href={entry.meta.url} target="_blank" rel="noreferrer" className={inlineLink}>
          {organization}
        </a>
      ) : (
        <span key="organization">{organization}</span>
      ),
    )
  }
  if (entry.meta.location) items.push(<span key="location">{entry.meta.location}</span>)
  if (entry.meta.url && !organization) {
    items.push(
      <a key="url" href={entry.meta.url} target="_blank" rel="noreferrer" className={inlineLink}>
        {displayUrl(entry.meta.url)}
      </a>,
    )
  }

  if (items.length === 0) return null

  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-[family-name:var(--cv-mono)] text-[10px] leading-snug tracking-[0.02em] text-[#777972] dark:text-[#afb0a8] print:mt-1 print:text-[8.5pt] print:text-[#444444]">
      {items.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && <span className="text-[#b6b5ad] dark:text-[#686961]">·</span>}
          {item}
        </Fragment>
      ))}
    </div>
  )
}

function EntryBody({ entry }: { entry: Entry }) {
  return (
    <>
      {entry.paragraphs.length > 0 && (
        <div className="mt-4 space-y-3 text-[13px] leading-[1.65] text-[#555750] dark:text-[#c5c6bd] print:mt-2 print:space-y-1 print:text-[9pt] print:leading-[1.4] print:text-black">
          {entry.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-pretty">
              <Inline text={paragraph} linkClassName={inlineLink} />
            </p>
          ))}
        </div>
      )}
      {entry.bullets.length > 0 && (
        <ul className="mt-4 space-y-2 text-[13px] leading-[1.58] text-[#454741] dark:text-[#d1d2ca] print:mt-2 print:space-y-1 print:text-[9pt] print:leading-[1.38] print:text-black">
          {entry.bullets.map((bullet, index) => (
            <li key={index} className="flex gap-3 text-pretty">
              <span className="mt-[0.7em] size-1.5 shrink-0 rounded-full bg-[#c55432] dark:bg-[#efc2b2] print:mt-[0.62em] print:size-1 print:bg-black" aria-hidden />
              <span className="min-w-0">
                <Inline text={bullet} linkClassName={inlineLink} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function ExperienceEntry({ entry }: { entry: Entry }) {
  const headingLink = entry.meta.url && !entry.meta.company && !entry.meta.school

  return (
    <article className={`${styles.entry} grid gap-3 border-l border-[#d8d5cd] pl-5 dark:border-[#3b3c37] sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:gap-7 sm:border-l-0 sm:pl-0 print:grid-cols-[7rem_minmax(0,1fr)] print:gap-5 print:border-l-0 print:pl-0`}>
      <div className="sm:border-r sm:border-[#d8d5cd] sm:pr-6 dark:sm:border-[#3b3c37] print:sm:border-[#aaaaaa]">
        <p className="font-[family-name:var(--cv-mono)] text-[10px] leading-[1.5] tracking-[0.02em] text-[#777972] dark:text-[#afb0a8] sm:pt-1 print:text-[8.5pt] print:text-[#444444]">
          {entry.meta.period}
        </p>
      </div>
      <div className="min-w-0">
        <h3 className="font-[family-name:var(--cv-display)] text-[22px] leading-[1.05] tracking-[-0.015em] text-[#20211e] dark:text-[#f4f1eb] print:text-[14pt] print:text-black">
          {headingLink ? (
            <a href={entry.meta.url} target="_blank" rel="noreferrer" className={inlineLink}>
              {entry.heading}
            </a>
          ) : (
            entry.heading
          )}
        </h3>
        <EntryMeta entry={entry} />
        <EntryBody entry={entry} />
      </div>
    </article>
  )
}

function Experience({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) return null

  return (
    <section>
      <SectionHeading eyebrow="02 / Work" title="Experience" />
      <div className="space-y-9 sm:space-y-10 print:space-y-5">
        {entries.map((entry, index) => <ExperienceEntry key={`${entry.heading}-${index}`} entry={entry} />)}
      </div>
    </section>
  )
}

function CompactEntry({ entry }: { entry: Entry }) {
  return (
    <article className={styles.educationProject}>
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-[family-name:var(--cv-display)] text-[21px] leading-[1.05] tracking-[-0.015em] text-[#20211e] dark:text-[#f4f1eb] print:text-[13pt] print:text-black">
          {entry.meta.url ? (
            <a href={entry.meta.url} target="_blank" rel="noreferrer" className={inlineLink}>
              {entry.heading}
            </a>
          ) : (
            entry.heading
          )}
        </h3>
        {entry.meta.period && <span className="shrink-0 pt-1 font-[family-name:var(--cv-mono)] text-[9px] text-[#777972] dark:text-[#afb0a8] print:text-[8pt] print:text-[#444444]">{entry.meta.period}</span>}
      </div>
      <EntryMeta entry={entry} />
      <EntryBody entry={entry} />
    </article>
  )
}

function SplitSection({ title, eyebrow, entries }: { title: string; eyebrow: string; entries: Entry[] }) {
  if (entries.length === 0) return null

  return (
    <section>
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="space-y-7 print:space-y-4">
        {entries.map((entry, index) => <CompactEntry key={`${entry.heading}-${index}`} entry={entry} />)}
      </div>
    </section>
  )
}

function Skills({ groups }: { groups: SkillGroup[] }) {
  if (groups.length === 0) return null

  return (
    <section>
      <SectionHeading eyebrow="05 / Toolkit" title="Skills" />
      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 print:grid-cols-2 print:gap-x-10 print:gap-y-4">
        {groups.map((group) => (
          <div key={group.name} className={`${styles.skillGroup} border-t border-[#d8d5cd] pt-3 dark:border-[#3b3c37] print:border-[#aaaaaa] print:pt-2`}>
            <h3 className="font-[family-name:var(--cv-mono)] text-[10px] font-medium tracking-[0.14em] text-[#c55432] uppercase dark:text-[#efc2b2] print:text-[8pt] print:text-black">
              {group.name}
            </h3>
            <p className="mt-2 text-[13px] leading-[1.65] text-[#555750] dark:text-[#c5c6bd] print:mt-1 print:text-[9pt] print:leading-[1.4] print:text-black">
              {group.items.map((item, index) => (
                <Fragment key={`${item}-${index}`}>
                  {index > 0 && <span className="text-[#b6b5ad] dark:text-[#777777]"> · </span>}
                  {item}
                </Fragment>
              ))}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Page() {
  const cv = loadCV()

  return (
    <main className="px-5 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-12 print:px-0 print:py-0">
      <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-16 print:block print:max-w-none">
        <Rail profile={cv.profile} />
        <div className="min-w-0">
          <ProfileHeader profile={cv.profile} />
          <div className="mt-10 space-y-16 sm:mt-12 sm:space-y-20 print:mt-6 print:space-y-8">
            <Summary paragraphs={cv.profile.summary} />
            <Experience entries={cv.experience} />
            <div className="grid gap-16 sm:grid-cols-2 sm:gap-12 print:grid-cols-2 print:gap-10">
              <SplitSection title="Education" eyebrow="03 / Study" entries={cv.education} />
              <SplitSection title="Projects" eyebrow="04 / Selected" entries={cv.projects} />
            </div>
            <Skills groups={cv.skills} />
          </div>
          <footer className="mt-20 border-t border-[#d8d5cd] pt-4 font-[family-name:var(--cv-mono)] text-[9px] tracking-[0.12em] text-[#8a8b84] uppercase dark:border-[#3b3c37] dark:text-[#8e9088] print:mt-8 print:border-black print:pt-2 print:text-[7pt] print:text-black">
            {cv.profile.name || "Curriculum vitae"} · {cv.profile.title || ""}
          </footer>
        </div>
      </div>
    </main>
  )
}
