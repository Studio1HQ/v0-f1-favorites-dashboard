// OpenF1 API integration utilities
const OPENF1_BASE_URL = "https://api.openf1.org/v1"

export interface Session {
  session_key: number
  session_name: string
  date_start: string
  date_end: string
  gmt_offset: string
  session_type: string
  location: string
  country_name: string
  country_code: string
  circuit_key: number
  circuit_short_name: string
  meeting_key: number
  year: number
}

export interface Driver {
  driver_number: number
  broadcast_name: string
  full_name: string
  name_acronym: string
  team_name: string
  team_colour: string
  first_name: string
  last_name: string
  headshot_url: string
  country_code: string
  session_key: number
  meeting_key: number
}

export interface CarData {
  date: string
  driver_number: number
  meeting_key: number
  session_key: number
  speed: number
  throttle: number
  brake: number
  drs: number
  gear: number
  rpm: number
}

// Fetch sessions from OpenF1 API
export async function fetchSessions(params?: {
  year?: number
  session_name?: string
  country_name?: string
}): Promise<Session[]> {
  try {
    const searchParams = new URLSearchParams()

    if (params?.year) {
      searchParams.append("year", params.year.toString())
    }
    if (params?.session_name) {
      searchParams.append("session_name", params.session_name)
    }
    if (params?.country_name) {
      searchParams.append("country_name", params.country_name)
    }

    const url = `${OPENF1_BASE_URL}/sessions?${searchParams.toString()}`
    console.log("[v0] Fetching sessions from:", url)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Fetched sessions:", data.length, "sessions")

    return data
  } catch (error) {
    console.error("[v0] Error fetching sessions:", error)
    throw error
  }
}

// Fetch drivers from OpenF1 API
export async function fetchDrivers(params?: {
  session_key?: number
  driver_number?: number
  meeting_key?: number
}): Promise<Driver[]> {
  try {
    const searchParams = new URLSearchParams()

    if (params?.session_key) {
      searchParams.append("session_key", params.session_key.toString())
    }
    if (params?.driver_number) {
      searchParams.append("driver_number", params.driver_number.toString())
    }
    if (params?.meeting_key) {
      searchParams.append("meeting_key", params.meeting_key.toString())
    }

    const url = `${OPENF1_BASE_URL}/drivers?${searchParams.toString()}`
    console.log("[v0] Fetching drivers from:", url)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Fetched drivers:", data.length, "drivers")

    return data
  } catch (error) {
    console.error("[v0] Error fetching drivers:", error)
    throw error
  }
}

// Fetch car data from OpenF1 API
export async function fetchCarData(params: {
  session_key: number
  driver_number?: number
  speed_gte?: number
  speed_lte?: number
}): Promise<CarData[]> {
  try {
    const searchParams = new URLSearchParams()

    searchParams.append("session_key", params.session_key.toString())

    if (params.driver_number) {
      searchParams.append("driver_number", params.driver_number.toString())
    }
    if (params.speed_gte) {
      searchParams.append("speed>=", params.speed_gte.toString())
    }
    if (params.speed_lte) {
      searchParams.append("speed<=", params.speed_lte.toString())
    }

    const url = `${OPENF1_BASE_URL}/car_data?${searchParams.toString()}`
    console.log("[v0] Fetching car data from:", url)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("[v0] Fetched car data:", data.length, "data points")

    return data
  } catch (error) {
    console.error("[v0] Error fetching car data:", error)
    throw error
  }
}

// Helper function to get recent sessions (from years with available data)
export async function fetchRecentSessions(): Promise<Session[]> {
  const sessions: Session[] = []

  try {
    console.log("[v0] Loading sessions...")

    // Based on OpenF1 documentation, data is available from 2023
    // Let's try multiple years to find available data
    const yearsToTry = [2023, 2022, 2021]

    for (const year of yearsToTry) {
      try {
        const yearSessions = await fetchSessions({ year })
        console.log(`[v0] Found ${yearSessions.length} sessions for year ${year}`)
        sessions.push(...yearSessions)

        // If we found sessions, we can stop trying other years
        if (yearSessions.length > 0) {
          break
        }
      } catch (error) {
        console.log(`[v0] No data available for year ${year}:`, error)
        continue
      }
    }

    // If no sessions found, try fetching without year filter to get latest available data
    if (sessions.length === 0) {
      console.log("[v0] Trying to fetch latest sessions without year filter...")
      const latestSessions = await fetchSessions()
      sessions.push(...latestSessions)
    }

    console.log(`[v0] Sessions loaded successfully: ${sessions.length}`)

    // Sort by date (most recent first)
    return sessions.sort((a, b) => new Date(b.date_start).getTime() - new Date(a.date_start).getTime())
  } catch (error) {
    console.error("[v0] Error fetching recent sessions:", error)
    // Return empty array instead of throwing to prevent app crash
    return []
  }
}
