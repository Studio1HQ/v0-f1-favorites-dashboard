"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Calendar, MapPin, Clock, Flag, RefreshCw, AlertCircle, X, Heart, MessageSquare } from "lucide-react"
import { CountryFlag } from "@/utils/country-flags"
import { useSessions } from "@/hooks/use-sessions"
import { useFavorites } from "@/hooks/use-favorites" // Added favorites hook
import { useUser } from "@/contexts/user-context"
import { useVeltClient } from '@veltdev/react'
import { useTheme } from "next-themes"
import dynamic from 'next/dynamic'
import { useEffect } from 'react'

// Dynamic imports for Velt components to prevent SSR issues
const VeltComments = dynamic(
  () => import('@veltdev/react').then((mod) => ({ default: mod.VeltComments })),
  { ssr: false }
)

const VeltCommentTool = dynamic(
  () => import('@veltdev/react').then((mod) => ({ default: mod.VeltCommentTool })),
  { ssr: false }
)

function getSessionTypeColor(sessionType: string) {
  switch (sessionType.toLowerCase()) {
    case "race":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800"
    case "qualifying":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800"
    case "practice":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800"
    case "sprint":
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800"
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export function RaceSessionsTable() {
  const [yearFilter, setYearFilter] = useState("2025")
  const { sessions, loading, error, refetch } = useSessions(Number.parseInt(yearFilter)) // Pass year to hook
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites() // Added favorites functionality
  const [searchTerm, setSearchTerm] = useState("")
  const [sessionTypeFilter, setSessionTypeFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState("all")

  const { users } = useUser()
  const { client } = useVeltClient()
  const { theme, systemTheme } = useTheme()

  // Determine if current theme is dark
  const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark')

  // Configure comment mentions to only show our two users
  useEffect(() => {
    if (client) {
      // Configure mentions to only show the two F1 users
      const contactList = users.map(user => ({
        userId: user.userId,
        name: user.name,
        email: user.email,
        photoUrl: user.avatar
      }))

      // Update contact list to restrict to our two users
      client.updateContactList(contactList)
    }
  }, [client, users])

  // Configure dark mode for comments using API
  useEffect(() => {
    if (client) {
      const commentElement = client.getCommentElement()
      if (commentElement) {
        if (isDarkMode) {
          commentElement.enableDarkMode()
        } else {
          commentElement.disableDarkMode()
        }
      }
    }
  }, [client, isDarkMode])

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch =
        session.session_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.country_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.circuit_short_name?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSessionType = sessionTypeFilter === "all" || session.session_type.toLowerCase() === sessionTypeFilter

      const matchesCountry = countryFilter === "all" || session.country_name === countryFilter

      return matchesSearch && matchesSessionType && matchesCountry
    })
  }, [sessions, searchTerm, sessionTypeFilter, countryFilter])

  const allowedYears = [2025, 2024, 2023]
  const uniqueYears = useMemo(
    () => allowedYears.filter((year) => sessions.some((session) => session.year === year)),
    [sessions],
  )

  const uniqueCountries = useMemo(
    () => Array.from(new Set(sessions.map((session) => session.country_name))).sort(),
    [sessions],
  )

  const clearFilters = () => {
    setSearchTerm("")
    setSessionTypeFilter("all")
    setCountryFilter("all")
  }

  const hasActiveFilters = searchTerm || sessionTypeFilter !== "all" || countryFilter !== "all"

  const handleFavoriteToggle = (session: any) => {
    if (isFavorite(session.session_key)) {
      removeFromFavorites(session.session_key)
    } else {
      addToFavorites(session)
    }
  }

  if (error) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Error Loading Sessions
          </CardTitle>
          <CardDescription>Failed to fetch data from OpenF1 API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <AlertCircle className="mx-auto w-16 h-16 text-muted-foreground/50 mb-6" />
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">{error}</p>
            <Button onClick={refetch} variant="outline" size="lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="bg-transparent">
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-slate-700 dark:bg-slate-800 px-4 py-2 rounded-lg border border-slate-600 dark:border-slate-700">
              <span className="text-slate-100 dark:text-slate-300 text-sm font-medium">All</span>
            </div>
            {loading && <RefreshCw className="w-4 h-4 animate-spin text-slate-600 dark:text-slate-500" />}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-slate-600 dark:text-slate-500 text-sm">
              {filteredSessions.length} of {sessions.length} sessions
            </div>
            <Button onClick={refetch} variant="ghost" size="sm" disabled={loading} className="h-8 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400" />
              <Input
                placeholder="Search sessions, locations, countries, circuits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
                disabled={loading}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Select value={sessionTypeFilter} onValueChange={setSessionTypeFilter} disabled={loading}>
                <SelectTrigger className="w-44 h-10">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Session Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="race">Race</SelectItem>
                  <SelectItem value="qualifying">Qualifying</SelectItem>
                  <SelectItem value="practice">Practice</SelectItem>
                  <SelectItem value="sprint">Sprint</SelectItem>
                </SelectContent>
              </Select>

              <Select value={yearFilter} onValueChange={setYearFilter} disabled={loading}>
                <SelectTrigger className="w-36 h-10">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {allowedYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={countryFilter} onValueChange={setCountryFilter} disabled={loading}>
                <SelectTrigger className="w-44 h-10">
                  <SelectValue placeholder="Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {uniqueCountries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-3 flex-wrap p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-600 border-dashed">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-400">Active filters:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {searchTerm && (
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-2 hover:bg-secondary-foreground/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {sessionTypeFilter !== "all" && (
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    Type: {sessionTypeFilter}
                    <button
                      onClick={() => setSessionTypeFilter("all")}
                      className="ml-2 hover:bg-secondary-foreground/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {countryFilter !== "all" && (
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    Country: {countryFilter}
                    <button
                      onClick={() => setCountryFilter("all")}
                      className="ml-2 hover:bg-secondary-foreground/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm h-8 ml-auto">
                Clear all
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden">
        <div className="bg-slate-700 dark:bg-slate-900 border-y border-slate-500 dark:border-slate-700">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-500 dark:border-slate-700 hover:bg-transparent">
                <TableHead className="text-slate-100 dark:text-slate-300 font-bold text-xs uppercase tracking-wider py-4 px-6">GRAND PRIX</TableHead>
                <TableHead className="text-slate-100 dark:text-slate-300 font-bold text-xs uppercase tracking-wider py-4">DATE</TableHead>
                <TableHead className="text-slate-100 dark:text-slate-300 font-bold text-xs uppercase tracking-wider py-4">WINNER</TableHead>
                <TableHead className="text-slate-100 dark:text-slate-300 font-bold text-xs uppercase tracking-wider py-4">TEAM</TableHead>
                <TableHead className="text-slate-100 dark:text-slate-300 font-bold text-xs uppercase tracking-wider py-4">LAPS</TableHead>
                <TableHead className="text-slate-100 dark:text-slate-300 font-bold text-xs uppercase tracking-wider py-4">TIME</TableHead>
                <TableHead className="text-slate-100 dark:text-slate-300 font-bold text-xs uppercase tracking-wider py-4 text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-slate-700 dark:bg-slate-900">
              {loading ? (
                <TableRow className="border-b border-slate-600 dark:border-slate-800 hover:bg-slate-600/50 dark:hover:bg-slate-800/50">
                  <TableCell colSpan={7} className="text-center py-16">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-red-900/20 rounded-full">
                        <RefreshCw className="w-8 h-8 animate-spin text-red-400" />
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium text-white">Loading sessions...</p>
                        <p className="text-sm text-slate-300 dark:text-slate-400">Fetching data from OpenF1 API</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredSessions.length === 0 ? (
                <TableRow className="border-b border-slate-600 dark:border-slate-800 hover:bg-slate-600/50 dark:hover:bg-slate-800/50">
                  <TableCell colSpan={7} className="text-center py-16">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-slate-700 dark:bg-slate-800 rounded-full">
                        <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-400" />
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium text-white">No sessions found</p>
                        <p className="text-sm text-slate-300 dark:text-slate-400">
                          {hasActiveFilters ? "Try adjusting your filters" : "No data available"}
                        </p>
                      </div>
                      {hasActiveFilters && (
                        <Button variant="outline" size="sm" onClick={clearFilters} className="mt-2 bg-transparent border-slate-500 dark:border-slate-600 text-slate-200 dark:text-slate-300 hover:bg-slate-700 dark:hover:bg-slate-800">
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSessions.map((session, index) => (
                  <TableRow key={session.session_key} className="border-b border-slate-600 dark:border-slate-800 hover:bg-slate-600/50 dark:hover:bg-slate-800/50 transition-colors">
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <CountryFlag
                          countryName={session.country_name || session.location}
                          className="w-6 h-4 rounded-sm overflow-hidden shadow-sm"
                          title={session.country_name || session.location}
                        />
                        <span className="text-white font-medium">{session.country_name || session.location}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-slate-100 dark:text-slate-300">
                      {formatDate(session.date_start).replace(/,/, '')}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">W</span>
                        </div>
                        <span className="text-orange-200 dark:text-orange-400 font-medium">
                          {session.session_type === 'Race' ? 'Winner TBD' : `${session.session_type} Session`}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">T</span>
                        </div>
                        <span className="text-orange-200 dark:text-orange-400 font-medium">
                          {session.session_type === 'Race' ? 'Team TBD' : session.session_type}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-slate-100 dark:text-slate-300">
                      {session.session_type === 'Race' ? '57' : '--'}
                    </TableCell>
                    <TableCell className="py-4 text-slate-200 dark:text-slate-300 font-mono text-sm">
                      {session.session_type === 'Race' ? '1:42:06.304' : formatTime(session.date_start)}
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFavoriteToggle(session)}
                          className={`h-8 ${
                            isFavorite(session.session_key)
                              ? "text-red-400 hover:text-red-300"
                              : "text-slate-200 dark:text-slate-400 hover:text-white dark:hover:text-slate-200"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isFavorite(session.session_key) ? "fill-current" : ""}`} />
                        </Button>
                        <VeltCommentTool
                          targetElementId={`session-${session.session_key}`}
                          darkMode={isDarkMode}
                        >
                          <Button variant="ghost" size="sm" className="h-8 text-slate-200 dark:text-slate-400 hover:text-white dark:hover:text-slate-200">
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </VeltCommentTool>
                        <Button variant="ghost" size="sm" className="h-8 text-slate-300 dark:text-slate-400 hover:text-slate-100 dark:hover:text-slate-200">
                          <Flag className="w-4 h-4 mr-1" />
                          <span className="text-xs">Details</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Velt Comments Container */}
        <VeltComments
          darkMode={isDarkMode}
          dialogDarkMode={isDarkMode}
          pinDarkMode={isDarkMode}
        />

        <div className="px-6 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  loading ? "bg-amber-500 animate-pulse" : error ? "bg-red-500" : "bg-green-500"
                } shadow-sm`}
              />
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">
                  {loading ? "Loading..." : error ? "API Error" : "Connected to OpenF1 API"}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {loading
                    ? "Fetching latest Formula 1 session data..."
                    : error
                      ? "Unable to connect to OpenF1 API. Please try again."
                      : `Displaying ${sessions.length} sessions from OpenF1.org • Years: 2023-2025`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RaceSessionsTable
