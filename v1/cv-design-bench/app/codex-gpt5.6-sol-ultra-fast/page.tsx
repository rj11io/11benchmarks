import type { ReactNode } from "react"

import { Inline } from "@/lib/cv/markdown"
import { loadCV, type Entry, type SkillGroup } from "@/lib/cv"

import { PrintButton } from "./print-button"
import styles from "./cv.module.css"

const ORGANIZATION_KEYS = new Set([
  "company",
  "school",
  "organization",
  "institution",
  "client",
])

function humanize(key: string) {
  return key
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function withProtocol(value: string) {
  if (/^[a-z][a-z\d+.-]*:/i.test(value)) return value
  return `https://${value}`
}

function readableUrl(value: string) {
  return value
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/\/$/, "")
}

function profileHref(key: string, value: string) {
  const normalizedKey = key.toLowerCase()

  if (normalizedKey === "email") return `mailto:${value}`
  if (/^https?:\/\//i.test(value)) return value
  if (normalizedKey === "linkedin") {
    return `https://www.linkedin.com/in/${value.replace(/^@/, "")}`
  }
  if (normalizedKey === "github") {
    return `https://github.com/${value.replace(/^@/, "")}`
  }
  if (
    normalizedKey.includes("website") ||
    normalizedKey.includes("url") ||
    normalizedKey === "portfolio"
  ) {
    return withProtocol(value)
  }

  return undefined
}

function readableProfileValue(key: string, value: string) {
  if (/^https?:\/\//i.test(value)) return readableUrl(value)
  if (key === "linkedin") return `linkedin.com/in/${value.replace(/^@/, "")}`
  if (key === "github") return `github.com/${value.replace(/^@/, "")}`
  return value
}

function LinkedValue({
  href,
  children,
  className,
}: {
  href?: string
  children: ReactNode
  className?: string
}) {
  if (!href) return <>{children}</>

  const external = /^https?:\/\//i.test(href)
  return (
    <a
      href={href}
      className={className}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      {children}
    </a>
  )
}

function ProfileLedger({ entries }: { entries: [string, string][] }) {
  if (entries.length === 0) return null

  return (
    <dl
      className={`${styles.contacts} border-t border-[#171a22]/20 dark:border-white/20`}
    >
      {entries.map(([key, value]) => (
        <div
          key={key}
          className="grid min-w-0 grid-cols-[5.25rem_minmax(0,1fr)] gap-3 border-b border-[#171a22]/20 py-2.5 dark:border-white/20"
        >
          <dt className="font-mono text-[0.61rem] leading-5 tracking-[0.12em] text-[#59606f] uppercase dark:text-[#9da7bb]">
            {humanize(key)}
          </dt>
          <dd className="min-w-0 text-[0.76rem] leading-5 font-medium text-[#171a22] dark:text-[#edf0f7]">
            <LinkedValue
              href={profileHref(key, value)}
              className={`${styles.contactLink} break-words`}
            >
              {readableProfileValue(key, value)}
            </LinkedValue>
          </dd>
        </div>
      ))}
    </dl>
  )
}

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  return (
    <section
      aria-labelledby={id}
      className={`${styles.section} grid gap-8 border-t border-[#171a22]/20 px-6 py-14 sm:px-10 lg:grid-cols-[8.5rem_minmax(0,1fr)] lg:gap-10 lg:px-14 lg:py-20 dark:border-white/15 print:border-black/30`}
    >
      <header
        className={`${styles.sectionRail} flex items-baseline gap-3 lg:block`}
      >
        <span
          aria-hidden="true"
          className={`${styles.sectionCounter} font-mono text-[0.63rem] tracking-[0.14em] text-[#214fd4] dark:text-[#7894ff]`}
        />
        <h2
          id={id}
          className={`${styles.sectionHeading} mt-0 font-mono text-[0.67rem] font-semibold tracking-[0.16em] text-[#171a22] uppercase lg:mt-4 dark:text-[#edf0f7]`}
        >
          {title}
        </h2>
      </header>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

function CompactSection({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: ReactNode
}) {
  return (
    <section
      aria-labelledby={id}
      className={`${styles.section} ${styles.compactSection} min-w-0 px-6 py-12 sm:px-10 lg:px-14 lg:py-16`}
    >
      <header className="flex items-baseline gap-3">
        <span
          aria-hidden="true"
          className={`${styles.sectionCounter} font-mono text-[0.63rem] tracking-[0.14em] text-[#214fd4] dark:text-[#7894ff]`}
        />
        <h2
          id={id}
          className={`${styles.sectionHeading} font-mono text-[0.67rem] font-semibold tracking-[0.16em] text-[#171a22] uppercase dark:text-[#edf0f7]`}
        >
          {title}
        </h2>
      </header>
      <div className="mt-7 min-w-0">{children}</div>
    </section>
  )
}

function Organization({ entry }: { entry: Entry }) {
  const organizations = Object.entries(entry.meta).filter(([key]) =>
    ORGANIZATION_KEYS.has(key)
  )

  if (organizations.length === 0) return null

  return (
    <p
      className={`${styles.organization} mt-2 text-sm leading-6 font-semibold text-[#214fd4] dark:text-[#8da3ff]`}
    >
      {organizations.map(([key, value], index) => (
        <span key={key}>
          {index > 0 ? <span aria-hidden="true"> · </span> : null}
          <Inline text={value} linkClassName={styles.inlineLink} />
        </span>
      ))}
    </p>
  )
}

function DetailValue({ metaKey, value }: { metaKey: string; value: string }) {
  if (metaKey === "url") {
    return (
      <a
        href={withProtocol(value)}
        target="_blank"
        rel="noreferrer"
        className={`${styles.contactLink} break-words`}
      >
        {readableUrl(value)}
      </a>
    )
  }

  return <Inline text={value} linkClassName={styles.inlineLink} />
}

function EntryDetails({
  entry,
  compact = false,
}: {
  entry: Entry
  compact?: boolean
}) {
  const details = Object.entries(entry.meta).filter(
    ([key]) => !ORGANIZATION_KEYS.has(key)
  )

  if (details.length === 0) return null

  if (compact) {
    return (
      <dl className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[0.69rem] leading-5 text-[#59606f] dark:text-[#a9b0bf]">
        {details.map(([key, value]) => (
          <div key={key} className="flex min-w-0 gap-1.5">
            {!["period", "location", "url"].includes(key) ? (
              <dt className="font-mono tracking-[0.08em] uppercase">
                {humanize(key)}
              </dt>
            ) : null}
            <dd className="min-w-0">
              <DetailValue metaKey={key} value={value} />
            </dd>
          </div>
        ))}
      </dl>
    )
  }

  return (
    <dl
      className={`${styles.metaList} mt-5 space-y-2 text-[0.68rem] leading-5 text-[#59606f] md:mt-6 dark:text-[#a9b0bf]`}
    >
      {details.map(([key, value]) => (
        <div key={key} className="min-w-0">
          {!["period", "location", "url"].includes(key) ? (
            <dt className="mb-0.5 font-mono text-[0.57rem] tracking-[0.1em] uppercase">
              {humanize(key)}
            </dt>
          ) : null}
          <dd className="min-w-0">
            <DetailValue metaKey={key} value={value} />
          </dd>
        </div>
      ))}
    </dl>
  )
}

function EntryBody({ entry }: { entry: Entry }) {
  if (entry.paragraphs.length === 0 && entry.bullets.length === 0) return null

  return (
    <div
      className={`${styles.entryBody} mt-6 text-[0.88rem] leading-[1.75] text-[#343946] dark:text-[#c8ceda]`}
    >
      {entry.paragraphs.map((paragraph, index) => (
        <p key={index} className="mt-4 first:mt-0">
          <Inline text={paragraph} linkClassName={styles.inlineLink} />
        </p>
      ))}
      {entry.bullets.length > 0 ? (
        <ul className={`${styles.bulletList} mt-5 space-y-2.5`}>
          {entry.bullets.map((bullet, index) => (
            <li
              key={index}
              className="grid grid-cols-[0.9rem_minmax(0,1fr)] gap-2.5"
            >
              <span
                aria-hidden="true"
                className="text-[#214fd4] dark:text-[#7894ff]"
              >
                —
              </span>
              <span>
                <Inline text={bullet} linkClassName={styles.inlineLink} />
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

function EntryItem({
  entry,
  index,
  compact = false,
}: {
  entry: Entry
  index: number
  compact?: boolean
}) {
  const keepTogether = entry.paragraphs.length <= 1 && entry.bullets.length <= 3
  const sequence = String(index + 1).padStart(2, "0")

  if (compact) {
    return (
      <article
        className={`${styles.compactEntry} ${styles.entryKeep} border-t border-[#171a22]/20 py-7 first:border-t-0 first:pt-0 dark:border-white/15`}
      >
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-[0.58rem] tracking-[0.14em] text-[#7a808e] dark:text-[#8f98aa]">
            {sequence}
          </span>
        </div>
        <div className={`${styles.entryHeader} mt-3`}>
          <h3
            className={`${styles.display} ${styles.role} text-[1.8rem] leading-[1.03] tracking-[-0.025em] text-[#171a22] dark:text-[#f3f1ea]`}
          >
            <Inline text={entry.heading} linkClassName={styles.inlineLink} />
          </h3>
          <Organization entry={entry} />
          <EntryDetails entry={entry} compact />
        </div>
        <EntryBody entry={entry} />
      </article>
    )
  }

  return (
    <article
      className={`${styles.entry} ${keepTogether ? styles.entryKeep : ""} grid gap-5 border-t border-[#171a22]/20 py-10 first:border-t-0 first:pt-0 md:grid-cols-[8.5rem_minmax(0,1fr)] md:gap-8 dark:border-white/15`}
    >
      <aside
        className={`${styles.entrySide} flex items-start justify-between gap-5 md:block`}
      >
        <span className="font-mono text-[0.58rem] tracking-[0.14em] text-[#7a808e] dark:text-[#8f98aa]">
          {sequence}
        </span>
        <EntryDetails entry={entry} />
      </aside>
      <div className="min-w-0">
        <header className={styles.entryHeader}>
          <h3
            className={`${styles.display} ${styles.role} text-[2rem] leading-[1.02] tracking-[-0.025em] text-[#171a22] sm:text-[2.25rem] dark:text-[#f3f1ea]`}
          >
            <Inline text={entry.heading} linkClassName={styles.inlineLink} />
          </h3>
          <Organization entry={entry} />
        </header>
        <EntryBody entry={entry} />
      </div>
    </article>
  )
}

function EntryList({
  entries,
  compact = false,
}: {
  entries: Entry[]
  compact?: boolean
}) {
  return (
    <div>
      {entries.map((entry, index) => (
        <EntryItem
          key={`${entry.heading}-${index}`}
          entry={entry}
          index={index}
          compact={compact}
        />
      ))}
    </div>
  )
}

function Skills({ groups }: { groups: SkillGroup[] }) {
  return (
    <div
      className={`${styles.skillsGrid} grid border-t border-l border-[#171a22]/20 sm:grid-cols-2 dark:border-white/15`}
    >
      {groups.map((group) => (
        <div
          key={group.name}
          className="min-w-0 border-r border-b border-[#171a22]/20 p-6 sm:p-7 dark:border-white/15"
        >
          <h3 className="font-mono text-[0.61rem] font-semibold tracking-[0.12em] text-[#214fd4] uppercase dark:text-[#8da3ff]">
            <Inline text={group.name} linkClassName={styles.inlineLink} />
          </h3>
          <ul
            className={`${styles.skillItems} mt-4 flex flex-wrap text-[0.88rem] leading-7 font-medium text-[#2d323e] dark:text-[#d7dce6]`}
          >
            {group.items.map((item, index) => (
              <li key={`${item}-${index}`}>
                <Inline text={item} linkClassName={styles.inlineLink} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default function CVPage() {
  const cv = loadCV()
  const { profile } = cv
  const metaEntries = Object.entries(profile.meta)
  const location = metaEntries.find(([key]) => key === "location")?.[1]
  const ledgerEntries = metaEntries.filter(([key]) => key !== "location")
  const skillGroups = cv.skills.filter((group) => group.items.length > 0)
  const hasIdentity = Boolean(
    profile.name || profile.title || metaEntries.length
  )
  const documentLabel = profile.name || profile.title || "Curriculum Vitae"

  return (
    <main
      className={`${styles.cv} min-h-screen overflow-x-clip bg-[#e9e6df] text-[#171a22] dark:bg-[#0f1219] dark:text-[#edf0f7] print:min-h-0 print:bg-white print:text-black`}
    >
      <div
        className={`${styles.toolbar} mx-auto flex max-w-[1180px] items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-6 print:hidden`}
      >
        <p className="min-w-0 truncate font-mono text-[0.62rem] tracking-[0.14em] text-[#555b68] uppercase dark:text-[#a8afbd]">
          CV{" "}
          <span className="px-1.5 text-[#214fd4] dark:text-[#7894ff]">/</span>{" "}
          {documentLabel}
        </p>
        <PrintButton />
      </div>

      <article
        className={`${styles.sheet} relative mx-auto max-w-[1180px] overflow-hidden bg-[#f8f6ef] shadow-[0_30px_90px_rgba(24,28,39,0.13)] sm:rounded-[2px] dark:bg-[#171b24] dark:shadow-[0_30px_90px_rgba(0,0,0,0.35)] print:max-w-none print:overflow-visible print:bg-white print:shadow-none`}
      >
        {hasIdentity ? (
          <header className={styles.masthead}>
            <div className="flex items-center justify-between gap-6 border-b border-[#171a22]/20 px-6 py-4 font-mono text-[0.61rem] tracking-[0.14em] uppercase sm:px-10 lg:px-14 dark:border-white/15">
              <span className="text-[#214fd4] dark:text-[#8da3ff]">
                Curriculum Vitae
              </span>
              {location ? (
                <span className="text-right text-[#59606f] dark:text-[#a9b0bf]">
                  {location}
                </span>
              ) : null}
            </div>

            <div className="grid gap-12 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[minmax(0,1.45fr)_minmax(17rem,0.55fr)] lg:items-end lg:gap-16 lg:px-14 lg:py-20">
              <div className="min-w-0">
                {profile.name || profile.title ? (
                  <h1
                    className={`${styles.display} ${styles.name} max-w-[10ch] text-[clamp(4.25rem,10vw,8.3rem)] leading-[0.82] tracking-[-0.055em] text-[#171a22] dark:text-[#f3f1ea]`}
                  >
                    {profile.name || profile.title}
                  </h1>
                ) : null}
                {profile.name && profile.title ? (
                  <p className="mt-8 max-w-xl text-[0.78rem] leading-6 font-semibold tracking-[0.14em] text-[#214fd4] uppercase dark:text-[#8da3ff]">
                    {profile.title}
                  </p>
                ) : null}
              </div>
              <ProfileLedger entries={ledgerEntries} />
            </div>
          </header>
        ) : null}

        <div className={styles.cvBody}>
          {profile.summary.length > 0 ? (
            <Section id="profile" title="Profile">
              <p
                className={`${styles.display} ${styles.profileLede} text-[1.45rem] leading-[1.38] tracking-[-0.012em] text-[#1e2330] sm:text-[1.65rem] dark:text-[#eef0f5]`}
              >
                <Inline
                  text={profile.summary[0]}
                  linkClassName={styles.inlineLink}
                />
              </p>
              {profile.summary.length > 1 ? (
                <div
                  className={`${styles.profileColumns} mt-10 columns-1 gap-10 text-[0.86rem] leading-[1.78] text-[#414653] xl:columns-2 dark:text-[#c1c7d2]`}
                >
                  {profile.summary.slice(1).map((paragraph, index) => (
                    <p
                      key={index}
                      className="mb-5 break-inside-avoid last:mb-0"
                    >
                      <Inline
                        text={paragraph}
                        linkClassName={styles.inlineLink}
                      />
                    </p>
                  ))}
                </div>
              ) : null}
            </Section>
          ) : null}

          {cv.experience.length > 0 ? (
            <Section id="experience" title="Experience">
              <EntryList entries={cv.experience} />
            </Section>
          ) : null}

          {cv.education.length > 0 || cv.projects.length > 0 ? (
            <div
              className={`${styles.closingGrid} grid border-t border-[#171a22]/20 lg:grid-cols-2 dark:border-white/15`}
            >
              {cv.education.length > 0 ? (
                <CompactSection id="education" title="Education">
                  <EntryList entries={cv.education} compact />
                </CompactSection>
              ) : null}
              {cv.projects.length > 0 ? (
                <CompactSection id="projects" title="Projects">
                  <EntryList entries={cv.projects} compact />
                </CompactSection>
              ) : null}
            </div>
          ) : null}

          {skillGroups.length > 0 ? (
            <Section id="skills" title="Skills">
              <Skills groups={skillGroups} />
            </Section>
          ) : null}
        </div>

        {profile.name || profile.title ? (
          <footer className="flex flex-col gap-2 border-t border-[#171a22]/20 px-6 py-8 text-[0.62rem] tracking-[0.12em] uppercase sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-14 dark:border-white/15 print:hidden">
            {profile.name ? <span>{profile.name}</span> : null}
            {profile.title ? (
              <span className="text-[#6b7180] dark:text-[#9ba4b4]">
                {profile.title}
              </span>
            ) : null}
          </footer>
        ) : null}
      </article>

      <div aria-hidden="true" className="h-10 sm:h-20 print:hidden" />
    </main>
  )
}
