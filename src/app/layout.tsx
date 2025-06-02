import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarNav, MobileSidebar } from "@/components/sidebar-nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Good Time Tracker",
  description: "Track and monitor your daily activities and engagement levels",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background lg:hidden">
              <MobileSidebar />
              <div className="flex-1">
                <h1 className="text-lg font-semibold">Good Time Tracker</h1>
              </div>
            </header>
            <div className="flex flex-1 max-w-screen">
              <SidebarNav />
              <main className="flex-1 p-6 lg:ml-64 w-full">{children}</main>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
