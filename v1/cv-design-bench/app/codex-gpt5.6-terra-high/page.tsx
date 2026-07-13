import { Fragment, type ReactNode } from "react"

import { loadCV } from "@/lib/cv"
import { Inline } from "@/lib/cv/markdown"
import type { Entry, Profile, SkillGroup } from "@/lib/cv/types"

import { PrintButton } from "./print-button"

const linkClass =
  "underline decoration-[#e04b32]/60 decoration-1 underline-offset-4 transition hover:text-[#c43c27] hover:decoration-[#c43c27] dark:decoration-[#ff8a70]/70 dark:hover:text-[#ffb3a2] print:text-black print:decoration-black"

type Contact = { label: string; href?: string }

function displayUrl(value: string) {
  return value.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/$/, "")
}

function url(value: string) {
  return value.startsWith("http://") || value.startsWith("https://")
    ? value
    : `https://${value}`
}

function contacts(profile: Profile): Contact[] {
  const { email, website, linkedin, github, location, ...rest } = profile.meta
  const result: Contact[] = []

  if (email) result.push({ label: email, href: `mailto:${email}` })
  if (website) result.push({ label: displayUrl(website), href: url(website) })
  if (linkedin) {
    const href = linkedin.startsWith("http")
      ? linkedin
      : `https://www.linkedin.com/in/${linkedin}`
    result.push({ label: displayUrl(href), href })
  }
  if (github) {
    const href = github.startsWith("http") ? github : `https://github.com/${github}`
    result.push({ label: displayUrl(href), href })
  }
  if (location) result.push({ label: location })

  Object.entries(rest).forEach(([, value]) => {
    if (!value) return
    result.push({ label: value, href: value.startsWith("http") ? value : undefined })
  })

  return result
}

function ContactLine({ profile }: { profile: Profile }) {
  const items = contacts(profile)
  if (items.length === 0) return null

  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1.5 font-[family-name:var(--cv-mono)] text-[10px] leading-relaxed tracking-[0.015em] text-[#586568] dark:text-[#c6d0ce] print:gap-x-2 print:text-[8pt] print:leading-snug print:text-black">
      {items.map((item, index) => (
        <li key={`${item.label}-${index}`} className="flex items-center gap-x-3 print:gap-x-2">
          {index > 0 && <span aria-hidden className="text-[#e04b32] print:text-black">/</span>}
          {item.href ? (
            <a
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className={linkClass}
            >
              {item.label}
            </a>
          ) : (
            <span>{item.label}</span>
          )}
        </li>
      ))}
    </ul>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-[#1c2427]/15 pt-6 dark:border-white/15 print:break-before-auto print:border-black print:pt-3">
      <div className="mb-5 flex items-center gap-3 print:mb-2.5 print:break-after-avoid">
        <span className="h-px w-6 bg-[#e04b32] print:bg-black" />
        <h2 className="font-[family-name:var(--cv-mono)] text-[10px] font-medium tracking-[0.18em] text-[#e04b32] uppercase dark:text-[#ff9b84] print:text-[8pt] print:text-black">
          {title}
        </h2>
      </div>
      {children}
    </section>
  )
}

function EntryMeta({ entry }: { entry: Entry }) {
  const employer = entry.meta.company ?? entry.meta.school
  const details = [employer, entry.meta.location].filter(Boolean)

  return (
    <>
      {details.length > 0 && (
        <p className="mt-1 font-[family-name:var(--cv-mono)] text-[10px] leading-relaxed tracking-[0.02em] text-[#637073] dark:text-[#bac6c4] print:mt-0 print:text-[7.8pt] print:leading-snug print:text-black">
          {details.join(" · ")}
        </p>
      )}
      {entry.meta.url && (
        <a
          href={entry.meta.url}
          target="_blank"
          rel="noreferrer"
          className={`${linkClass} mt-1 inline-block font-[family-name:var(--cv-mono)] text-[10px] leading-relaxed tracking-[0.02em] print:mt-0 print:text-[7.8pt]`}
        >
          {displayUrl(entry.meta.url)}
        </a>
      )}
    </>
  )
}

function EntryCard({ entry }: { entry: Entry }) {
  return (
    <article className="relative grid gap-3 border-b border-[#1c2427]/10 pb-7 last:border-b-0 last:pb-0 dark:border-white/10 print:gap-1.5 print:border-black/20 print:pb-3 print:break-inside-avoid">
      <div className="grid gap-1.5 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-5">
        <div className="min-w-0">
          <h3 className="font-[family-name:var(--cv-display)] text-[1.55rem] leading-[1.05] font-semibold tracking-[-0.025em] text-[#1c2427] dark:text-[#fffaf2] print:text-[10.5pt] print:leading-tight print:text-black">
            <Inline text={entry.heading} linkClassName={linkClass} />
          </h3>
          <EntryMeta entry={entry} />
        </div>
        {entry.meta.period && (
          <p className="font-[family-name:var(--cv-mono)] text-[10px] leading-relaxed tracking-[0.035em] text-[#e04b32] uppercase dark:text-[#ff9b84] sm:pt-0.5 sm:text-right print:text-[7.8pt] print:text-black">
            {entry.meta.period}
          </p>
        )}
      </div>

      {entry.paragraphs.length > 0 && (
        <div className="space-y-2 print:space-y-1">
          {entry.paragraphs.map((paragraph, index) => (
            <p key={index} className="max-w-[74ch] text-[14px] leading-[1.6] text-[#465154] dark:text-[#d6dfdc] print:text-[8.4pt] print:leading-[1.28] print:text-black">
              <Inline text={paragraph} linkClassName={linkClass} />
            </p>
          ))}
        </div>
      )}

      {entry.bullets.length > 0 && (
        <ul className="grid gap-1.5 print:gap-0.5">
          {entry.bullets.map((bullet, index) => (
            <li key={index} className="grid grid-cols-[0.75rem_minmax(0,1fr)] gap-2 text-[13px] leading-[1.48] text-[#465154] dark:text-[#d6dfdc] print:grid-cols-[8pt_minmax(0,1fr)] print:gap-1 print:text-[8.1pt] print:leading-[1.22] print:text-black">
              <span aria-hidden className="font-[family-name:var(--cv-mono)] text-[#e04b32] print:text-black">—</span>
              <span><Inline text={bullet} linkClassName={linkClass} /></span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

function EntryList({ entries }: { entries: Entry[] }) {
  return <div className="grid gap-7 print:gap-3">{entries.map((entry, index) => <EntryCard key={`${entry.heading}-${index}`} entry={entry} />)}</div>
}

function Summary({ profile }: { profile: Profile }) {
  if (profile.summary.length === 0) return null

  return (
    <Section title="Profile">
      <div className="space-y-4 print:space-y-2">
        {profile.summary.map((paragraph, index) => (
          <p key={index} className="font-[family-name:var(--cv-display)] text-[1.14rem] leading-[1.42] tracking-[-0.01em] text-[#354245] dark:text-[#e7ebe7] print:font-[family-name:var(--cv-sans)] print:text-[8.7pt] print:leading-[1.33] print:text-black">
            <Inline text={paragraph} linkClassName={linkClass} />
          </p>
        ))}
      </div>
    </Section>
  )
}

function Skills({ groups }: { groups: SkillGroup[] }) {
  return (
    <dl className="grid gap-5 print:grid-cols-2 print:gap-x-5 print:gap-y-2">
      {groups.map((group) => (
        <div key={group.name} className="print:break-inside-avoid">
          <dt className="font-[family-name:var(--cv-mono)] text-[10px] font-medium tracking-[0.12em] text-[#e04b32] uppercase dark:text-[#ff9b84] print:text-[7.6pt] print:text-black">
            {group.name}
          </dt>
          <dd className="mt-1.5 text-[13px] leading-[1.55] text-[#465154] dark:text-[#d6dfdc] print:mt-0.5 print:text-[8pt] print:leading-[1.25] print:text-black">
            {group.items.map((item, index) => (
              <Fragment key={`${item}-${index}`}>
                {index > 0 && <span className="text-[#e04b32] print:text-black"> · </span>}
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
    <main className="mx-auto w-full max-w-[79rem] px-4 py-4 sm:px-7 sm:py-7 lg:px-10 lg:py-10 print:max-w-none print:p-0">
      <div className="overflow-hidden bg-[#fffefa] shadow-[0_24px_80px_rgba(22,33,35,0.12)] dark:bg-[#1d2628] dark:shadow-none print:overflow-visible print:bg-white print:shadow-none">
        <header className="border-b border-[#1c2427]/15 px-6 pt-7 pb-6 dark:border-white/15 sm:px-10 sm:pt-10 sm:pb-8 lg:px-14 print:border-black print:px-0 print:pt-0 print:pb-3">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="mb-4 font-[family-name:var(--cv-mono)] text-[10px] font-medium tracking-[0.2em] text-[#e04b32] uppercase dark:text-[#ff9b84] print:mb-2 print:text-[7.8pt] print:text-black">Curriculum Vitae</p>
              {cv.profile.name && <h1 className="max-w-[10ch] font-[family-name:var(--cv-display)] text-[clamp(3.6rem,10vw,7.5rem)] leading-[0.78] font-semibold tracking-[-0.06em] text-[#1c2427] dark:text-[#fffaf2] print:max-w-none print:text-[29pt] print:leading-[0.9] print:text-black">{cv.profile.name}</h1>}
            </div>
            <PrintButton />
          </div>
          {cv.profile.title && <p className="mt-5 max-w-[48rem] text-base leading-snug font-medium text-[#435154] dark:text-[#d5dfdc] print:mt-2 print:text-[10pt] print:text-black">{cv.profile.title}</p>}
          <div className="mt-5 print:mt-2"><ContactLine profile={cv.profile} /></div>
        </header>

        <div className="grid gap-10 px-6 py-8 sm:px-10 sm:py-10 lg:grid-cols-[minmax(15rem,0.72fr)_minmax(0,1.28fr)] lg:gap-14 lg:px-14 lg:py-12 print:block print:px-0 print:py-4">
          <aside className="space-y-10 print:space-y-4">
            <Summary profile={cv.profile} />
            {cv.skills.length > 0 && <Section title="Capabilities"><Skills groups={cv.skills} /></Section>}
          </aside>

          <div className="space-y-10 print:mt-4 print:space-y-4">
            {cv.experience.length > 0 && <Section title="Selected Experience"><EntryList entries={cv.experience} /></Section>}
            {cv.education.length > 0 && <Section title="Education"><EntryList entries={cv.education} /></Section>}
            {cv.projects.length > 0 && <Section title="Projects"><EntryList entries={cv.projects} /></Section>}
          </div>
        </div>
      </div>
    </main>
  )
}
