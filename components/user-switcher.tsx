"use client"

import * as React from "react"
import { Check, ChevronsUpDown, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

const users = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatar: "/diverse-user-avatars.png",
    initials: "JD",
  },
  {
    id: "2",
    name: "Sarah Wilson",
    email: "sarah@example.com",
    avatar: "",
    initials: "SW",
  },
]

export function UserSwitcher() {
  const [open, setOpen] = React.useState(false)
  const [selectedUser, setSelectedUser] = React.useState(users[0])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          aria-label="Select user"
          className="w-auto justify-between p-2"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
            <AvatarFallback>{selectedUser.initials}</AvatarFallback>
          </Avatar>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="end">
        <Command>
          <CommandList>
            <CommandGroup heading="Users">
              {users.map((user) => (
                <CommandItem
                  key={user.id}
                  onSelect={() => {
                    setSelectedUser(user)
                    setOpen(false)
                  }}
                  className="text-sm"
                >
                  <Avatar className="mr-2 h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                  <Check className={`ml-auto h-4 w-4 ${selectedUser.id === user.id ? "opacity-100" : "opacity-0"}`} />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem className="text-sm">
                <User className="mr-2 h-4 w-4" />
                <span>Manage Users</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
