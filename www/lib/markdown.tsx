import * as React from "react"

/**
 * Minimal markdown renderer for the repo's own README files. Covers the
 * subset those files actually use — headings, paragraphs, lists, tables,
 * fenced code, blockquotes, links, and inline code/bold/italic. Anything
 * unrecognized falls back to a plain paragraph rather than breaking the
 * build.
 */

/**
 * Relative links in a README point at files next to it in the repo. The
 * site has no such routes, so resolve them against the benchmark's GitHub
 * URL instead; absolute links and #anchors pass through untouched.
 */
function resolveHref(href: string, linkBase?: string): string {
  if (!linkBase || /^(https?:|mailto:|#|\/)/.test(href)) return href
  return `${linkBase.replace(/\/$/, "")}/${href.replace(/^\.\//, "")}`
}

function renderInline(text: string, linkBase?: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = []
  // Order matters: code first so its contents are never re-parsed.
  // Bold uses a lazy `.+?` so it can wrap code spans that contain `*`
  // (e.g. **`content/*.md`**).
  const pattern = /(`[^`]+`)|(\*\*.+?\*\*)|(\*[^*]+\*)|(\[([^\]]+)\]\(([^)\s]+)\))|(https?:\/\/[^\s<>)]+)/g
  let lastIndex = 0
  let match: RegExpExecArray | null
  let key = 0

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index))
    }
    const token = match[0]
    if (token.startsWith("`")) {
      nodes.push(
        <code
          key={key++}
          className="bg-muted rounded px-1 py-0.5 font-mono text-[0.85em]"
        >
          {token.slice(1, -1)}
        </code>,
      )
    } else if (token.startsWith("**")) {
      nodes.push(
        <strong key={key++} className="text-foreground font-medium">
          {renderInline(token.slice(2, -2), linkBase)}
        </strong>,
      )
    } else if (token.startsWith("*")) {
      nodes.push(<em key={key++}>{renderInline(token.slice(1, -1), linkBase)}</em>)
    } else if (token.startsWith("[")) {
      const href = resolveHref(match[6], linkBase)
      nodes.push(
        <a
          key={key++}
          href={href}
          className="text-foreground underline underline-offset-4"
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noreferrer" : undefined}
        >
          {renderInline(match[5], linkBase)}
        </a>,
      )
    } else {
      nodes.push(
        <a
          key={key++}
          href={token}
          className="text-foreground underline underline-offset-4 break-all"
          target="_blank"
          rel="noreferrer"
        >
          {token}
        </a>,
      )
    }
    lastIndex = match.index + token.length
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }
  return nodes
}

function isTableDivider(line: string): boolean {
  return /^\|?[\s:-]+\|[\s|:-]*$/.test(line.trim()) && line.includes("-")
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim())
}

export function Markdown({
  source,
  linkBase,
}: {
  source: string
  /** Base URL (e.g. the benchmark's GitHub tree) for resolving relative links. */
  linkBase?: string
}) {
  const lines = source.split("\n")
  const blocks: React.ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed === "" || trimmed.startsWith("<!--")) {
      // Skip blanks and the HTML comments used for operator notes.
      while (i < lines.length && lines[i].trim().startsWith("<!--") && !lines[i].includes("-->")) i++
      i++
      continue
    }

    // Fenced code block
    if (trimmed.startsWith("```")) {
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code.push(lines[i])
        i++
      }
      i++ // closing fence
      blocks.push(
        <pre
          key={key++}
          className="bg-muted/50 border-border overflow-x-auto rounded-lg border p-4 font-mono text-[13px] leading-relaxed"
        >
          <code>{code.join("\n")}</code>
        </pre>,
      )
      continue
    }

    // Heading
    const heading = trimmed.match(/^(#{1,4}) (.+)$/)
    if (heading) {
      const level = heading[1].length
      const content = renderInline(heading[2], linkBase)
      const classes = [
        "scroll-mt-20 font-semibold tracking-tight text-foreground",
        level === 1 ? "text-2xl mt-2" : level === 2 ? "text-xl mt-8" : "text-base mt-6",
      ].join(" ")
      blocks.push(
        level === 1 ? (
          <h2 key={key++} className={classes}>{content}</h2>
        ) : level === 2 ? (
          <h3 key={key++} className={classes}>{content}</h3>
        ) : (
          <h4 key={key++} className={classes}>{content}</h4>
        ),
      )
      i++
      continue
    }

    // Table
    if (trimmed.startsWith("|") && i + 1 < lines.length && isTableDivider(lines[i + 1])) {
      const header = splitRow(lines[i])
      i += 2
      const rows: string[][] = []
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(splitRow(lines[i]))
        i++
      }
      blocks.push(
        <div key={key++} className="border-border overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border bg-muted/50 border-b">
                {header.map((cell, index) => (
                  <th key={index} className="text-foreground px-3 py-2 text-left font-medium">
                    {renderInline(cell, linkBase)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="border-border border-b last:border-0">
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="text-muted-foreground px-3 py-2 align-top">
                      {renderInline(cell, linkBase)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      )
      continue
    }

    // Blockquote
    if (trimmed.startsWith(">")) {
      const quote: string[] = []
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quote.push(lines[i].trim().replace(/^>\s?/, ""))
        i++
      }
      blocks.push(
        <blockquote
          key={key++}
          className="border-border text-muted-foreground border-l-2 pl-4 italic"
        >
          {renderInline(quote.join(" "), linkBase)}
        </blockquote>,
      )
      continue
    }

    // List (unordered or ordered; supports wrapped continuation lines)
    if (/^[-*] /.test(trimmed) || /^\d+\. /.test(trimmed)) {
      const ordered = /^\d+\. /.test(trimmed)
      const items: string[] = []
      while (i < lines.length) {
        const itemLine = lines[i]
        const itemTrimmed = itemLine.trim()
        if (/^[-*] /.test(itemTrimmed) || /^\d+\. /.test(itemTrimmed)) {
          items.push(itemTrimmed.replace(/^([-*]|\d+\.) /, ""))
          i++
        } else if (itemTrimmed !== "" && /^\s{2,}/.test(itemLine) && items.length > 0) {
          items[items.length - 1] += ` ${itemTrimmed}`
          i++
        } else {
          break
        }
      }
      const itemNodes = items.map((item, index) => (
        <li key={index} className="pl-1">
          {renderInline(item, linkBase)}
        </li>
      ))
      blocks.push(
        ordered ? (
          <ol key={key++} className="text-muted-foreground list-decimal space-y-1.5 pl-5">
            {itemNodes}
          </ol>
        ) : (
          <ul key={key++} className="text-muted-foreground list-disc space-y-1.5 pl-5">
            {itemNodes}
          </ul>
        ),
      )
      continue
    }

    // Paragraph: gather until a blank line or the start of another block.
    const paragraph: string[] = [trimmed]
    i++
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,4} |```|\||>|[-*] |\d+\. )/.test(lines[i].trim())
    ) {
      paragraph.push(lines[i].trim())
      i++
    }
    blocks.push(
      <p key={key++} className="text-muted-foreground leading-relaxed">
        {renderInline(paragraph.join(" "), linkBase)}
      </p>,
    )
  }

  return <div className="space-y-4">{blocks}</div>
}
