"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchDrivers, type Driver } from "@/lib/api"

export function useDrivers(sessionKey?: number) {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDrivers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("[v0] Loading drivers for session_key:", sessionKey)

      const data = await fetchDrivers(sessionKey ? { session_key: sessionKey } : {})

      // Remove duplicates by driver_number (keep most recent session)
      const uniqueDrivers = data.reduce((acc: Driver[], current: Driver) => {
        const existingIndex = acc.findIndex(driver => driver.driver_number === current.driver_number)
        if (existingIndex === -1) {
          acc.push(current)
        } else {
          // Keep the driver with the higher session_key (more recent)
          if (current.session_key > acc[existingIndex].session_key) {
            acc[existingIndex] = current
          }
        }
        return acc
      }, [])

      setDrivers(uniqueDrivers)
      console.log("[v0] Drivers loaded successfully:", uniqueDrivers.length, "unique drivers for session", sessionKey)
    } catch (err) {
      console.error("[v0] Failed to load drivers:", err)
      setError(err instanceof Error ? err.message : "Failed to load drivers")
      setDrivers([])
    } finally {
      setLoading(false)
    }
  }, [sessionKey])

  useEffect(() => {
    loadDrivers()
  }, [loadDrivers])

  return { drivers, loading, error, refetch: loadDrivers }
}