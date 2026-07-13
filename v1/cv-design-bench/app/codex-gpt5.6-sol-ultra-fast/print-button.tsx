"use client"

import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"

export function PrintButton() {
  return (
    <Button
      type="button"
      size="lg"
      onClick={() => window.print()}
      className="h-10 rounded-full bg-[#214fd4] px-4 text-[0.72rem] font-semibold tracking-[0.08em] text-white uppercase shadow-[0_8px_24px_rgba(33,79,212,0.22)] hover:bg-[#183da9] focus-visible:ring-[#214fd4]/30 sm:h-11 sm:px-5 print:hidden"
    >
      <Download aria-hidden="true" />
      Download PDF
    </Button>
  )
}
