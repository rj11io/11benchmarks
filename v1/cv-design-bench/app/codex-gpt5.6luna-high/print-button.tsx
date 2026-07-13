"use client"

import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"

export function PrintButton() {
  return (
    <Button
      type="button"
      onClick={() => window.print()}
      variant="outline"
      className="h-10 rounded-full border-[#c55432]/35 bg-transparent px-4 font-[family-name:var(--cv-mono)] text-[10px] font-medium tracking-[0.12em] text-[#a44025] uppercase shadow-none transition hover:border-[#c55432] hover:bg-[#c55432] hover:text-white print:hidden dark:border-[#e5b7a8]/45 dark:text-[#efc2b2] dark:hover:bg-[#c55432]"
    >
      <Download aria-hidden className="size-3.5" />
      Download PDF
    </Button>
  )
}
