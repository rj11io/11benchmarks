import type { Metadata } from "next"
import { Fraunces } from "next/font/google"

import { cv } from "./content"

// Editorial display serif, scoped to this route only. It is exposed as
// --font-display and consumed by cv.module.css; the root layout and
// globals.css are left untouched.
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  title: `${cv.name} — ${cv.title}`,
  description: `${cv.name}, ${cv.title} based in ${cv.location}. ${cv.summary[0]}`,
}

export default function CvLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={display.variable}>{children}</div>
}
