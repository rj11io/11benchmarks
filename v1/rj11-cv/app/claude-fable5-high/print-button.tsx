"use client"

import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"

export function PrintButton() {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => window.print()}
      className="h-8 gap-1.5 rounded-full px-3.5 text-xs font-normal text-muted-foreground shadow-none hover:text-foreground"
    >
      <Download className="size-3.5" aria-hidden />
      Download PDF
    </Button>
  )
}
