"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { NotebookPen, ChartArea, Menu, MessageCircle, User } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

// Navigation items with icons
const navItems = [
  {
    name: "Activity Tracker",
    href: "/",
    icon: NotebookPen,
  },
  {
    name: "Reflections",
    href: "/reflections",
    icon: MessageCircle,
  },
  {
    name: "Insights",
    href: "/insights",
    icon: ChartArea,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
]

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <div className={cn("hidden lg:block", className)} {...props}>
      <div className="relative h-full w-full border-r bg-background">
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/" className="flex items-center font-semibold">
            <span className="text-xl">😃 Good Time Tracker</span>
          </Link>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="px-3 py-4">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

export function MobileSidebar() {
  const pathname = usePathname()
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center font-semibold">
            <span className="text-xl">MyDashboard</span>
          </Link>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="px-3 py-4">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
