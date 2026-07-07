import type { Metadata } from "next"
import { IBM_Plex_Mono, Source_Serif_4 } from "next/font/google"

import { loadCV } from "@/lib/cv"
import { cn } from "@/lib/utils"

import "./print.module.css"

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-cv-serif",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
})

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-cv-mono",
  weight: ["400", "500"],
  display: "swap",
})

export function generateMetadata(): Metadata {
  const { profile } = loadCV()
  const name = profile.name || "CV"
  return {
    title: profile.title ? `${name} — ${profile.title}` : name,
    description: profile.summary[0],
  }
}

export default function RunLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={cn(
        serif.variable,
        mono.variable,
        "min-h-svh w-full bg-white text-stone-900 print:min-h-0",
      )}
      style={{ fontFamily: "var(--font-cv-serif)" }}
    >
      {children}
    </div>
  )
}
