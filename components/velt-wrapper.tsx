"use client"

import dynamic from 'next/dynamic'
import { ReactNode } from 'react'

const VeltProviderWrapper = dynamic(
  () => import('./velt-provider').then((mod) => ({ default: mod.VeltProviderWrapper })),
  {
    ssr: false,
    loading: () => null
  }
)

interface VeltWrapperProps {
  children: ReactNode
}

export function VeltWrapper({ children }: VeltWrapperProps) {
  return <VeltProviderWrapper>{children}</VeltProviderWrapper>
}