import { DashboardLayout } from "@/components/dashboard-layout"
import { RaceSessionsTable } from "@/components/race-sessions-wrapper"

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="flex-1">
        {/* F1-style hero section */}
        <div className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border-b border-red-600/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-slate-900 to-slate-900 dark:from-red-900/30 dark:via-slate-950 dark:to-slate-950"></div>
          <div className="relative px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-8 bg-red-600 rounded-full"></div>
                  <h1 className="text-4xl font-bold text-white tracking-tight">2025 RACE RESULTS</h1>
                </div>
                <p className="text-slate-300 dark:text-slate-400 text-lg">Complete Formula 1 race sessions and historical data</p>
              </div>
              <div className="text-right text-slate-400 dark:text-slate-500">
                <div className="text-sm font-medium">FORMULA 1</div>
                <div className="text-xs">OFFICIAL DATA</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950">
          <RaceSessionsTable />
        </div>
      </div>
    </DashboardLayout>
  )
}
