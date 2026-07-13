// Shared types for the CV content loader. Benchmark runs consume these —
// they must not edit this file.

export type Block =
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }

/** One `## Heading` block inside a content file. */
export type Section = {
  heading: string
  /** `key: value` lines directly under the heading (company, period, url, ...). */
  meta: Record<string, string>
  blocks: Block[]
}

/** A parsed markdown file: frontmatter + lead body + `##` sections. */
export type Doc = {
  frontmatter: Record<string, string>
  /** Body content that appears before the first `##` heading. */
  lead: Block[]
  sections: Section[]
}

export type Profile = {
  name: string
  title: string
  /** Summary paragraphs, in order. May contain inline markdown. */
  summary: string[]
  /** Everything else from the frontmatter: location, email, website, github, ... */
  meta: Record<string, string>
}

/** One experience / education / project entry. */
export type Entry = {
  /** The `##` heading: role, degree, or project name. */
  heading: string
  /** Extra fields: company, school, period, location, url, ... */
  meta: Record<string, string>
  /** Description paragraphs. May contain inline markdown. */
  paragraphs: string[]
  /** Highlight bullets. May contain inline markdown. */
  bullets: string[]
}

export type SkillGroup = {
  name: string
  items: string[]
}

export type CV = {
  profile: Profile
  experience: Entry[]
  education: Entry[]
  projects: Entry[]
  skills: SkillGroup[]
}
