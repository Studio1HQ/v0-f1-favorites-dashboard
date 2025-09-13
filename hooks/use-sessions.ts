"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchRecentSessions, type Session } from "@/lib/api"

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSessions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("[v0] Loading sessions...")

      const data = await fetchRecentSessions()
      setSessions(data)
      console.log("[v0] Sessions loaded successfully:", data.length)
    } catch (err) {
      console.error("[v0] Failed to load sessions:", err)
      setError(err instanceof Error ? err.message : "Failed to load sessions")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSessions()
  }, [loadSessions])

  return { sessions, loading, error, refetch: loadSessions }
}
