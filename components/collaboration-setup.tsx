"use client"

import { useSetDocument } from '@veltdev/react'

export function CollaborationSetup() {
  // Set the document for collaboration
  // User identification is now handled by UserSwitcher component
  useSetDocument('f1-favorites-dashboard', {
    documentName: 'F1 Favorites Dashboard'
  })

  return null // This component doesn't render anything visible
}