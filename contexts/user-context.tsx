"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useVeltClient } from '@veltdev/react'

// Fixed users for F1 Favorites collaboration
const USERS = [
  {
    id: "alex-thunder-v2",
    userId: "alex-thunder-v2",
    organizationId: "f1-racing-hub-2024",
    name: "Alex Thunder",
    email: "alex@speedracing.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AlexThunder&backgroundColor=b6e3f4,c0aede,d1d4f9",
    initials: "AT",
    color: "#FF1744" // Ferrari red
  },
  {
    id: "jordan-swift-v2",
    userId: "jordan-swift-v2",
    organizationId: "f1-racing-hub-2024",
    name: "Jordan Swift",
    email: "jordan@velocityteam.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JordanSwift&backgroundColor=ffdfbf,ffd5dc,d1d4f9",
    initials: "JS",
    color: "#00BCD4" // Mercedes cyan
  },
]

const DOCUMENT_ID = "f1-dashboard-v2-2024"
const USER_SELECTION_KEY = "f1-selected-user"

interface UserContextType {
  currentUser: typeof USERS[0]
  setCurrentUser: (user: typeof USERS[0]) => void
  users: typeof USERS
  isInitialized: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState(USERS[0])
  const [isInitialized, setIsInitialized] = useState(false)
  const { client } = useVeltClient()

  // Load user selection from localStorage on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem(USER_SELECTION_KEY)
    if (savedUserId) {
      const savedUser = USERS.find(u => u.userId === savedUserId)
      if (savedUser) {
        setCurrentUserState(savedUser)
      }
    }
  }, [])

  // Initialize Velt when client and user are ready
  useEffect(() => {
    if (client && currentUser && !isInitialized) {
      const initializeVelt = async () => {
        try {
          await client.identify({
            userId: currentUser.userId,
            organizationId: currentUser.organizationId,
            name: currentUser.name,
            email: currentUser.email,
            photoUrl: currentUser.avatar
          })

          await client.setDocument(DOCUMENT_ID, {
            documentName: 'F1 Favorites Dashboard'
          })

          setIsInitialized(true)
          console.log('Velt initialized with user:', currentUser.name)
        } catch (error) {
          console.error('Failed to initialize Velt:', error)
        }
      }

      initializeVelt()
    }
  }, [client, currentUser, isInitialized])

  const setCurrentUser = async (user: typeof USERS[0]) => {
    if (!client) return

    try {
      // Save to localStorage
      localStorage.setItem(USER_SELECTION_KEY, user.userId)

      // Sign out current user
      await client.signOutUser()

      // Update state
      setCurrentUserState(user)
      setIsInitialized(false) // Will trigger re-initialization

      console.log('User switched to:', user.name)
    } catch (error) {
      console.error('Failed to switch user:', error)
    }
  }

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, users: USERS, isInitialized }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}