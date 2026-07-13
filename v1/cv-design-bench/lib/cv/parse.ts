// Minimal markdown parser for the CV content format described in
// content/README.md. Deliberately small: frontmatter, `##` sections,
// per-section `key: value` meta lines, paragraphs, and `-` bullet lists.
// Inline formatting (bold, links) is left as-is in the text; render it
// with the <Inline> helper from lib/cv/markdown.

import type { Block, Doc, Section } from "./types"

const META_LINE = /^([A-Za-z][\w-]*):\s*(.+)$/

function parseFrontmatter(lines: string[]): {
  frontmatter: Record<string, string>
  rest: string[]
} {
  if (lines[0]?.trim() !== "---") {
    return { frontmatter: {}, rest: lines }
  }

  const frontmatter: Record<string, string> = {}
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      return { frontmatter, rest: lines.slice(i + 1) }
    }
    const match = lines[i].match(META_LINE)
    if (match) {
      frontmatter[match[1].toLowerCase()] = match[2].trim()
    }
  }

  // Unterminated frontmatter: treat the whole file as body.
  return { frontmatter: {}, rest: lines }
}

function parseBlocks(lines: string[]): Block[] {
  const blocks: Block[] = []
  let paragraph: string[] = []
  // True while the previous line belonged to a bullet, so an indented
  // wrapped line continues that bullet instead of starting a paragraph.
  let inBullet = false

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ type: "paragraph", text: paragraph.join(" ") })
      paragraph = []
    }
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed === "") {
      flushParagraph()
      inBullet = false
      continue
    }

    // `# File Title` lines are decoration for humans, not content.
    if (trimmed.startsWith("# ")) {
      flushParagraph()
      inBullet = false
      continue
    }

    if (trimmed.startsWith("- ")) {
      flushParagraph()
      const last = blocks[blocks.length - 1]
      const item = trimmed.slice(2).trim()
      if (last?.type === "bullets") {
        last.items.push(item)
      } else {
        blocks.push({ type: "bullets", items: [item] })
      }
      inBullet = true
      continue
    }

    if (inBullet && /^\s/.test(line)) {
      const last = blocks[blocks.length - 1]
      if (last?.type === "bullets") {
        last.items[last.items.length - 1] += ` ${trimmed}`
        continue
      }
    }

    inBullet = false
    paragraph.push(trimmed)
  }

  flushParagraph()
  return blocks
}

function parseSection(heading: string, lines: string[]): Section {
  // `key: value` lines directly under the heading are metadata. The meta
  // phase ends at the first blank or non-matching line, so a body paragraph
  // containing a colon is never swallowed.
  const meta: Record<string, string> = {}
  let bodyStart = 0

  for (const line of lines) {
    const match = line.trim() === "" ? null : line.match(META_LINE)
    if (!match) break
    meta[match[1].toLowerCase()] = match[2].trim()
    bodyStart++
  }

  return { heading, meta, blocks: parseBlocks(lines.slice(bodyStart)) }
}

export function parseDoc(source: string): Doc {
  const { frontmatter, rest } = parseFrontmatter(source.split(/\r?\n/))

  const leadLines: string[] = []
  const sections: { heading: string; lines: string[] }[] = []
  let current: { heading: string; lines: string[] } | null = null

  for (const line of rest) {
    const headingMatch = line.match(/^##\s+(.+)$/)
    if (headingMatch) {
      current = { heading: headingMatch[1].trim(), lines: [] }
      sections.push(current)
    } else if (current) {
      current.lines.push(line)
    } else {
      leadLines.push(line)
    }
  }

  return {
    frontmatter,
    lead: parseBlocks(leadLines),
    sections: sections.map((s) => parseSection(s.heading, s.lines)),
  }
}
