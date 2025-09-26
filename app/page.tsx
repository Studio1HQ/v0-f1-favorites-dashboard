import { DashboardLayout } from "@/components/dashboard-layout"
import { RaceSessionsTable } from "@/components/race-sessions-wrapper"

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* F1-style page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">2025 RACE RESULTS</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Collaborative favorites from your team</p>
          </div>
          <div className="text-right text-gray-500">
            <div className="text-sm font-medium">FORMULA 1</div>
            <div className="text-xs">OFFICIAL DATA</div>
          </div>
        </div>

        <RaceSessionsTable />
      </div>
    </DashboardLayout>
  )
}
