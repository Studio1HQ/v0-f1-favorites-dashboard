import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Zap, Gauge, Settings } from "lucide-react"

export default function CarsPage() {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">Cars</h1>
            <p className="text-muted-foreground text-pretty">
              Analyze Formula 1 car performance data and technical specifications
            </p>
          </div>
        </div>

        {/* Placeholder content for cars section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teams</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10</div>
              <p className="text-xs text-muted-foreground">Current F1 teams</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Speed</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">372</div>
              <p className="text-xs text-muted-foreground">km/h record</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Telemetry Points</CardTitle>
              <Gauge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">300Hz</div>
              <p className="text-xs text-muted-foreground">Data frequency</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sensors</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">150+</div>
              <p className="text-xs text-muted-foreground">Per car</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Car Data Integration</CardTitle>
            <CardDescription>
              This section will display real-time telemetry data, car performance metrics, and technical analysis.
              Integration with OpenF1 car data API coming soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12 text-muted-foreground">
              <Car className="mx-auto h-12 w-12 mb-4" />
              <p>Car telemetry and performance data will be displayed here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
