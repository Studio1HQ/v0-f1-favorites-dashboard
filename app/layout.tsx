import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { VeltWrapper } from "@/components/velt-wrapper"
import { UserProviderWrapper } from "@/components/user-provider-wrapper"
import "./globals.css"

export const metadata: Metadata = {
  title: "F1 Favorites - Formula 1 Historical Data Dashboard",
  description: "A collaborative dashboard for exploring Formula 1 historical race data",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <VeltWrapper>
          <UserProviderWrapper>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <Suspense fallback={null}>{children}</Suspense>
            </ThemeProvider>
          </UserProviderWrapper>
        </VeltWrapper>
        <Analytics />
      </body>
    </html>
  )
}
