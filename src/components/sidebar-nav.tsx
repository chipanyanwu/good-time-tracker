"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ClipboardList,
  AreaChartIcon as ChartArea,
  Menu,
  BookOpen,
  Smile,
  PlusCircle,
  LogOut,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Sheet,
  SheetTitle,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Navigation items with icons
const navItems = [
  {
    name: "Activity Tracker",
    href: "/",
    icon: ClipboardList,
  },
  {
    name: "Reflections",
    href: "/reflections",
    icon: BookOpen,
  },
  {
    name: "Insights",
    href: "/insights",
    icon: ChartArea,
  },
  // {
  //   name: "Profile",
  //   href: "/profile",
  //   icon: User,
  // },
]

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function SidebarNav({ className, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log("Logging out...")
  }

  return (
    <div className={cn("hidden lg:block", className)} {...props}>
      <div className="fixed left-0 top-0 h-screen w-64 border-r bg-background flex flex-col">
        <div className="flex h-16 items-center border-b px-4">
          <Link href="/" className="flex items-center font-semibold">
            <span className="text-xl flex flex-row gap-2.5 items-center">
              <Smile /> Good Time Tracker
            </span>
          </Link>
        </div>

        <ScrollArea className="flex-1">
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

        <div className="border-t px-3 pt-4 flex flex-col gap-1">
          {/* New Entry Button */}
          <Link href="/tracker">
            <Button className="w-full flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              New Entry
            </Button>
          </Link>

          {/* Profile Tile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full flex items-center gap-3 p-3 h-auto justify-start hover:bg-muted"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="/placeholder.svg?height=32&width=32"
                    alt="User"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm">
                  <span className="font-medium">John Doe</span>
                  <span className="text-muted-foreground text-xs">
                    john@example.com
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export function MobileSidebar() {
  const pathname = usePathname()

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log("Logging out...")
  }

  return (
    <Sheet>
      <SheetTitle></SheetTitle>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <div className="flex flex-col h-full">
          <div className="flex h-16 items-center border-b px-4">
            <Link href="/" className="flex items-center font-semibold">
              <span className="text-xl flex flex-row gap-2.5 items-center">
                <Smile /> Good Time Tracker
              </span>
            </Link>
          </div>

          <ScrollArea className="flex-1">
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

          <div className="border-t p-3 space-y-3">
            {/* New Entry Button */}
            <Link href="/tracker">
              <Button className="w-full flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                New Entry
              </Button>
            </Link>

            {/* Profile Tile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full flex items-center gap-3 p-3 h-auto justify-start hover:bg-muted"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                    />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start text-sm">
                    <span className="font-medium">John Doe</span>
                    <span className="text-muted-foreground text-xs">
                      john@example.com
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
