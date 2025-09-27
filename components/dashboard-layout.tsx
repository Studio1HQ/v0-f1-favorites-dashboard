"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, Calendar, Heart, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { UserSwitcher } from "@/components/user-switcher"
import { useTheme } from "next-themes"
import dynamic from 'next/dynamic'
import { VeltCommentsSidebar, VeltNotificationsTool, VeltSidebarButton } from "@veltdev/react"

const VeltPresence = dynamic(
  () => import('@veltdev/react').then((mod) => ({ default: mod.VeltPresence })),
  { ssr: false }
)

interface DashboardLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: "2025", href: "/", active: true },
  { name: "Races", href: "/", icon: Calendar },
  { name: "Drivers", href: "/drivers", icon: Users },
  { name: "Teams", href: "#", icon: Users },
  { name: "Awards", href: "#", icon: BarChart3 },
]

const topNavItems = [
  { name: "Schedule", href: "#" },
  { name: "Results", href: "/" },
  { name: "News", href: "#" },
  { name: "Drivers", href: "/drivers" },
  { name: "Teams", href: "#" },
  { name: "Fantasy & Gaming", href: "#" },
  { name: "F1 Members' Area", href: "#" },
]

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const { theme, systemTheme } = useTheme()

  // Determine if current theme is dark
  const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark')

  return (
    <div className="min-h-screen bg-black dark:bg-black bg-white text-black dark:text-white">
      {/* Velt sidebar */}
      <VeltCommentsSidebar darkMode={isDarkMode} />

      {/* F1 Style Header */}
      <header className="bg-black dark:bg-black bg-white border-b border-gray-800 dark:border-gray-800 border-gray-200">
        {/* Top navigation bar */}
        <div className="border-b border-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-12 text-sm">
              <div className="flex items-center space-x-6">
                {topNavItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "hover:text-red-500 transition-colors",
                      pathname === item.href ? "text-red-500 border-b-2 border-red-500" : "text-gray-300 dark:text-gray-300 text-gray-700"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-white dark:text-white text-black hover:text-red-500">
                  Sign In
                </Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* F1 Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="text-2xl font-bold text-red-500">
                🏎️ F1
              </div>
              <span className="text-lg font-semibold">Favorites</span>
            </Link>

            {/* Search and user controls */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  style={{ backgroundColor: isDarkMode ? '#1A1A1A' : '#F3F3F3', borderColor: isDarkMode ? '#333333' : '#CCCCCC', color: isDarkMode ? '#FFFFFF' : '#000000' }}
                  placeholder="Search races, drivers, teams..."
                  className="pl-10 pr-4 py-2 w-80 text-sm bg-gray-900 dark:bg-gray-900 bg-gray-100 border border-gray-700 dark:border-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-white dark:text-white text-black placeholder-gray-400 dark:placeholder-gray-400 placeholder-gray-500"
                />
              </div>

              <div className="flex items-center space-x-2">
                <VeltPresence flockMode={true} maxUsers={2} />
                <div className="ml-3">
                  <ThemeToggle />
                </div>
                <VeltNotificationsTool darkMode={isDarkMode} />
                <VeltSidebarButton darkMode={isDarkMode} />
                <UserSwitcher />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <div className="border-b border-gray-800 dark:border-gray-800 border-gray-200">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-8 h-12">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (item.name === "2025" && pathname === "/")
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                      isActive
                        ? "text-white dark:text-white text-black border-red-500"
                        : "text-gray-400 dark:text-gray-400 text-gray-600 border-transparent hover:text-white dark:hover:text-white hover:text-black hover:border-gray-600"
                    )}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.name}</span>
                  </Link>
                )
              })}

              {/* Favorites tab */}
              <Link
                href="/favorites"
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                  pathname === "/favorites"
                    ? "text-white dark:text-white text-black border-red-500"
                    : "text-gray-400 dark:text-gray-400 text-gray-600 border-transparent hover:text-white dark:hover:text-white hover:text-black hover:border-gray-600"
                )}
              >
                <Heart className="w-4 h-4" />
                <span>Favorites</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="min-h-screen bg-gray-950 dark:bg-gray-950 bg-gray-50 text-white dark:text-white text-black" style={{backgroundColor: isDarkMode ? '#121212' : '#FAFAFA'}}>
        {children}
      </main>

      {/* F1 Style Footer */}
      <footer className="bg-black dark:bg-black bg-white border-t border-gray-800 dark:border-gray-800 border-gray-200 text-white dark:text-white text-black">
        {/* Sponsors section */}
        <div className="border-b border-gray-800 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-8 items-center justify-items-center opacity-70">
              {/* Mock sponsor logos */}
              <div className="text-gray-400 dark:text-gray-400 text-gray-600 font-bold text-sm">ARAMCO</div>
              <div className="text-gray-400 dark:text-gray-400 text-gray-600 font-bold text-sm">DHL</div>
              <div className="text-gray-400 dark:text-gray-400 text-gray-600 font-bold text-sm">HEINEKEN</div>
              <div className="text-gray-400 dark:text-gray-400 text-gray-600 font-bold text-sm">PIRELLI</div>
              <div className="text-gray-400 dark:text-gray-400 text-gray-600 font-bold text-sm">AWS</div>
              <div className="text-gray-400 dark:text-gray-400 text-gray-600 font-bold text-sm">CRYPTO.COM</div>
              <div className="text-gray-400 dark:text-gray-400 text-gray-600 font-bold text-sm">MSC</div>
              <div className="text-gray-400 dark:text-gray-400 text-gray-600 font-bold text-sm">QATAR AIRWAYS</div>
              <div className="text-gray-400 dark:text-gray-400 text-gray-600 font-bold text-sm">TAG HEUER</div>
              <div className="text-gray-400 dark:text-gray-400 text-gray-600 font-bold text-sm">SANTANDER</div>
              <div className="text-gray-400 dark:text-gray-400 text-gray-600 font-bold text-sm">VELAS</div>
              <div className="text-gray-400 dark:text-gray-400 text-gray-600 font-bold text-sm">PUMA</div>
            </div>
          </div>
        </div>

        {/* Footer links */}
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Schedule</h3>
                <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-400 text-gray-600">
                  <li><Link href="#" className="hover:text-black dark:hover:text-white">Race Calendar</Link></li>
                  <li><Link href="#" className="hover:text-black dark:hover:text-white">Results</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Drivers</h3>
                <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-400 text-gray-600">
                  <li><Link href="#" className="hover:text-black dark:hover:text-white">Driver Standings</Link></li>
                  <li><Link href="#" className="hover:text-black dark:hover:text-white">Driver Info</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">News</h3>
                <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-400 text-gray-600">
                  <li><Link href="#" className="hover:text-black dark:hover:text-white">Latest News</Link></li>
                  <li><Link href="#" className="hover:text-black dark:hover:text-white">Tech Updates</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Teams</h3>
                <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-400 text-gray-600">
                  <li><Link href="#" className="hover:text-black dark:hover:text-white">Team Standings</Link></li>
                  <li><Link href="#" className="hover:text-black dark:hover:text-white">Team Info</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Fantasy & Gaming</h3>
                <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-400 text-gray-600">
                  <li><Link href="#" className="hover:text-black dark:hover:text-white">F1 Fantasy</Link></li>
                  <li><Link href="#" className="hover:text-black dark:hover:text-white">F1 Play</Link></li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">More</h3>
                <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-400 text-gray-600">
                  <li><Link href="#" className="hover:text-black dark:hover:text-white">Cookie Preferences</Link></li>
                  <li><Link href="#" className="hover:text-black dark:hover:text-white">Display Mode</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="border-t border-gray-800 dark:border-gray-800 border-gray-200 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between text-sm text-gray-400 dark:text-gray-400 text-gray-600">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="text-red-500 font-bold">🏎️ F1</div>
                </div>
                <div className="flex items-center space-x-4">
                  <Link href="#" className="hover:text-black dark:hover:text-white">Facebook</Link>
                  <Link href="#" className="hover:text-black dark:hover:text-white">Twitter</Link>
                  <Link href="#" className="hover:text-black dark:hover:text-white">Instagram</Link>
                  <Link href="#" className="hover:text-black dark:hover:text-white">YouTube</Link>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span>© 2003-2025 Formula One World Championship Limited</span>
                <Button variant="outline" size="sm" className="text-white dark:text-white text-black border-gray-600 dark:border-gray-600 border-gray-300 hover:border-gray-400">
                  Display mode
                </Button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
