"use client"

import { Printer } from "lucide-react"

import { Button } from "@/components/ui/button"

export function PrintButton() {
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={() => window.print()}
      className="h-10 rounded-none border-[#2f5f55]/30 bg-white/80 px-4 font-[family-name:var(--cv-mono)] text-[11px] font-medium tracking-[0.12em] text-[#2f5f55] uppercase shadow-none backdrop-blur transition hover:border-[#2f5f55] hover:bg-white hover:text-[#203f39] dark:border-[#d7eadf]/25 dark:bg-[#1d1c1a]/80 dark:text-[#d7eadf] dark:hover:bg-[#26231f] print:hidden"
    >
      <Printer aria-hidden className="size-4" />
      Download PDF
    </Button>
  )
}
