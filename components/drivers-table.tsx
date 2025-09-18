"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, RefreshCw, AlertCircle, X, MessageSquare, Users } from "lucide-react"
import { CountryFlag } from "@/utils/country-flags"
import { useDrivers } from "@/hooks/use-drivers"
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

const VeltCommentBubble = dynamic(
  () => import('@veltdev/react').then((mod) => ({ default: mod.VeltCommentBubble })),
  { ssr: false }
)

function getTeamColor(teamColour: string) {
  return `#${teamColour}`
}

export function DriversTable() {
  const { drivers, loading, error, refetch } = useDrivers()
  const [searchTerm, setSearchTerm] = useState("")
  const [teamFilter, setTeamFilter] = useState("all")
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

  const filteredDrivers = useMemo(() => {
    return drivers.filter((driver) => {
      const matchesSearch =
        (driver.full_name && driver.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (driver.broadcast_name && driver.broadcast_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (driver.team_name && driver.team_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (driver.name_acronym && driver.name_acronym.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (driver.first_name && driver.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (driver.last_name && driver.last_name.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesTeam = teamFilter === "all" || driver.team_name === teamFilter

      const matchesCountry = countryFilter === "all" || driver.country_code === countryFilter

      return matchesSearch && matchesTeam && matchesCountry
    })
  }, [drivers, searchTerm, teamFilter, countryFilter])

  const uniqueTeams = useMemo(
    () => Array.from(new Set(drivers.map((driver) => driver.team_name).filter(Boolean))).sort(),
    [drivers],
  )

  const uniqueCountries = useMemo(
    () => Array.from(new Set(drivers.map((driver) => driver.country_code).filter(Boolean))).sort(),
    [drivers],
  )

  const clearFilters = () => {
    setSearchTerm("")
    setTeamFilter("all")
    setCountryFilter("all")
  }

  const hasActiveFilters = searchTerm || teamFilter !== "all" || countryFilter !== "all"

  if (error) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Error Loading Drivers
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
              {filteredDrivers.length} of {drivers.length} drivers
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
                placeholder="Search drivers, teams, names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
                disabled={loading}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Select value={teamFilter} onValueChange={setTeamFilter} disabled={loading}>
                <SelectTrigger className="w-44 h-10">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teams</SelectItem>
                  {uniqueTeams.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
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
                {teamFilter !== "all" && (
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    Team: {teamFilter}
                    <button
                      onClick={() => setTeamFilter("all")}
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
        <div className="bg-slate-100 dark:bg-slate-900 border-y border-slate-300 dark:border-slate-700">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-300 dark:border-slate-700 hover:bg-transparent">
                <TableHead className="text-slate-800 dark:text-slate-300 font-bold text-xs uppercase tracking-wider py-4 px-6">DRIVER</TableHead>
                <TableHead className="text-slate-800 dark:text-slate-300 font-bold text-xs uppercase tracking-wider py-4">NUMBER</TableHead>
                <TableHead className="text-slate-800 dark:text-slate-300 font-bold text-xs uppercase tracking-wider py-4">TEAM</TableHead>
                <TableHead className="text-slate-800 dark:text-slate-300 font-bold text-xs uppercase tracking-wider py-4">ACRONYM</TableHead>
                <TableHead className="text-slate-800 dark:text-slate-300 font-bold text-xs uppercase tracking-wider py-4 text-right">ACTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white dark:bg-slate-900">
              {loading ? (
                <TableRow className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <TableCell colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-red-900/20 rounded-full">
                        <RefreshCw className="w-8 h-8 animate-spin text-red-400" />
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium text-slate-900 dark:text-white">Loading drivers...</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Fetching data from OpenF1 API</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredDrivers.length === 0 ? (
                <TableRow className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <TableCell colSpan={5} className="text-center py-16">
                    <div className="flex flex-col items-center gap-4">
                      <div className="p-4 bg-slate-200 dark:bg-slate-800 rounded-full">
                        <Users className="w-8 h-8 text-slate-300 dark:text-slate-400" />
                      </div>
                      <div className="space-y-2">
                        <p className="font-medium text-slate-900 dark:text-white">No drivers found</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
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
                filteredDrivers.map((driver) => (
                  <TableRow
                    key={`${driver.driver_number}-${driver.session_key}`}
                    id={`driver-row-${driver.driver_number}-${driver.session_key}`}
                    className="border-b border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {driver.headshot_url ? (
                            <>
                              <img
                                src={driver.headshot_url}
                                alt={driver.full_name || driver.broadcast_name || 'Driver'}
                                className="w-10 h-10 rounded-full object-cover border-2"
                                style={{ borderColor: getTeamColor(driver.team_colour || 'FF0000') }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const fallback = target.nextElementSibling as HTMLElement;
                                  if (fallback) fallback.classList.remove('hidden');
                                }}
                              />
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm hidden"
                                style={{ backgroundColor: getTeamColor(driver.team_colour || 'FF0000') }}
                              >
                                {driver.name_acronym || driver.driver_number}
                              </div>
                            </>
                          ) : (
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                              style={{ backgroundColor: getTeamColor(driver.team_colour || 'FF0000') }}
                            >
                              {driver.name_acronym || driver.driver_number}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">{driver.full_name || driver.broadcast_name || 'Unknown Driver'}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">{driver.broadcast_name || driver.full_name || `Driver #${driver.driver_number}`}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm"
                        style={{ backgroundColor: getTeamColor(driver.team_colour || 'FF0000') }}
                      >
                        {driver.driver_number || '?'}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getTeamColor(driver.team_colour || 'FF0000') }}
                        />
                        <span className="text-slate-900 dark:text-slate-300 font-medium">{driver.team_name || 'Unknown Team'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-slate-900 dark:text-slate-300 font-mono text-sm font-bold">
                      {driver.name_acronym || `#${driver.driver_number}`}
                    </TableCell>
                    <TableCell className="text-right py-4">
                      <div className="flex items-center justify-end gap-2">
                        <div className="relative">
                          <VeltCommentTool
                            targetElementId={`driver-row-${driver.driver_number}-${driver.session_key}`}
                            darkMode={isDarkMode}
                          >
                            <Button variant="ghost" size="sm" className="h-8 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200">
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </VeltCommentTool>
                          <VeltCommentBubble
                            targetElementId={`driver-row-${driver.driver_number}-${driver.session_key}`}
                            darkMode={isDarkMode}
                          />
                        </div>
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
          textMode={false}
          popoverMode={true}
          popoverTriangleComponent={false}
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
                    ? "Fetching latest Formula 1 driver data..."
                    : error
                      ? "Unable to connect to OpenF1 API. Please try again."
                      : `Displaying ${drivers.length} drivers from OpenF1.org`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DriversTable