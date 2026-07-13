import type { Metadata } from "next"
import { Newsreader } from "next/font/google"

import { loadCV } from "@/lib/cv"

import styles from "./cv.module.css"

const serif = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cv-serif",
  style: ["normal", "italic"],
})

function plain(text: string) {
  return text
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\s+/g, " ")
    .trim()
}

export function generateMetadata(): Metadata {
  const { profile } = loadCV()
  const titleParts = [profile.name, profile.title].filter(Boolean)
  return {
    title: titleParts.length > 0 ? titleParts.join(" - ") : "CV",
    description: profile.summary[0] ? plain(profile.summary[0]) : undefined,
    robots: { index: false, follow: false },
  }
}

export default function CVLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${serif.variable} ${styles.page} min-h-svh bg-background text-foreground`}>
      {children}
    </div>
  )
}
