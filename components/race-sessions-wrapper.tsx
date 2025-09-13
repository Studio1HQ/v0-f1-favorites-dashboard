"use client"

import dynamic from 'next/dynamic'

const RaceSessionsTable = dynamic(
  () => import('./race-sessions-table').then((mod) => ({ default: mod.RaceSessionsTable })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
)

export { RaceSessionsTable }