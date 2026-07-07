// Renders the inline markdown allowed in content files: **bold**, *italic*,
// `code`, and [links](https://...). No nesting (e.g. bold inside a link).

import * as React from "react"

const TOKEN =
  /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g

const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)$/

export function Inline({
  text,
  linkClassName,
}: {
  text: string
  linkClassName?: string
}) {
  const parts = text.split(TOKEN)
  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return <code key={i}>{part.slice(1, -1)}</code>
        }
        if (part.startsWith("*") && part.endsWith("*")) {
          return <em key={i}>{part.slice(1, -1)}</em>
        }
        const link = part.match(LINK)
        if (link) {
          return (
            <a
              key={i}
              href={link[2]}
              className={linkClassName}
              target="_blank"
              rel="noreferrer"
            >
              {link[1]}
            </a>
          )
        }
        return <React.Fragment key={i}>{part}</React.Fragment>
      })}
    </>
  )
}
