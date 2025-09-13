"use client"

import { useState, useEffect, useCallback } from "react"
import type { Session } from "@/lib/api"

const FAVORITES_STORAGE_KEY = "f1-favorites"

export interface FavoriteSession {
  session_key: number
  session_name: string
  date_start: string
  session_type: string
  location: string
  country_name: string
  year: number
  added_at: string
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteSession[]>([])
  const [loading, setLoading] = useState(true)

  // Load favorites from localStorage immediately for fast UX
  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
      if (stored) {
        const parsedFavorites = JSON.parse(stored)
        setFavorites(parsedFavorites)
      }
    } catch (error) {
      console.error("[v0] Error loading favorites:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
      } catch (error) {
        console.error("[v0] Error saving favorites:", error)
      }
    }
  }, [favorites, loading])

  const addToFavorites = useCallback((session: Session) => {
    const favoriteSession: FavoriteSession = {
      session_key: session.session_key,
      session_name: session.session_name,
      date_start: session.date_start,
      session_type: session.session_type,
      location: session.location,
      country_name: session.country_name,
      year: session.year,
      added_at: new Date().toISOString(),
    }

    setFavorites((prev) => {
      // Check if already exists
      if (prev.some((fav) => fav.session_key === session.session_key)) {
        return prev
      }
      return [...prev, favoriteSession]
    })
  }, [])

  const removeFromFavorites = useCallback((sessionKey: number) => {
    setFavorites((prev) => prev.filter((fav) => fav.session_key !== sessionKey))
  }, [])

  const isFavorite = useCallback(
    (sessionKey: number) => {
      return favorites.some((fav) => fav.session_key === sessionKey)
    },
    [favorites],
  )

  const clearAllFavorites = useCallback(() => {
    setFavorites([])
  }, [])

  const getFavoritesByYear = useCallback(
    (year?: number) => {
      if (!year) return favorites
      return favorites.filter((fav) => fav.year === year)
    },
    [favorites],
  )

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearAllFavorites,
    getFavoritesByYear,
    favoritesCount: favorites.length,
  }
}