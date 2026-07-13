import type { Metadata } from "next"
import { DM_Sans, DM_Serif_Display, IBM_Plex_Mono } from "next/font/google"

import { loadCV } from "@/lib/cv"

import styles from "./cv.module.css"

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--cv-sans",
  display: "swap",
})

const display = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--cv-display",
  weight: "400",
  display: "swap",
})

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--cv-mono",
  weight: ["400", "500", "600"],
  display: "swap",
})

export function generateMetadata(): Metadata {
  const { profile } = loadCV()
  const title = [profile.name, profile.title].filter(Boolean).join(" — ") || "CV"

  return {
    title,
    description: profile.summary[0] ?? profile.title,
    robots: { index: false, follow: false },
  }
}

export default function RunLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${styles.page} ${sans.variable} ${display.variable} ${mono.variable}`}
    >
      {children}
    </div>
  )
}
