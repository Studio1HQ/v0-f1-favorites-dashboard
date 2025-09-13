"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Calendar, MapPin, Clock, Heart, Trash2, AlertCircle, X } from "lucide-react"
import { useFavorites } from "@/hooks/use-favorites"
import { DashboardLayout } from "@/components/dashboard-layout"

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

function formatAddedDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function FavoritesPage() {
  const { favorites, loading, removeFromFavorites, clearAllFavorites } = useFavorites()
  const [searchTerm, setSearchTerm] = useState("")
  const [sessionTypeFilter, setSessionTypeFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState("all")

  const filteredFavorites = useMemo(() => {
    return favorites.filter((session) => {
      const matchesSearch =
        session.session_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.country_name.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesSessionType = sessionTypeFilter === "all" || session.session_type.toLowerCase() === sessionTypeFilter
      const matchesYear = yearFilter === "all" || session.year.toString() === yearFilter
      const matchesCountry = countryFilter === "all" || session.country_name === countryFilter

      return matchesSearch && matchesSessionType && matchesYear && matchesCountry
    })
  }, [favorites, searchTerm, sessionTypeFilter, yearFilter, countryFilter])

  const uniqueYears = useMemo(
    () => Array.from(new Set(favorites.map((session) => session.year))).sort((a, b) => b - a),
    [favorites],
  )

  const uniqueCountries = useMemo(
    () => Array.from(new Set(favorites.map((session) => session.country_name))).sort(),
    [favorites],
  )

  const clearFilters = () => {
    setSearchTerm("")
    setSessionTypeFilter("all")
    setYearFilter("all")
    setCountryFilter("all")
  }

  const hasActiveFilters = searchTerm || sessionTypeFilter !== "all" || yearFilter !== "all" || countryFilter !== "all"

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading favorites...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Favorite Sessions</h1>
            <p className="text-muted-foreground text-pretty">Your saved Formula 1 race sessions for quick access</p>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <Heart className="w-5 h-5 text-red-600 dark:text-red-400 fill-current" />
                  </div>
                  My Favorites
                </CardTitle>
                <CardDescription className="text-base">
                  {favorites.length} sessions saved to your favorites
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {filteredFavorites.length} of {favorites.length} favorites
                </Badge>
                {favorites.length > 0 && (
                  <Button
                    onClick={clearAllFavorites}
                    variant="outline"
                    size="sm"
                    className="h-9 text-destructive hover:text-destructive bg-transparent"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            {favorites.length > 0 && (
              <div className="space-y-6 pt-6 border-t">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search favorite sessions, locations, countries..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-10"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Select value={sessionTypeFilter} onValueChange={setSessionTypeFilter}>
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

                    <Select value={yearFilter} onValueChange={setYearFilter}>
                      <SelectTrigger className="w-36 h-10">
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

                    <Select value={countryFilter} onValueChange={setCountryFilter}>
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
                      {yearFilter !== "all" && (
                        <Badge variant="secondary" className="text-sm px-3 py-1">
                          Year: {yearFilter}
                          <button
                            onClick={() => setYearFilter("all")}
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
            )}
          </CardHeader>

          <CardContent className="pt-0">
            {favorites.length === 0 ? (
              <div className="text-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-muted/50 rounded-full">
                    <Heart className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">No favorite sessions yet</p>
                    <p className="text-sm text-muted-foreground">
                      Start adding sessions to your favorites from the Race Sessions page
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[120px] font-semibold">Session</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Location</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Time</TableHead>
                      <TableHead className="font-semibold">Added</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFavorites.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-16">
                          <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-muted/50 rounded-full">
                              <AlertCircle className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <div className="space-y-2">
                              <p className="font-medium">No favorites match your filters</p>
                              <p className="text-sm text-muted-foreground">Try adjusting your search criteria</p>
                            </div>
                            {hasActiveFilters && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                                className="mt-2 bg-transparent"
                              >
                                Clear filters
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFavorites
                        .sort((a, b) => new Date(b.added_at).getTime() - new Date(a.added_at).getTime())
                        .map((session) => (
                          <TableRow key={session.session_key} className="hover:bg-muted/30 transition-colors">
                            <TableCell className="font-medium py-4">{session.session_name}</TableCell>
                            <TableCell className="py-4">
                              <Badge
                                variant="outline"
                                className={`${getSessionTypeColor(session.session_type)} font-medium`}
                              >
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
                              <div className="text-sm text-muted-foreground">{formatAddedDate(session.added_at)}</div>
                            </TableCell>
                            <TableCell className="text-right py-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromFavorites(session.session_key)}
                                className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {favorites.length > 0 && (
              <div className="mt-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 rounded-xl border border-dashed border-red-200 dark:border-red-800">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
                    <div>
                      <p className="font-medium">Favorites Saved Locally</p>
                      <p className="text-sm text-muted-foreground">
                        Your {favorites.length} favorite sessions are stored in your browser and will persist across
                        visits
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
