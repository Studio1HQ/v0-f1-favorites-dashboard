import { DashboardLayout } from "@/components/dashboard-layout"
import { RaceSessionsTable } from "@/components/race-sessions-table"

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Race Sessions</h1>
            <p className="text-muted-foreground text-pretty">Explore historical Formula 1 race sessions and data</p>
          </div>
        </div>
        <RaceSessionsTable />
      </div>
    </DashboardLayout>
  )
}
