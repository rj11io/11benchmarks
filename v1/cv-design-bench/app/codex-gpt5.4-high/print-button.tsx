"use client"

import { Printer } from "lucide-react"

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full border border-[color:var(--cv-line)] bg-[color:var(--cv-paper)] px-4 py-2 font-[family-name:var(--font-cv-mono)] text-[11px] font-medium tracking-[0.18em] text-[color:var(--cv-ink)] uppercase shadow-sm transition-colors duration-200 hover:border-[color:var(--cv-accent)] hover:bg-[color:var(--cv-panel)] print:hidden"
    >
      <Printer className="size-3.5" aria-hidden />
      Download PDF
    </button>
  )
}
