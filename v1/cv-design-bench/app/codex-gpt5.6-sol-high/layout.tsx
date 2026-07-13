import type { Metadata } from "next"
import { Newsreader, Space_Grotesk } from "next/font/google"

import { loadCV } from "@/lib/cv"

const sans = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-cv-sans",
  display: "swap",
})

const serif = Newsreader({
  subsets: ["latin"],
  variable: "--font-cv-serif",
  display: "swap",
})

export function generateMetadata(): Metadata {
  const { profile } = loadCV()

  return {
    title: [profile.name, profile.title].filter(Boolean).join(" — "),
    description: profile.summary[0] || profile.title,
  }
}

export default function CVLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${sans.variable} ${serif.variable}`}>{children}</div>
}
