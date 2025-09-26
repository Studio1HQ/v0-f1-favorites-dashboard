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

export function FavoritesContent() {
  const { favorites, loading, removeFromFavorites, clearAllFavorites } = useFavorites()
  const [searchTerm, setSearchTerm] = useState("")
  const [sessionTypeFilter, setSessionTypeFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [countryFilter, setCountryFilter] = useState("all")
  const isDarkMode = theme === 'dark' || (theme === 'system' && systemTheme === 'dark')

  // Define a type for session if not already defined
  type Session = {
    session_key: string
    session_name: string
    session_type: string
    location: string
    country_name: string
    year: number
    date_start: string
    added_at: string
    // add other fields as needed
  }

  const filteredFavorites = useMemo(() => {
    const favoritesArray = (favorites ?? []) as Session[]
    return favoritesArray.filter((session) => {
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
    () => Array.from(new Set(favorites.map((session: any) => session.year))).sort((a, b) => b - a),
    [favorites],
  )

  const uniqueCountries = useMemo(
    () => Array.from(new Set(favorites.map((session: any) => session.country_name))).sort(),
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading collaborative favorites...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Page header matching F1 style */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight" style={{color: isDarkMode ? 'white' : 'black'}}>2025 RACE RESULTS</h1>
            <p className="text-gray-400 mt-2">Collaborative favorites from your team</p>
          </div>
        </div>

      <Card className="bg-gray-900/50 border-gray-800 shadow-lg">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-3 text-xl text-white">
                <div className="p-2 bg-red-600/20 rounded-lg">
                  <Heart className="w-5 h-5 text-red-500 fill-current" />
                </div>
                Team Favorites
              </CardTitle>
              <CardDescription className="text-base text-gray-400">
                {favorites.length} sessions favorited by the team
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm px-3 py-1 bg-gray-800 text-gray-300 border-gray-700">
                {filteredFavorites.length} of {favorites.length} favorites
              </Badge>
              {favorites.length > 0 && (
                <Button
                  onClick={clearAllFavorites}
                  variant="outline"
                  size="sm"
                  className="h-9 text-red-400 hover:text-red-300 bg-transparent border-gray-700 hover:border-red-500"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {favorites?.length > 0 && (
            <div className="space-y-6 pt-6 border-t border-gray-800">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search favorite sessions, locations, countries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ backgroundColor: '#1A1A1A', borderColor: '#333333', color: '#FFFFFF' }}
                    className="pl-10 h-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="flex flex-wrap gap-3" style={{color: isDarkMode ? 'white' : 'black'}}>
                  <Select value={sessionTypeFilter} onValueChange={setSessionTypeFilter}>
                    <SelectTrigger className="w-44 h-10 bg-gray-800 border-gray-700" style={{color: isDarkMode ? 'white' : 'black'}}>
                      <Filter className="w-4 h-4 mr-2 text-gray-400" style={{color: isDarkMode ? 'white' : 'black'}} />
                      <SelectValue placeholder="Session Type" style={{color: isDarkMode ? 'white' : 'black'}} />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all" className="hover:bg-gray-700">All Types</SelectItem>
                      <SelectItem value="race" className="hover:bg-gray-700">Race</SelectItem>
                      <SelectItem value="qualifying" className="hover:bg-gray-700">Qualifying</SelectItem>
                      <SelectItem value="practice" className="hover:bg-gray-700">Practice</SelectItem>
                      <SelectItem value="sprint" className="hover:bg-gray-700">Sprint</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-36 h-10 bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all" className="text-white hover:bg-gray-700">All Years</SelectItem>
                      {uniqueYears.map((year) => (
                        <SelectItem key={year} value={year.toString()} className="text-white hover:bg-gray-700">
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={countryFilter} onValueChange={setCountryFilter}>
                    <SelectTrigger className="w-44 h-10 bg-gray-800 border-gray-700 text-white">
                      <SelectValue placeholder="Country" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="all" className="text-white hover:bg-gray-700">All Countries</SelectItem>
                      {uniqueCountries.map((country) => (
                        <SelectItem key={country} value={country} className="text-white hover:bg-gray-700">
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex items-center gap-3 flex-wrap p-4 bg-gray-800/30 rounded-lg border border-dashed border-gray-700">
                  <span className="text-sm font-medium text-gray-400">Active filters:</span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {searchTerm && (
                      <Badge variant="secondary" className="text-sm px-3 py-1 bg-gray-700 text-gray-300 border-gray-600">
                        Search: "{searchTerm}"
                        <button
                          onClick={() => setSearchTerm("")}
                          className="ml-2 hover:bg-gray-600 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {sessionTypeFilter !== "all" && (
                      <Badge variant="secondary" className="text-sm px-3 py-1 bg-gray-700 text-gray-300 border-gray-600">
                        Type: {sessionTypeFilter}
                        <button
                          onClick={() => setSessionTypeFilter("all")}
                          className="ml-2 hover:bg-gray-600 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {yearFilter !== "all" && (
                      <Badge variant="secondary" className="text-sm px-3 py-1 bg-gray-700 text-gray-300 border-gray-600">
                        Year: {yearFilter}
                        <button
                          onClick={() => setYearFilter("all")}
                          className="ml-2 hover:bg-gray-600 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                    {countryFilter !== "all" && (
                      <Badge variant="secondary" className="text-sm px-3 py-1 bg-gray-700 text-gray-300 border-gray-600">
                        Country: {countryFilter}
                        <button
                          onClick={() => setCountryFilter("all")}
                          className="ml-2 hover:bg-gray-600 rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm h-8 ml-auto text-gray-400 hover:text-white">
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
                <div className="p-4 bg-gray-800/50 rounded-full">
                  <Heart className="w-8 h-8 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <p className="font-medium text-white">No team favorites yet</p>
                  <p className="text-sm text-gray-400">
                    Start adding sessions to favorites from the Race Sessions page to share with your team
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-gray-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-800/50 border-gray-800">
                    <TableHead className="w-[120px] font-semibold text-gray-300 border-gray-800">GRAND PRIX</TableHead>
                    <TableHead className="font-semibold text-gray-300 border-gray-800">DATE</TableHead>
                    <TableHead className="font-semibold text-gray-300 border-gray-800">WINNER</TableHead>
                    <TableHead className="font-semibold text-gray-300 border-gray-800">TEAM</TableHead>
                    <TableHead className="font-semibold text-gray-300 border-gray-800">LAPS</TableHead>
                    <TableHead className="font-semibold text-gray-300 border-gray-800">TIME</TableHead>
                    <TableHead className="text-right font-semibold text-gray-300 border-gray-800">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFavorites.length === 0 ? (
                    <TableRow className="border-gray-800">
                      <TableCell colSpan={7} className="text-center py-16 border-gray-800">
                        <div className="flex flex-col items-center gap-4">
                          <div className="p-4 bg-gray-800/50 rounded-full">
                            <AlertCircle className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="space-y-2">
                            <p className="font-medium text-white">No favorites match your filters</p>
                            <p className="text-sm text-gray-400">Try adjusting your search criteria</p>
                          </div>
                          {hasActiveFilters && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={clearFilters}
                              className="mt-2 bg-transparent border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
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
                        <TableRow key={session.session_key} className="hover:bg-gray-800/30 transition-colors border-gray-800">
                          <TableCell className="font-medium py-4 text-white border-gray-800 flex items-center gap-3">
                            <div className="w-8 h-5 bg-gradient-to-r from-blue-500 to-red-500 rounded-sm flex-shrink-0"></div>
                            {session.location}
                          </TableCell>
                          <TableCell className="py-4 text-gray-300 border-gray-800">{formatDate(session.date_start)}</TableCell>
                          <TableCell className="py-4 text-white border-gray-800 flex items-center gap-3">
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              #
                            </div>
                            <span className="font-medium">{session.session_name}</span>
                          </TableCell>
                          <TableCell className="py-4 text-white border-gray-800 flex items-center gap-3">
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              M
                            </div>
                            <span>{session.session_type}</span>
                          </TableCell>
                          <TableCell className="py-4 text-gray-300 border-gray-800">
                            <span className="font-mono">57</span>
                          </TableCell>
                          <TableCell className="py-4 text-gray-300 border-gray-800">
                            <span className="font-mono">{formatTime(session.date_start)}</span>
                          </TableCell>
                          <TableCell className="text-right py-4 border-gray-800">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromFavorites(session.session_key)}
                              className="h-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
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
            <div className="mt-8 p-6 bg-gradient-to-r from-red-950/20 to-gray-900/50 rounded-xl border border-dashed border-red-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm" />
                  <div>
                    <p className="font-medium text-white">Live Collaborative Favorites</p>
                    <p className="text-sm text-gray-400">
                      Your {favorites.length} favorite sessions are synced in real-time with your team using Velt
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  )
}