"use client"

import dynamic from 'next/dynamic'
import { ReactNode } from 'react'

const UserProvider = dynamic(
  () => import('@/contexts/user-context').then((mod) => ({ default: mod.UserProvider })),
  {
    ssr: false,
    loading: () => null
  }
)

interface UserProviderWrapperProps {
  children: ReactNode
}

export function UserProviderWrapper({ children }: UserProviderWrapperProps) {
  return <UserProvider>{children}</UserProvider>
}