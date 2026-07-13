"use client"

import { Printer } from "lucide-react"

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-stone-300 bg-white px-4 py-2 font-[family-name:var(--font-cv-mono)] text-[11px] font-medium tracking-wide text-stone-600 uppercase transition-colors hover:border-stone-400 hover:bg-stone-50 hover:text-stone-900 print:hidden"
    >
      <Printer className="size-3.5" aria-hidden />
      Download PDF
    </button>
  )
}
