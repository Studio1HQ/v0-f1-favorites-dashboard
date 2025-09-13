import { DashboardLayout } from "@/components/dashboard-layout"
import dynamic from 'next/dynamic'

const FavoritesContent = dynamic(
  () => import('./favorites-content').then((mod) => ({ default: mod.FavoritesContent })),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading favorites...</p>
          </div>
        </div>
      </div>
    )
  }
)

export default function FavoritesPage() {
  return (
    <DashboardLayout>
      <FavoritesContent />
    </DashboardLayout>
  )
}
