"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Calendar, MapPin, Clock, Flag, RefreshCw, AlertCircle, X, Heart } from "lucide-react"
import { useSessions } from "@/hooks/use-sessions"
import { useFavorites } from "@/hooks/use-favorites" // Added favorites hook

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
    <Card className="shadow-sm">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              Race Sessions
              {loading && <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />}
            </CardTitle>
            <CardDescription className="text-base">Historical Formula 1 race sessions from OpenF1 API</CardDescription>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              {filteredSessions.length} of {sessions.length} sessions
            </Badge>
            <Button onClick={refetch} variant="ghost" size="sm" disabled={loading} className="h-9">
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        <div className="space-y-6 pt-6 border-t">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search sessions, locations, countries, circuits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
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
            <div className="flex items-center gap-3 flex-wrap p-4 bg-muted/30 rounded-lg border border-dashed">
              <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
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
      </CardHeader>

      <CardContent className="pt-0">
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[120px] font-semibold">Session</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Date</TableHead>
                <TableHead className="font-semibold">Time</TableHead>
                <TableHead className="font-semibold">Duration</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-primary/10 rounded-full">
                        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">Loading sessions...</p>
                        <p className="text-sm text-muted-foreground">Fetching data from OpenF1 API</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredSessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-muted/50 rounded-full">
                        <Calendar className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium">No sessions found</p>
                        <p className="text-sm text-muted-foreground">
                          {hasActiveFilters ? "Try adjusting your filters" : "No data available"}
                        </p>
                      </div>
                      {hasActiveFilters && (
                        <Button variant="outline" size="sm" onClick={clearFilters} className="mt-2 bg-transparent">
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSessions.map((session) => (
                  <TableRow key={session.session_key} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-medium py-4">{session.session_name}</TableCell>
                    <TableCell className="py-4">
                      <Badge variant="outline" className={`${getSessionTypeColor(session.session_type)} font-medium`}>
                        {session.session_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-medium truncate">{session.location}</div>
                          <div className="text-sm text-muted-foreground truncate">{session.country_name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{formatDate(session.date_start)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-sm">{formatTime(session.date_start)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-muted-foreground font-medium">
                        {Math.round(
                          (new Date(session.date_end).getTime() - new Date(session.date_start).getTime()) / (1000 * 60),
                        )}{" "}
                        min
                      </div>
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFavoriteToggle(session)}
                          className={`h-8 ${
                            isFavorite(session.session_key)
                              ? "text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isFavorite(session.session_key) ? "fill-current" : ""}`} />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8">
                          <Flag className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-muted/30 to-muted/10 rounded-xl border border-dashed">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  loading ? "bg-amber-500 animate-pulse" : error ? "bg-red-500" : "bg-green-500"
                } shadow-sm`}
              />
              <div>
                <p className="font-medium">
                  {loading ? "Loading..." : error ? "API Error" : "Connected to OpenF1 API"}
                </p>
                <p className="text-sm text-muted-foreground">
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
      </CardContent>
    </Card>
  )
}

export default RaceSessionsTable
