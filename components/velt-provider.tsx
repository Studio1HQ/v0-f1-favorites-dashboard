"use client"

import { VeltProvider } from '@veltdev/react'

interface VeltProviderWrapperProps {
  children: React.ReactNode
}

export function VeltProviderWrapper({ children }: VeltProviderWrapperProps) {
  return (
    <VeltProvider apiKey={process.env.NEXT_PUBLIC_VELT_API_KEY!}>
      {children}
    </VeltProvider>
  )
}