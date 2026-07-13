// Server-side loader: reads content/*.md and returns typed CV data.
// Uses node:fs, so call it from server components only.

import fs from "node:fs"
import path from "node:path"

import { parseDoc } from "./parse"
import type { Block, CV, Entry, Profile, Section, SkillGroup } from "./types"

const CONTENT_DIR = path.join(process.cwd(), "content")

function readDoc(name: string) {
  const file = path.join(CONTENT_DIR, name)
  if (!fs.existsSync(file)) return null
  return parseDoc(fs.readFileSync(file, "utf-8"))
}

function paragraphs(blocks: Block[]): string[] {
  return blocks
    .filter((b) => b.type === "paragraph")
    .map((b) => b.text)
}

function bullets(blocks: Block[]): string[] {
  return blocks
    .filter((b) => b.type === "bullets")
    .flatMap((b) => b.items)
}

function toEntry(section: Section): Entry {
  return {
    heading: section.heading,
    meta: section.meta,
    paragraphs: paragraphs(section.blocks),
    bullets: bullets(section.blocks),
  }
}

function loadEntries(name: string): Entry[] {
  return readDoc(name)?.sections.map(toEntry) ?? []
}

function loadProfile(): Profile {
  const doc = readDoc("profile.md")
  const { name = "", title = "", ...meta } = doc?.frontmatter ?? {}
  return {
    name,
    title,
    summary: doc ? paragraphs(doc.lead) : [],
    meta,
  }
}

function loadSkills(): SkillGroup[] {
  const doc = readDoc("skills.md")
  if (!doc) return []
  return doc.sections.map((section) => {
    // Items come from bullets, or from comma-separated paragraph lines.
    const fromBullets = bullets(section.blocks)
    const fromText = paragraphs(section.blocks)
      .flatMap((text) => text.split(","))
      .map((item) => item.trim())
      .filter(Boolean)
    return { name: section.heading, items: [...fromBullets, ...fromText] }
  })
}

/** Load the full CV from content/. Missing files come back as empty sections. */
export function loadCV(): CV {
  return {
    profile: loadProfile(),
    experience: loadEntries("experience.md"),
    education: loadEntries("education.md"),
    projects: loadEntries("projects.md"),
    skills: loadSkills(),
  }
}
