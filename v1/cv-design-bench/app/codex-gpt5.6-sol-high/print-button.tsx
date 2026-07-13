"use client"

import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"

export function PrintButton() {
  return (
    <Button
      type="button"
      size="lg"
      onClick={() => window.print()}
      className="h-11 rounded-full bg-[#f2c14e] px-5 font-[family-name:var(--font-cv-sans)] text-[13px] font-semibold tracking-[-0.01em] text-[#102c2b] shadow-none hover:bg-[#ffcf5e] print:hidden"
    >
      <Download className="size-4" aria-hidden="true" />
      Download PDF
    </Button>
  )
}
