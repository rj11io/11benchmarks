import type { Metadata } from "next"
import { DM_Mono, DM_Sans, Source_Serif_4 } from "next/font/google"

import { loadCV } from "@/lib/cv"

import styles from "./print.module.css"

const display = Source_Serif_4({
  subsets: ["latin"],
  variable: "--cv-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
})

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--cv-sans",
  display: "swap",
})

const mono = DM_Mono({
  subsets: ["latin"],
  variable: "--cv-mono",
  weight: ["400", "500"],
  display: "swap",
})

export function generateMetadata(): Metadata {
  const { profile } = loadCV()

  return {
    title: profile.title ? `${profile.name} — ${profile.title}` : profile.name,
    description: profile.summary[0] ?? profile.title,
  }
}

export default function CVLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      className={`${styles.printRoot} ${display.variable} ${sans.variable} ${mono.variable} min-h-svh bg-[#f1efe9] font-[family-name:var(--cv-sans)] text-[#1c2427] antialiased dark:bg-[#151c1d] dark:text-[#f4f0e8] print:min-h-0 print:bg-white print:text-black`}
    >
      {children}
    </div>
  )
}
