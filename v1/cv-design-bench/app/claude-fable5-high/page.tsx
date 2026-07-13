import { Fragment } from "react"

import { loadCV } from "@/lib/cv"
import type { Entry, SkillGroup } from "@/lib/cv"
import { Inline } from "@/lib/cv/markdown"
import { cn } from "@/lib/utils"

import styles from "./cv.module.css"
import { PrintButton } from "./print-button"

const SERIF = "font-[family-name:var(--font-serif-cv)]"
const LINK =
  "underline decoration-foreground/25 underline-offset-[3px] transition-colors hover:decoration-foreground print:decoration-foreground/40"

type Contact = { label: string; href?: string }

// Turn the free-form frontmatter meta (location, email, website, handles,
// anything else) into a display label + optional link, in a stable order.
function contactList(meta: Record<string, string>): Contact[] {
  const bare = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "")
  const known: Record<string, (value: string) => Contact> = {
    location: (value) => ({ label: value }),
    email: (value) => ({ label: value, href: `mailto:${value}` }),
    website: (value) => ({ label: bare(value).replace(/^www\./, ""), href: value }),
    github: (value) => {
      const href = value.startsWith("http") ? value : `https://github.com/${value}`
      return { label: bare(href), href }
    },
    linkedin: (value) => {
      const href = value.startsWith("http")
        ? value
        : `https://www.linkedin.com/in/${value}`
      return { label: bare(href).replace(/^www\./, ""), href }
    },
  }
  const order = ["location", "email", "website", "github", "linkedin"]
  const rest = Object.keys(meta).filter((key) => !order.includes(key))
  return [...order, ...rest]
    .filter((key) => meta[key])
    .map((key) => {
      const build = known[key]
      if (build) return build(meta[key])
      return meta[key].startsWith("http")
        ? { label: bare(meta[key]), href: meta[key] }
        : { label: meta[key] }
    })
}

// JSX drops the newline whitespace between sibling elements, so separators
// must carry their own spaces: a non-breaking one keeps the dot attached to
// the item before it, the plain one after is the line's soft-wrap point.
function Dot() {
  return (
    <span aria-hidden className="select-none text-muted-foreground/50">
      {" · "}
    </span>
  )
}

function ContactLink({ contact }: { contact: Contact }) {
  if (!contact.href) return <span>{contact.label}</span>
  const external = contact.href.startsWith("http")
  return (
    <a
      href={contact.href}
      className={LINK}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    >
      {contact.label}
    </a>
  )
}

function Section({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <section className="grid grid-cols-1 gap-y-5 border-t border-border pt-7 md:grid-cols-[8.5rem_1fr] md:gap-x-12 print:grid-cols-[7.5rem_1fr] print:gap-x-8 print:pt-5">
      <h2 className="text-[11px] font-medium tracking-[0.22em] uppercase text-muted-foreground md:mt-1 print:break-after-avoid">
        {label}
      </h2>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

function EntryItem({ entry }: { entry: Entry }) {
  const org = entry.meta.company ?? entry.meta.school
  const url = entry.meta.url
  const location = entry.meta.location
  // With no org line to carry the link (projects), the heading itself links.
  const headingLinks = Boolean(url && !org)
  return (
    <article className="break-inside-avoid">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-0.5">
        <h3 className={cn(SERIF, "text-lg/6 font-medium text-balance")}>
          {headingLinks ? (
            <a href={url} className={LINK} target="_blank" rel="noreferrer">
              {entry.heading}
            </a>
          ) : (
            entry.heading
          )}
        </h3>
        {entry.meta.period && (
          <p className="font-mono text-xs whitespace-nowrap text-muted-foreground">
            {entry.meta.period}
          </p>
        )}
      </div>
      {(org || location) && (
        <p className="mt-1 text-sm text-muted-foreground">
          {org &&
            (url ? (
              <a href={url} className={LINK} target="_blank" rel="noreferrer">
                {org}
              </a>
            ) : (
              org
            ))}
          {org && location && <Dot />}
          {location}
        </p>
      )}
      {entry.paragraphs.map((text, i) => (
        <p
          key={i}
          className="mt-3 max-w-prose text-sm/relaxed text-pretty text-foreground/80"
        >
          <Inline text={text} linkClassName={LINK} />
        </p>
      ))}
      {entry.bullets.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {entry.bullets.map((item, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-sm/relaxed text-foreground/80"
            >
              <span aria-hidden className="select-none text-muted-foreground/60">
                –
              </span>
              <span className="max-w-prose min-w-0 text-pretty">
                <Inline text={item} linkClassName={LINK} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

function SkillGroups({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className="space-y-4 print:space-y-2.5">
      {groups.map((group) => (
        <div
          key={group.name}
          className="grid gap-x-6 gap-y-1 break-inside-avoid sm:grid-cols-[10rem_1fr] print:grid-cols-[9rem_1fr]"
        >
          <h3 className="text-sm/relaxed font-medium">{group.name}</h3>
          <p className="min-w-0 text-sm/relaxed text-foreground/80">
            {group.items.map((item, i) => (
              <Fragment key={i}>
                {i > 0 && <Dot />}
                <Inline text={item} linkClassName={LINK} />
              </Fragment>
            ))}
          </p>
        </div>
      ))}
    </div>
  )
}

export default function Page() {
  const { profile, experience, education, projects, skills } = loadCV()
  const contacts = contactList(profile.meta)

  return (
    <div className={cn(styles.page, "bg-background text-foreground")}>
      {/* Print fixes that must reach outside this tree: hide the Next.js
          dev-tools overlay, and keep the document canvas white so no dark
          edge peeks around the page in dark mode. This style only exists
          while this route is mounted, so it cannot leak into other routes. */}
      <style>
        {"@media print { nextjs-portal { display: none } html, body { background: #fff !important } }"}
      </style>
      <div className="mx-auto max-w-[50rem] px-6 py-16 sm:px-8 sm:py-24 print:max-w-none print:p-0">
        <header className="relative">
          {profile.name && (
            <h1
              className={cn(
                SERIF,
                "text-4xl/[1.1] font-medium tracking-tight text-balance sm:text-[2.75rem]/[1.1]",
              )}
            >
              {profile.name}
            </h1>
          )}
          {profile.title && (
            <p
              className={cn(
                SERIF,
                "mt-2.5 text-lg/snug italic text-pretty text-muted-foreground sm:text-xl/snug",
              )}
            >
              {profile.title}
            </p>
          )}
          {contacts.length > 0 && (
            <p className="mt-6 font-mono text-xs/loose text-muted-foreground print:mt-4 print:text-[11px]/loose">
              {contacts.map((contact, i) => (
                <Fragment key={i}>
                  {i > 0 && <Dot />}
                  <span className="whitespace-nowrap">
                    <ContactLink contact={contact} />
                  </span>
                </Fragment>
              ))}
            </p>
          )}
          <div className="mt-8 sm:absolute sm:top-1 sm:right-0 sm:mt-0 print:hidden">
            <PrintButton />
          </div>
        </header>

        <main className="mt-12 space-y-12 print:mt-8 print:space-y-7">
          {profile.summary.length > 0 && (
            <Section label="Profile">
              <div className="max-w-prose space-y-4">
                {profile.summary.map((text, i) => (
                  <p
                    key={i}
                    className="text-[15px]/relaxed text-pretty text-foreground/85"
                  >
                    <Inline text={text} linkClassName={LINK} />
                  </p>
                ))}
              </div>
            </Section>
          )}

          {experience.length > 0 && (
            <Section label="Experience">
              <div className="space-y-9 print:space-y-6">
                {experience.map((entry, i) => (
                  <EntryItem key={i} entry={entry} />
                ))}
              </div>
            </Section>
          )}

          {projects.length > 0 && (
            <Section label="Projects">
              <div className="space-y-9 print:space-y-6">
                {projects.map((entry, i) => (
                  <EntryItem key={i} entry={entry} />
                ))}
              </div>
            </Section>
          )}

          {education.length > 0 && (
            <Section label="Education">
              <div className="space-y-9 print:space-y-6">
                {education.map((entry, i) => (
                  <EntryItem key={i} entry={entry} />
                ))}
              </div>
            </Section>
          )}

          {skills.length > 0 && (
            <Section label="Skills">
              <SkillGroups groups={skills} />
            </Section>
          )}
        </main>
      </div>
    </div>
  )
}
