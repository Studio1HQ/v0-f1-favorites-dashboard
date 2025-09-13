"use client"

import * as React from "react"
import { Check, ChevronsUpDown, User } from "lucide-react"
import { useVeltClient } from '@veltdev/react'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

// Fixed users for F1 Favorites collaboration - matching Velt setup
const users = [
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

export function UserSwitcher() {
  const [open, setOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState(users[0])
  const { client } = useVeltClient()

  // Initialize with first user on mount
  React.useEffect(() => {
    if (client && selectedUser) {
      const initializeUser = async () => {
        try {
          await client.identify({
            userId: selectedUser.userId,
            organizationId: selectedUser.organizationId,
            name: selectedUser.name,
            email: selectedUser.email,
            photoUrl: selectedUser.avatar
          })

          // Set document after user identification
          await client.setDocument(DOCUMENT_ID, {
            documentName: 'F1 Favorites Dashboard'
          })
        } catch (error) {
          console.error('Failed to initialize user:', error)
        }
      }

      initializeUser()
    }
  }, [client]) // Only run once when client is available

  const handleUserSelect = async (user: typeof users[0]) => {
    if (!client) return

    try {
      // Sign out current user first
      await client.signOutUser()

      // Identify new user
      await client.identify({
        userId: user.userId,
        organizationId: user.organizationId,
        name: user.name,
        email: user.email,
        photoUrl: user.avatar
      })

      // Re-set document for new user
      await client.setDocument(DOCUMENT_ID, {
        documentName: 'F1 Favorites Dashboard'
      })

      // Update local state
      setSelectedUser(user)
      setOpen(false)
    } catch (error) {
      console.error('Failed to switch user:', error)
    }
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Toggle clicked, current open state:', open)
    setOpen(!open)
  }

  React.useEffect(() => {
    console.log('UserSwitcher open state changed:', open)
  }, [open])

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element
      if (open && !target.closest('.user-switcher')) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [open])

  return (
    <div className="relative user-switcher">
      <Button
        variant="ghost"
        role="combobox"
        aria-expanded={open}
        aria-label="Select user"
        className="w-auto justify-between p-2 hover:bg-accent"
        onClick={handleToggle}
      >
        <Avatar className="w-8 h-8">
          <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
          <AvatarFallback
            className="text-white font-medium"
            style={{ backgroundColor: selectedUser.color }}
          >
            {selectedUser.initials}
          </AvatarFallback>
        </Avatar>
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute right-0 top-12 w-64 p-2 bg-popover border border-border rounded-md shadow-lg z-[100]">
          <div className="space-y-1">
            <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Users</div>
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className="w-full flex items-center px-2 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Avatar className="mr-3 h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback
                    className="text-white font-medium"
                    style={{ backgroundColor: user.color }}
                  >
                    {user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start flex-1">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
                <Check className={`h-4 w-4 ${selectedUser.id === user.id ? "opacity-100" : "opacity-0"}`} />
              </button>
            ))}
            <div className="border-t border-border mt-1 pt-1">
              <button className="w-full flex items-center px-2 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
                <User className="mr-3 h-4 w-4" />
                <span>Manage Users</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
