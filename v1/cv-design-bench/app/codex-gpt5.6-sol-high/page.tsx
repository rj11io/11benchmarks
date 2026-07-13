import type { ReactNode } from "react"
import {
  ArrowUpRight,
  CodeXml,
  ContactRound,
  Globe2,
  Mail,
  MapPin,
} from "lucide-react"

import { Inline } from "@/lib/cv/markdown"
import type { Entry, Profile, SkillGroup } from "@/lib/cv/types"
import { loadCV } from "@/lib/cv"

import styles from "./cv.module.css"
import { PrintButton } from "./print-button"

const LINK_CLASS =
  "underline decoration-current/35 underline-offset-[3px] transition-colors hover:decoration-current"

function iconFor(key: string): ReactNode {
  const className = "size-[15px] shrink-0"

  if (key === "email") return <Mail className={className} aria-hidden="true" />
  if (key === "location")
    return <MapPin className={className} aria-hidden="true" />
  if (key === "github")
    return <CodeXml className={className} aria-hidden="true" />
  if (key === "linkedin")
    return <ContactRound className={className} aria-hidden="true" />
  return <Globe2 className={className} aria-hidden="true" />
}

function contactHref(key: string, value: string) {
  if (key === "email") return `mailto:${value}`
  if (key === "github" && !value.startsWith("http"))
    return `https://github.com/${value}`
  if (key === "linkedin" && !value.startsWith("http"))
    return `https://www.linkedin.com/in/${value}`
  if (/^https?:\/\//.test(value)) return value
  return null
}

function contactLabel(key: string, value: string) {
  if (key === "website")
    return value.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")
  if (key === "github" || key === "linkedin")
    return `@${value.replace(/^@/, "")}`
  return value
}

function ContactList({ profile }: { profile: Profile }) {
  const contacts = Object.entries(profile.meta).filter(([, value]) => value)
  if (!contacts.length) return null

  return (
    <section aria-labelledby="contact-heading" className="mt-10 print:mt-7">
      <h2
        id="contact-heading"
        className="mb-4 text-[10px] font-semibold tracking-[0.2em] text-[#a9c4be] uppercase print:mb-3"
      >
        Contact
      </h2>
      <ul className="space-y-3.5 print:space-y-2">
        {contacts.map(([key, value]) => {
          const href = contactHref(key, value)
          const content = (
            <>
              {iconFor(key)}
              <span className="min-w-0 break-words">
                {contactLabel(key, value)}
              </span>
            </>
          )

          return (
            <li
              key={key}
              className="text-[12px] leading-5 print:text-[7.4pt] print:leading-[1.35]"
            >
              {href ? (
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  className="flex items-start gap-2.5 text-[#ecf0e9] transition-colors hover:text-[#f2c14e] print:gap-1.5"
                >
                  {content}
                </a>
              ) : (
                <span className="flex items-start gap-2.5 text-[#ecf0e9] print:gap-1.5">
                  {content}
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function Skills({ groups }: { groups: SkillGroup[] }) {
  if (!groups.length) return null

  return (
    <section aria-labelledby="skills-heading" className="mt-12 print:mt-8">
      <h2
        id="skills-heading"
        className="mb-5 text-[10px] font-semibold tracking-[0.2em] text-[#a9c4be] uppercase print:mb-3"
      >
        Skills
      </h2>
      <div className="space-y-6 print:space-y-4">
        {groups.map((group) => (
          <div key={group.name}>
            <h3 className="mb-2 text-[11px] leading-4 font-semibold text-[#f2c14e] print:mb-1 print:text-[7.5pt]">
              {group.name}
            </h3>
            <p className="text-[11px] leading-[1.65] text-[#d2ded8] print:text-[7pt] print:leading-[1.45]">
              {group.items.join(" · ")}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

function SectionHeading({
  number,
  title,
  count,
}: {
  number: string
  title: string
  count?: number
}) {
  return (
    <div
      className={`${styles.sectionTitle} mb-8 flex items-end justify-between border-b border-[#172523]/20 pb-3 print:mb-3 print:pb-2`}
    >
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[10px] text-[#9a5d35]">{number}</span>
        <h2 className="text-[11px] font-semibold tracking-[0.2em] uppercase">
          {title}
        </h2>
      </div>
      {typeof count === "number" ? (
        <span className="text-[10px] text-[#716f67] tabular-nums">
          {String(count).padStart(2, "0")}
        </span>
      ) : null}
    </div>
  )
}

function EntryBlock({ entry }: { entry: Entry }) {
  const { company, school, period, location, url, ...extraMeta } = entry.meta
  const organization = company || school

  return (
    <article
      className={`${styles.entry} grid gap-4 border-b border-[#172523]/13 py-8 last:border-b-0 sm:grid-cols-[132px_minmax(0,1fr)] sm:gap-7 print:grid`}
    >
      <div className="pt-0.5">
        {period ? (
          <p className="text-[10px] leading-4 font-semibold tracking-[0.06em] text-[#9a5d35] uppercase print:text-[7pt]">
            {period}
          </p>
        ) : null}
        {location ? (
          <p className="mt-1.5 text-[10px] leading-4 text-[#77776f] print:mt-1 print:text-[7pt]">
            {location}
          </p>
        ) : null}
      </div>

      <div className="min-w-0">
        <div className="mb-4 print:mb-2">
          <h3
            className={`${styles.serif} text-[27px] leading-[1.05] font-medium tracking-[-0.025em] text-[#172523] print:text-[12pt]`}
          >
            {entry.heading}
          </h3>
          {organization ? (
            url ? (
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-semibold text-[#386b63] underline-offset-4 hover:underline print:mt-1 print:text-[7.5pt]"
              >
                {organization}
                <ArrowUpRight className="size-3" aria-hidden="true" />
              </a>
            ) : (
              <p className="mt-1.5 text-[12px] font-semibold text-[#386b63] print:mt-1 print:text-[7.5pt]">
                {organization}
              </p>
            )
          ) : url ? (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-semibold text-[#386b63] underline-offset-4 hover:underline print:mt-1 print:text-[7.5pt]"
            >
              {url.replace(/^https?:\/\//, "")}
              <ArrowUpRight className="size-3" aria-hidden="true" />
            </a>
          ) : null}
          {Object.keys(extraMeta).length ? (
            <p className="mt-1.5 text-[10px] leading-4 text-[#77776f]">
              {Object.entries(extraMeta)
                .map(([key, value]) => `${key}: ${value}`)
                .join(" · ")}
            </p>
          ) : null}
        </div>

        {entry.paragraphs.length ? (
          <div className="space-y-3 text-[13px] leading-[1.7] text-[#4f5550] print:space-y-1.5 print:text-[7.2pt] print:leading-[1.4]">
            {entry.paragraphs.map((paragraph, index) => (
              <p key={index}>
                <Inline text={paragraph} linkClassName={LINK_CLASS} />
              </p>
            ))}
          </div>
        ) : null}

        {entry.bullets.length ? (
          <ul className="mt-4 grid gap-2 text-[12px] leading-[1.65] text-[#4f5550] print:mt-2 print:gap-1 print:text-[7.2pt] print:leading-[1.4]">
            {entry.bullets.map((bullet, index) => (
              <li key={index} className="grid grid-cols-[9px_1fr] gap-2">
                <span className="mt-[0.72em] size-[3px] rounded-full bg-[#b97546] print:bg-black" />
                <span>
                  <Inline text={bullet} linkClassName={LINK_CLASS} />
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  )
}

function EntriesSection({
  entries,
  title,
  number,
  id,
}: {
  entries: Entry[]
  title: string
  number: string
  id: string
}) {
  if (!entries.length) return null

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`${styles.section} pt-16 print:pt-7`}
    >
      <div id={`${id}-heading`}>
        <SectionHeading number={number} title={title} count={entries.length} />
      </div>
      <div>
        {entries.map((entry, index) => (
          <EntryBlock key={`${entry.heading}-${index}`} entry={entry} />
        ))}
      </div>
    </section>
  )
}

export default function CVPage() {
  const cv = loadCV()
  const hasProfile = Boolean(
    cv.profile.name ||
    cv.profile.title ||
    cv.profile.summary.length ||
    Object.keys(cv.profile.meta).length
  )
  const initials = cv.profile.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
  let sectionIndex = 0
  const profileNumber = cv.profile.summary.length
    ? String(++sectionIndex).padStart(2, "0")
    : ""
  const experienceNumber = cv.experience.length
    ? String(++sectionIndex).padStart(2, "0")
    : ""
  const educationNumber = cv.education.length
    ? String(++sectionIndex).padStart(2, "0")
    : ""
  const projectsNumber = cv.projects.length
    ? String(++sectionIndex).padStart(2, "0")
    : ""

  return (
    <main
      className={`${styles.cv} min-h-screen bg-[#d8d5cb] px-0 py-0 text-[#172523] lg:px-8 lg:py-8 print:p-0`}
    >
      <div
        className={`${styles.sheet} mx-auto grid w-full max-w-[1260px] bg-[#f6f1e7] shadow-[0_24px_80px_rgba(24,36,34,0.16)] lg:grid-cols-[320px_minmax(0,1fr)] print:shadow-none`}
      >
        <aside
          className={`${styles.rail} bg-[#123a37] px-6 py-8 text-white sm:px-9 sm:py-10 lg:px-10 lg:py-12 print:block`}
        >
          <div className="lg:sticky lg:top-12 print:static">
            <div className="flex items-center justify-between border-b border-white/20 pb-6 print:pb-4">
              <span
                className={`${styles.serif} grid size-12 place-items-center rounded-full border border-[#f2c14e]/70 text-[19px] leading-none text-[#f2c14e] print:size-9 print:text-[13pt]`}
                aria-hidden="true"
              >
                {initials}
              </span>
              <span className="text-right text-[9px] leading-4 font-semibold tracking-[0.18em] text-[#a9c4be] uppercase">
                Curriculum
                <br />
                Vitae
              </span>
            </div>

            {hasProfile ? (
              <div className="mt-8 print:mt-5">
                {cv.profile.title ? (
                  <p className="max-w-[220px] text-[24px] leading-[1.08] font-medium tracking-[-0.04em] text-white print:text-[14pt]">
                    {cv.profile.title}
                  </p>
                ) : null}
                <div className="mt-6 print:hidden">
                  <PrintButton />
                </div>
              </div>
            ) : null}

            <ContactList profile={cv.profile} />
            <Skills groups={cv.skills} />

            <div className="mt-12 hidden border-t border-white/20 pt-5 text-[9px] tracking-[0.14em] text-[#a9c4be] uppercase lg:block print:hidden">
              <span className="inline-block size-1.5 rounded-full bg-[#f2c14e] align-middle" />
              <span className="ml-2">
                {[cv.profile.meta.location, new Date().getFullYear()]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </div>
          </div>
        </aside>

        <div
          className={`${styles.main} min-w-0 px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16 print:block`}
        >
          {hasProfile ? (
            <>
              <header
                className={`${styles.hero} border-b border-[#172523]/20 pb-12 print:pb-7`}
              >
                <div className="mb-7 flex items-center gap-3 print:mb-3">
                  <span className="h-px w-8 bg-[#b97546]" />
                  <span className="text-[10px] font-semibold tracking-[0.2em] text-[#9a5d35] uppercase">
                    Portfolio / CV
                  </span>
                </div>
                {cv.profile.name ? (
                  <h1
                    className={`${styles.serif} max-w-[760px] text-[clamp(4.1rem,10vw,8rem)] leading-[0.78] font-medium tracking-[-0.065em] text-[#172523]`}
                  >
                    {cv.profile.name}
                  </h1>
                ) : null}
                {cv.profile.title ? (
                  <p className="mt-7 text-[13px] font-semibold tracking-[0.17em] text-[#386b63] uppercase print:mt-4 print:text-[8pt]">
                    {cv.profile.title}
                  </p>
                ) : null}
              </header>

              {cv.profile.summary.length ? (
                <section
                  id="profile"
                  aria-labelledby="profile-heading"
                  className={`${styles.section} pt-14 print:pt-7`}
                >
                  <div id="profile-heading">
                    <SectionHeading number={profileNumber} title="Profile" />
                  </div>
                  <div
                    className={`${styles.profileGrid} grid gap-8 xl:grid-cols-[0.95fr_1.05fr]`}
                  >
                    <p
                      className={`${styles.serif} text-[25px] leading-[1.3] tracking-[-0.02em] text-[#273b38] print:text-[11pt] print:leading-[1.3]`}
                    >
                      <Inline
                        text={cv.profile.summary[0]}
                        linkClassName={LINK_CLASS}
                      />
                    </p>
                    {cv.profile.summary.length > 1 ? (
                      <div
                        className={`${styles.profileBody} space-y-4 text-[12px] leading-[1.72] text-[#535b55] print:space-y-2`}
                      >
                        {cv.profile.summary.slice(1).map((paragraph, index) => (
                          <p key={index}>
                            <Inline
                              text={paragraph}
                              linkClassName={LINK_CLASS}
                            />
                          </p>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </section>
              ) : null}
            </>
          ) : null}

          <EntriesSection
            entries={cv.experience}
            title="Experience"
            number={experienceNumber}
            id="experience"
          />

          {cv.education.length || cv.projects.length ? (
            <div
              className={`${styles.bottomGrid} grid gap-12 xl:grid-cols-2 xl:gap-10 print:grid`}
            >
              <EntriesSection
                entries={cv.education}
                title="Education"
                number={educationNumber}
                id="education"
              />
              <EntriesSection
                entries={cv.projects}
                title="Projects"
                number={projectsNumber}
                id="projects"
              />
            </div>
          ) : null}
        </div>
      </div>
    </main>
  )
}
