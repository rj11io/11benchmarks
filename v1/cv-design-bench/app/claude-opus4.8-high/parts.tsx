import type { Entry, Profile, SkillGroup } from "@/lib/cv"
import { Inline } from "@/lib/cv/markdown"

import styles from "./cv.module.css"

// Inline links inside body copy and bullets.
const bodyLink =
  "underline decoration-muted-foreground/40 underline-offset-2 transition-colors hover:decoration-foreground"

// Standalone links in the contact bar.
const contactLink =
  "underline-offset-4 transition-colors hover:text-foreground hover:underline"

/** A titled section with a small tracked eyebrow label. */
export function Section({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-12 sm:mt-14 print:mt-8">
      <h2
        className={`${styles.eyebrow} text-[0.7rem] font-medium tracking-[0.2em] text-muted-foreground uppercase`}
      >
        {label}
      </h2>
      <div className="mt-5 print:mt-4">{children}</div>
    </section>
  )
}

/** Renders paragraphs + highlight bullets shared by every entry type. */
function Body({ paragraphs, bullets }: { paragraphs: string[]; bullets: string[] }) {
  return (
    <>
      {paragraphs.length > 0 && (
        <div className="mt-3 space-y-2 text-[0.9rem] leading-relaxed text-foreground/80">
          {paragraphs.map((text, i) => (
            <p key={i}>
              <Inline text={text} linkClassName={bodyLink} />
            </p>
          ))}
        </div>
      )}
      {bullets.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {bullets.map((text, i) => (
            <li
              key={i}
              className="relative pl-4 text-[0.9rem] leading-relaxed text-foreground/80"
            >
              <span className={styles.marker} aria-hidden />
              <Inline text={text} linkClassName={bodyLink} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

function stripProtocol(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "")
}

/** One experience / education / project entry. */
export function EntryItem({ entry }: { entry: Entry }) {
  const { heading, meta, paragraphs, bullets } = entry
  const period = meta.period
  const location = meta.location
  const url = meta.url

  // The subtitle is whichever of these the entry carries; if there is a
  // URL it becomes a link. Projects with only a URL show its domain.
  const subtitleText = meta.company || meta.school || (url ? stripProtocol(url) : "")

  return (
    <article
      className={`${styles.entry} py-6 first:pt-0 last:pb-0 print:py-4`}
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h3 className="text-[0.95rem] leading-snug font-semibold text-foreground">
            {heading}
          </h3>
          {subtitleText && (
            <p className="mt-0.5 text-[0.9rem] text-muted-foreground">
              {url ? (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className={contactLink}
                >
                  {subtitleText}
                </a>
              ) : (
                subtitleText
              )}
            </p>
          )}
        </div>

        {(period || location) && (
          <div className="shrink-0 font-mono text-xs text-muted-foreground sm:text-right">
            {period && <div className="whitespace-nowrap">{period}</div>}
            {location && <div className="mt-0.5">{location}</div>}
          </div>
        )}
      </div>

      <Body paragraphs={paragraphs} bullets={bullets} />
    </article>
  )
}

/** A vertical list of entries with hairline separators. */
export function EntryList({ entries }: { entries: Entry[] }) {
  return (
    <div className="divide-y divide-border/60">
      {entries.map((entry, i) => (
        <EntryItem key={`${entry.heading}-${i}`} entry={entry} />
      ))}
    </div>
  )
}

type ContactItem = { label: string; href?: string }

function buildContacts(meta: Record<string, string>): ContactItem[] {
  const items: ContactItem[] = []

  if (meta.location) items.push({ label: meta.location })
  if (meta.email) items.push({ label: meta.email, href: `mailto:${meta.email}` })
  if (meta.website)
    items.push({ label: stripProtocol(meta.website), href: meta.website })
  if (meta.linkedin) {
    const v = meta.linkedin
    const href = v.startsWith("http") ? v : `https://www.linkedin.com/in/${v}`
    items.push({ label: "LinkedIn", href })
  }
  if (meta.github) {
    const v = meta.github
    const href = v.startsWith("http") ? v : `https://github.com/${v}`
    items.push({ label: "GitHub", href })
  }

  return items
}

/** Location + contact links as a single wrapping row. */
export function ContactBar({ profile }: { profile: Profile }) {
  const items = buildContacts(profile.meta)
  if (items.length === 0) return null

  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.9rem] text-muted-foreground">
      {items.map((item, i) => (
        <span key={i} className="inline-flex items-center gap-x-3">
          {i > 0 && (
            <span aria-hidden className="text-muted-foreground/40">
              ·
            </span>
          )}
          {item.href ? (
            <a
              href={item.href}
              target={item.href.startsWith("mailto:") ? undefined : "_blank"}
              rel="noreferrer"
              className={contactLink}
            >
              {item.label}
            </a>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </div>
  )
}

/** Skills as label / values rows. */
export function Skills({ groups }: { groups: SkillGroup[] }) {
  return (
    <dl className="space-y-4">
      {groups.map((group) => (
        <div
          key={group.name}
          className={`${styles.avoidBreak} grid grid-cols-1 gap-1 sm:grid-cols-[9rem_1fr] sm:gap-6`}
        >
          <dt className="text-[0.9rem] font-medium text-foreground">
            {group.name}
          </dt>
          <dd className="text-[0.9rem] leading-relaxed text-muted-foreground">
            {group.items.join("  ·  ")}
          </dd>
        </div>
      ))}
    </dl>
  )
}
