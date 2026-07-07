import type { Metadata } from "next"
import { Lora } from "next/font/google"
import "./styles.css"

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-lora",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Ricardo Jorge — Product Engineer",
  description: "CV of Ricardo Jorge, a product engineer focused on frontend, dashboards, and data visualization.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={lora.variable}>
      <body className="bg-white text-slate-900">{children}</body>
    </html>
  )
}
