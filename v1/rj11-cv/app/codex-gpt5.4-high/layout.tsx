import type { Metadata } from "next"
import { Cormorant_Garamond, IBM_Plex_Mono, Manrope } from "next/font/google"

import { loadCV } from "@/lib/cv"

import styles from "./cv.module.css"

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cv-serif",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
})

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-cv-sans",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
})

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-cv-mono",
  weight: ["400", "500"],
  display: "swap",
})

const cv = loadCV()
const title = cv.profile.name
  ? cv.profile.title
    ? `${cv.profile.name} - ${cv.profile.title}`
    : cv.profile.name
  : "CV"
const description =
  cv.profile.summary[0]
    ?.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*`]/g, "")
    .trim() || "Personal CV"

export const metadata: Metadata = {
  title,
  description,
  robots: {
    index: false,
    follow: false,
  },
}

export default function RunLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${styles.routeShell} ${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      {children}
    </div>
  )
}
