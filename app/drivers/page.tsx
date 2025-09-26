import { DashboardLayout } from "@/components/dashboard-layout"
import { DriversTable } from "@/components/drivers-table"

export default function DriversPage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* F1-style page header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white dark:text-white text-black">F1 DRIVERS</h1>
            <p className="text-gray-400 dark:text-gray-400 text-gray-600 mt-2">Complete Formula 1 driver roster and team information</p>
          </div>
          <div className="text-right text-gray-500 dark:text-gray-500 text-gray-700">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-500 text-gray-700">FORMULA 1</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 text-gray-700">OFFICIAL DATA</div>
          </div>
        </div>

        <DriversTable />
      </div>
    </DashboardLayout>
  )
}
