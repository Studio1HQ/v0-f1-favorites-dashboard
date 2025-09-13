"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchSessions, type Session } from "@/lib/api"

export function useSessions(year?: number) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSessions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("[v0] Loading sessions for year:", year)

      const data = await fetchSessions(year ? { year } : {})
      setSessions(data)
      console.log("[v0] Sessions loaded successfully:", data.length, "sessions for year", year)
    } catch (err) {
      console.error("[v0] Failed to load sessions:", err)
      setError(err instanceof Error ? err.message : "Failed to load sessions")
      setSessions([])
    } finally {
      setLoading(false)
    }
  }, [year])

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  return { sessions, loading, error, refetch: loadSessions }
}
