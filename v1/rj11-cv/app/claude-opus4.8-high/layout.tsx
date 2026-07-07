import type { Metadata } from "next"
import { Newsreader } from "next/font/google"

import { loadCV } from "@/lib/cv"

import styles from "./cv.module.css"

// Display serif for the name and other large type. Body text and the
// monospaced metadata inherit --font-sans / --font-mono from the root layout.
const serif = Newsreader({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  style: ["normal", "italic"],
})

export function generateMetadata(): Metadata {
  const { profile } = loadCV()
  const name = profile.name || "Curriculum Vitae"
  const title = profile.title ? `${name} — ${profile.title}` : name
  const description =
    profile.summary[0]?.replace(/[*`[\]]|\(https?:[^)]+\)/g, "").trim() ||
    `${name} · CV`

  return {
    title,
    description,
    robots: { index: false, follow: false },
  }
}

export default function CVLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`${serif.variable} ${styles.page} min-h-svh bg-background`}>
      {children}
    </div>
  )
}
