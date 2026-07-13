"use client"

import { Printer } from "lucide-react"

import { Button } from "@/components/ui/button"

export function PrintButton({ className }: { className?: string }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={() => window.print()}
    >
      <Printer aria-hidden />
      Download PDF
    </Button>
  )
}
