import type { Metadata } from "next"
import Link from "next/link"
import { Geist_Mono, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import "./globals.css"
import { GitHubIcon } from "@/components/site/github-icon"
import { ThemeToggle } from "@/components/site/theme-toggle"
import { ThemeProvider } from "@/components/theme-provider"
import { formatTokens, getRepoMeta, getTotals } from "@/lib/bench"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "11bench — benchmarks for coding agents",
    template: "%s · 11bench",
  },
  description:
    "AI benchmark experiments that give many coding agents the exact same product and design task, then measure what each one built and what it cost.",
  metadataBase: new URL("https://bench.rj11.io"),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const meta = getRepoMeta()
  const totals = getTotals()

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body className="flex min-h-svh flex-col">
        <ThemeProvider>
          <header className="sticky top-0 z-10 border-b border-border/60 bg-background/80 backdrop-blur">
            <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-4 px-4 sm:px-6">
              <Link
                href="/"
                className="font-mono text-sm font-semibold tracking-tight text-foreground"
              >
                11bench
              </Link>
              {meta.version ? (
                <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                  v{meta.version}
                </span>
              ) : null}
              <nav className="ml-auto flex items-center gap-1">
                <a
                  href={meta.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub repository"
                  className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <GitHubIcon className="size-4" />
                </a>
                <ThemeToggle />
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-border/60">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:px-6">
              <p className="font-mono text-xs">
                11bench · {totals.benchmarks}{" "}
                {totals.benchmarks === 1 ? "benchmark" : "benchmarks"} ·{" "}
                {`${totals.runs} registered runs`} ·{" "}
                {formatTokens(totals.tokens)} tokens
              </p>
              <div className="flex gap-4 font-mono text-xs sm:ml-auto">
                <a
                  href={meta.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 hover:text-foreground hover:underline"
                >
                  GitHub
                </a>
                <a
                  href={`${meta.githubUrl}/blob/main/CHANGELOG.md`}
                  target="_blank"
                  rel="noreferrer"
                  className="underline-offset-4 hover:text-foreground hover:underline"
                >
                  Changelog
                </a>
              </div>
            </div>
          </footer>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
