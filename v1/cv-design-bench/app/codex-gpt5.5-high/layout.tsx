import type { Metadata } from "next"
import { IBM_Plex_Mono, Inter, Source_Serif_4 } from "next/font/google"

import { loadCV } from "@/lib/cv"
import { cn } from "@/lib/utils"

import styles from "./print.module.css"

const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--cv-serif",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
})

const sans = Inter({
  subsets: ["latin"],
  variable: "--cv-sans",
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
  const name = profile.name || "CV"

  return {
    title: profile.title ? `${name} | ${profile.title}` : name,
    description: profile.summary[0] ?? profile.title,
  }
}

export default function RunLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={cn(
        styles.printRoot,
        serif.variable,
        sans.variable,
        mono.variable,
        "min-h-svh bg-[#f7f4ee] text-[#171513] antialiased dark:bg-[#151514] dark:text-[#f7f4ee] print:min-h-0 print:bg-white print:text-black",
      )}
    >
      {children}
    </div>
  )
}
