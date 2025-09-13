"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Calendar, MapPin, Clock, Flag, RefreshCw, AlertCircle, X } from "lucide-react"
import { useSessions } from "@/hooks/use-sessions"

function getSessionTypeColor(sessionType: string) {
  switch (sessionType.toLowerCase()) {
    case "race":
      return "bg-red-100 text-red-800 border-red-200"
    case "qualifying":
      return "bg-blue-100 text-blue-800 border-blue-200"
    case "practice":
      return "bg-green-100 text-green-800 border-green-200"
    case "sprint":
      return "bg-purple-100 text-purple-800 border-purple-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
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
  const { sessions, loading, error, refetch } = useSessions()
  const [searchTerm, setSearchTerm] = useState("")
  const [sessionTypeFilter, setSessionTypeFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState("all")

  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch =
        session.session_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.country_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.circuit_short_name?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSessionType = sessionTypeFilter === "all" || session.session_type.toLowerCase() === sessionTypeFilter

      const matchesYear = yearFilter === "all" || session.year.toString() === yearFilter

      const matchesCountry = countryFilter === "all" || session.country_name === countryFilter

      return matchesSearch && matchesSessionType && matchesYear && matchesCountry
    })
  }, [sessions, searchTerm, sessionTypeFilter, yearFilter, countryFilter])

  const uniqueYears = useMemo(
    () => Array.from(new Set(sessions.map((session) => session.year))).sort((a, b) => b - a),
    [sessions],
  )

  const uniqueCountries = useMemo(
    () => Array.from(new Set(sessions.map((session) => session.country_name))).sort(),
    [sessions],
  )

  const clearFilters = () => {
    setSearchTerm("")
    setSessionTypeFilter("all")
    setYearFilter("all")
    setCountryFilter("all")
  }

  const hasActiveFilters = searchTerm || sessionTypeFilter !== "all" || yearFilter !== "all" || countryFilter !== "all"

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Error Loading Sessions
          </CardTitle>
          <CardDescription>Failed to fetch data from OpenF1 API</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refetch} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Race Sessions
              {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
            </CardTitle>
            <CardDescription>Historical Formula 1 race sessions from OpenF1 API</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {filteredSessions.length} of {sessions.length} sessions
            </Badge>
            <Button onClick={refetch} variant="ghost" size="sm" disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search sessions, locations, countries, circuits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>

            <div className="flex gap-2">
              <Select value={sessionTypeFilter} onValueChange={setSessionTypeFilter} disabled={loading}>
                <SelectTrigger className="w-40">
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
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {uniqueYears.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={countryFilter} onValueChange={setCountryFilter} disabled={loading}>
                <SelectTrigger className="w-40">
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

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary" className="text-xs">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {sessionTypeFilter !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Type: {sessionTypeFilter}
                  <button
                    onClick={() => setSessionTypeFilter("all")}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {yearFilter !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Year: {yearFilter}
                  <button
                    onClick={() => setYearFilter("all")}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {countryFilter !== "all" && (
                <Badge variant="secondary" className="text-xs">
                  Country: {countryFilter}
                  <button
                    onClick={() => setCountryFilter("all")}
                    className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-6">
                Clear all
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Session</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
                      <p className="text-muted-foreground">Loading sessions from OpenF1 API...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredSessions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Calendar className="w-8 h-8" />
                      <p>No sessions found matching your criteria</p>
                      {hasActiveFilters && (
                        <Button variant="outline" size="sm" onClick={clearFilters}>
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSessions.map((session) => (
                  <TableRow key={session.session_key} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{session.session_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getSessionTypeColor(session.session_type)}>
                        {session.session_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{session.location}</div>
                          <div className="text-sm text-muted-foreground">{session.country_name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {formatDate(session.date_start)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {formatTime(session.date_start)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {Math.round(
                          (new Date(session.date_end).getTime() - new Date(session.date_start).getTime()) / (1000 * 60),
                        )}{" "}
                        min
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Flag className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* API Integration Status */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-dashed">
          <div className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${loading ? "bg-yellow-500 animate-pulse" : error ? "bg-red-500" : "bg-green-500"}`}
            />
            <div>
              <p className="text-sm font-medium">
                {loading ? "Loading..." : error ? "API Error" : "Connected to OpenF1 API"}
              </p>
              <p className="text-xs text-muted-foreground">
                {loading
                  ? "Fetching latest Formula 1 session data..."
                  : error
                    ? "Unable to connect to OpenF1 API. Please try again."
                    : `Displaying ${sessions.length} sessions from OpenF1.org`}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default RaceSessionsTable
