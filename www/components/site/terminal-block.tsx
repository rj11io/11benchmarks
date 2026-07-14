import { CopyButton } from "@/components/site/copy-button"
import { cn } from "@/lib/utils"

/**
 * Terminal-styled command block: window dots, `$`-prefixed lines, and a
 * copy button that copies the raw commands without the prompt.
 */
export function TerminalBlock({
  lines,
  className,
}: {
  lines: string[]
  className?: string
}) {
  return (
    <div
      className={cn(
        "border-border bg-card overflow-hidden rounded-lg border text-left shadow-sm",
        className,
      )}
    >
      <div className="border-border bg-muted/50 flex items-center gap-2 border-b px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <CopyButton value={lines.join("\n")} className="ml-auto" />
      </div>
      <div className="overflow-x-auto px-4 py-3.5 font-mono text-[13px] leading-relaxed">
        {lines.map((line, index) => (
          <div key={index} className="whitespace-pre">
            <span className="text-muted-foreground select-none">$ </span>
            <span className="text-foreground">{line}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
