"use client"

import * as React from "react"
import { Check, ChevronsUpDown, User } from "lucide-react"
import { useUser } from "@/contexts/user-context"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function UserSwitcher() {
  const [open, setOpen] = React.useState(false)
  const { currentUser, setCurrentUser, users } = useUser()

  const handleUserSelect = (user: typeof users[0]) => {
    setCurrentUser(user)
    setOpen(false)
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen(!open)
  }

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
          <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
          <AvatarFallback
            className="text-white font-medium"
            style={{ backgroundColor: currentUser.color }}
          >
            {currentUser.initials}
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
                <Check className={`h-4 w-4 ${currentUser.id === user.id ? "opacity-100" : "opacity-0"}`} />
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
