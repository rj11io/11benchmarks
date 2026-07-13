import { loadCV } from "@/lib/cv"
import { Inline } from "@/lib/cv/markdown"
import { DownloadButton } from "./components/download-button"
import type { Entry } from "@/lib/cv"

export default async function CVPage() {
  const cv = await loadCV()
  const { name, title, summary, meta } = cv.profile

  return (
    <div className="min-h-screen bg-white">
      <div className="cv-container">
        <header className="cv-header border-b border-slate-200 pb-8 mb-8">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-lora font-semibold text-slate-900 mb-2">
                {name}
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 font-medium">
                {title}
              </p>
            </div>
            <DownloadButton />
          </div>

          {summary.length > 0 && (
            <div className="prose prose-sm max-w-none space-y-3 text-slate-700 mb-6">
              {summary.map((para, i) => (
                <p key={i}>
                  <Inline text={para} />
                </p>
              ))}
            </div>
          )}

          {Object.keys(meta).length > 0 && (
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              {meta.location && <span>{meta.location}</span>}
              {meta.email && (
                <a href={`mailto:${meta.email}`} className="hover:text-slate-900">
                  {meta.email}
                </a>
              )}
              {meta.website && (
                <a
                  href={meta.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900"
                >
                  {meta.website.replace(/^https?:\/\//, "")}
                </a>
              )}
              {meta.github && (
                <a
                  href={`https://github.com/${meta.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900"
                >
                  github.com/{meta.github}
                </a>
              )}
              {meta.linkedin && (
                <a
                  href={`https://linkedin.com/in/${meta.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-slate-900"
                >
                  linkedin.com/in/{meta.linkedin}
                </a>
              )}
            </div>
          )}
        </header>

        <div className="space-y-8">
          {cv.experience.length > 0 && (
            <section className="cv-section">
              <h2 className="cv-section-title text-2xl font-lora font-semibold text-slate-900 mb-6">
                Experience
              </h2>
              <div className="space-y-6">
                {cv.experience.map((entry, idx) => (
                  <EntryComponent key={idx} entry={entry} />
                ))}
              </div>
            </section>
          )}

          {cv.education.length > 0 && (
            <section className="cv-section">
              <h2 className="cv-section-title text-2xl font-lora font-bold text-slate-900 mb-6">
                Education
              </h2>
              <div className="space-y-6">
                {cv.education.map((entry, idx) => (
                  <EntryComponent key={idx} entry={entry} />
                ))}
              </div>
            </section>
          )}

          {cv.projects.length > 0 && (
            <section className="cv-section">
              <h2 className="cv-section-title text-2xl font-lora font-bold text-slate-900 mb-6">
                Projects
              </h2>
              <div className="space-y-6">
                {cv.projects.map((entry, idx) => (
                  <EntryComponent key={idx} entry={entry} />
                ))}
              </div>
            </section>
          )}

          {cv.skills.length > 0 && (
            <section className="cv-section">
              <h2 className="cv-section-title text-2xl font-lora font-bold text-slate-900 mb-6">
                Skills
              </h2>
              <div className="space-y-4">
                {cv.skills.map((group, idx) => (
                  <div key={idx}>
                    <h3 className="font-semibold text-slate-900 mb-2">
                      {group.name}
                    </h3>
                    <p className="text-slate-700 text-sm leading-relaxed">
                      {group.items.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

function EntryComponent({ entry }: { entry: Entry }) {
  return (
    <div className="cv-entry">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
        <h3 className="cv-entry-title text-lg font-semibold text-slate-900">
          {entry.heading}
        </h3>
        {entry.meta.period && (
          <span className="text-sm text-slate-600 font-medium flex-shrink-0">
            {entry.meta.period}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2 sm:gap-4 text-sm text-slate-600 mb-3">
        {entry.meta.company && <span>{entry.meta.company}</span>}
        {entry.meta.school && <span>{entry.meta.school}</span>}
        {entry.meta.location && <span>{entry.meta.location}</span>}
        {entry.meta.url && (
          <a
            href={entry.meta.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-slate-900"
          >
            {entry.meta.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </a>
        )}
      </div>

      {entry.paragraphs.length > 0 && (
        <div className="prose prose-sm max-w-none mb-3 text-slate-700">
          {entry.paragraphs.map((para, i) => (
            <p key={i} className="mb-2">
              <Inline text={para} />
            </p>
          ))}
        </div>
      )}

      {entry.bullets.length > 0 && (
        <ul className="space-y-1 text-slate-700 text-sm">
          {entry.bullets.map((bullet, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-slate-400 flex-shrink-0">•</span>
              <span>
                <Inline text={bullet} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
