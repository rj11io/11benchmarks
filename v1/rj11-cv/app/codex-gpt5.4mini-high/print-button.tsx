"use client"

import { Download } from "lucide-react"

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/90 px-4 py-2 text-[0.72rem] font-medium tracking-[0.22em] uppercase text-foreground transition hover:-translate-y-px hover:border-foreground/20 hover:bg-background print:hidden"
    >
      <Download className="size-3.5" aria-hidden />
      Download PDF
    </button>
  )
}
