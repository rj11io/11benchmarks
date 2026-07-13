"use client"

import { Download } from "lucide-react"

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="group inline-flex h-10 items-center gap-2 rounded-full border border-[#1c2427]/20 bg-white px-4 font-[family-name:var(--cv-mono)] text-[10px] font-medium tracking-[0.12em] text-[#1c2427] uppercase shadow-sm transition hover:border-[#e04b32] hover:text-[#c43c27] dark:border-white/20 dark:bg-[#1d2628] dark:text-[#f4f0e8] dark:hover:border-[#ff8a70] dark:hover:text-[#ffb3a2] print:hidden"
    >
      <Download aria-hidden className="size-3.5 transition-transform group-hover:translate-y-0.5" />
      Download PDF
    </button>
  )
}
