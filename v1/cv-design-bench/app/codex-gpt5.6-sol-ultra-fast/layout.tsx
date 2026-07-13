import type { Metadata } from "next"
import { Instrument_Serif, Libre_Franklin } from "next/font/google"

import { loadCV } from "@/lib/cv"

const sans = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-cv-sans",
  display: "swap",
})

const display = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cv-display",
  display: "swap",
})

export function generateMetadata(): Metadata {
  const { profile } = loadCV()
  const title =
    [profile.name, profile.title].filter(Boolean).join(" — ") ||
    "Curriculum Vitae"

  return {
    title,
    description: profile.summary[0] || profile.title || title,
  }
}

export default function CVLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${sans.variable} ${display.variable}`}>{children}</div>
  )
}
