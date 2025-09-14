"use client"

import { useState, useEffect, useCallback } from "react"
import { useLiveState } from '@veltdev/react'
import type { Session } from "@/lib/api"

const FAVORITES_STORAGE_KEY = "f1-favorites"
const FAVORITES_LIVE_STATE_KEY = "collaborative-favorites"

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
  // Use Velt's useLiveState for real-time collaborative favorites
  const [favorites, setFavorites, serverConnectionState] = useLiveState(
    FAVORITES_LIVE_STATE_KEY,
    [] as FavoriteSession[],
    {
      syncDuration: 100, // Sync every 100ms for fast updates
      resetLiveState: false, // Don't reset when component unmounts
      listenToNewChangesOnly: false // Get all data, not just new changes
    }
  )

  const [loading, setLoading] = useState(true)

  // More intelligent loading management
  useEffect(() => {
    // Load backup from localStorage immediately and initialize live state
    const loadBackup = () => {
      try {
        const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
        if (stored && favorites.length === 0) {
          const parsedFavorites = JSON.parse(stored) as FavoriteSession[]
          console.log('Loading favorites backup:', parsedFavorites.length)
          // Initialize the live state with localStorage data
          if (parsedFavorites.length > 0) {
            setFavorites(parsedFavorites)
          }
        }
      } catch (error) {
        console.error("Error loading favorites backup:", error)
      }
    }

    // Only load backup if favorites is empty (initial load)
    if (favorites.length === 0) {
      loadBackup()
    }

    // Set a reasonable loading timeout
    const timer = setTimeout(() => {
      setLoading(false)
      console.log('Favorites loading timeout reached, current count:', favorites.length)
    }, 500) // Reduced timeout since we're loading from localStorage

    return () => clearTimeout(timer)
  }, [favorites.length, setFavorites])

  // Always backup to localStorage when favorites change
  useEffect(() => {
    if (favorites.length > 0) {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
        console.log('Favorites backed up to localStorage:', favorites.length)
      } catch (error) {
        console.error("Error saving favorites backup:", error)
      }
    }
  }, [favorites])

  // Stop loading once we have data or connection is established
  useEffect(() => {
    // Stop loading when we have favorites or when Velt is connected (even with 0 favorites)
    if (favorites.length > 0 || serverConnectionState === 'connected' || serverConnectionState === 'disconnected') {
      setLoading(false)
    }
  }, [favorites.length, serverConnectionState])

  const addToFavorites = useCallback((session: Session) => {
    console.log(`Adding favorite: ${session.session_name} (${session.session_key})`)
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

    // Check if already exists before adding
    if (!favorites.some((fav) => fav.session_key === session.session_key)) {
      const newFavorites = [...favorites, favoriteSession]
      console.log(`Total favorites after adding: ${newFavorites.length}`)

      // Update both live state and localStorage immediately
      setFavorites(newFavorites)

      // Also update localStorage immediately as a backup
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites))
        console.log('Favorites immediately saved to localStorage')
      } catch (error) {
        console.error("Error saving favorites to localStorage:", error)
      }
    } else {
      console.log(`Session ${session.session_key} already in favorites`)
    }
  }, [favorites, setFavorites])

  const removeFromFavorites = useCallback((sessionKey: number) => {
    console.log(`Removing favorite: ${sessionKey}`)
    const newFavorites = favorites.filter((fav) => fav.session_key !== sessionKey)
    console.log(`Total favorites after removing: ${newFavorites.length}`)

    // Update both live state and localStorage immediately
    setFavorites(newFavorites)

    // Also update localStorage immediately as a backup
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites))
      console.log('Favorites immediately saved to localStorage after removal')
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error)
    }
  }, [favorites, setFavorites])

  const isFavorite = useCallback(
    (sessionKey: number) => {
      const result = favorites.some((fav) => fav.session_key === sessionKey)
      if (result) {
        console.log(`Session ${sessionKey} is favorited, total favorites: ${favorites.length}`)
      }
      return result
    },
    [favorites],
  )

  const clearAllFavorites = useCallback(() => {
    setFavorites([])
  }, [setFavorites])

  const getFavoritesByYear = useCallback(
    (year?: number) => {
      if (!year) return favorites
      return favorites.filter((fav) => fav.year === year)
    },
    [favorites],
  )

  // Log the current state for debugging
  console.log(`Favorites hook state: ${favorites.length} favorites, loading: ${loading}, connection: ${serverConnectionState}`)

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearAllFavorites,
    getFavoritesByYear,
    favoritesCount: favorites.length,
    serverConnectionState, // Expose connection state for debugging
  }
}
