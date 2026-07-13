import { loadCV } from "@/lib/cv"
import { Inline } from "@/lib/cv/markdown"

import styles from "./cv.module.css"
import { ContactBar, EntryList, Section, Skills } from "./parts"
import { PrintButton } from "./print-button"

export default function Page() {
  const { profile, experience, education, projects, skills } = loadCV()

  return (
    <main className="mx-auto max-w-3xl px-6 py-10 sm:px-8 sm:py-16 print:py-0">
      {/* Screen-only utility row. Hidden from the printed document. */}
      <div className="mb-8 flex justify-end print:hidden">
        <PrintButton />
      </div>

      <header>
        {profile.name && (
          <h1
            className={`${styles.serif} text-4xl leading-none tracking-tight text-foreground sm:text-[3.25rem] print:text-3xl`}
          >
            {profile.name}
          </h1>
        )}
        {profile.title && (
          <p className="mt-3 text-lg text-muted-foreground sm:text-xl">
            {profile.title}
          </p>
        )}
        <ContactBar profile={profile} />
      </header>

      {profile.summary.length > 0 && (
        <div className="mt-6 max-w-[62ch] space-y-3 text-[0.95rem] leading-relaxed text-foreground/85 sm:text-base">
          {profile.summary.map((text, i) => (
            <p key={i}>
              <Inline
                text={text}
                linkClassName="underline decoration-muted-foreground/40 underline-offset-2 transition-colors hover:decoration-foreground"
              />
            </p>
          ))}
        </div>
      )}

      {experience.length > 0 && (
        <Section label="Experience">
          <EntryList entries={experience} />
        </Section>
      )}

      {projects.length > 0 && (
        <Section label="Projects">
          <EntryList entries={projects} />
        </Section>
      )}

      {education.length > 0 && (
        <Section label="Education">
          <EntryList entries={education} />
        </Section>
      )}

      {skills.length > 0 && (
        <Section label="Skills">
          <Skills groups={skills} />
        </Section>
      )}
    </main>
  )
}
