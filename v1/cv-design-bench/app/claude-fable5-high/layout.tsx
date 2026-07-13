import type { Metadata } from "next"
import { Newsreader } from "next/font/google"

import { loadCV } from "@/lib/cv"

const serif = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-serif-cv",
})

// Strip the inline markdown allowed in content files so metadata reads clean.
function plain(text: string) {
  return text
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
}

export function generateMetadata(): Metadata {
  const { profile } = loadCV()
  const title = `${[profile.name, profile.title].filter(Boolean).join(": ")} CV`
  return {
    title: title || "CV",
    description: profile.summary[0] ? plain(profile.summary[0]) : undefined,
  }
}

export default function CVLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={serif.variable}>{children}</div>
}
