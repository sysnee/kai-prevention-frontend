import { Calendar, ClipboardList, Timer, Users } from 'lucide-react'
import { useTheme } from '@mui/material'
import { Skeleton } from '@mui/material'

function WorkflowMetricsSkeleton() {
    const theme = useTheme()

    const MetricCardSkeleton = ({ icon: Icon }: { icon: any }) => (
        <div
            className="rounded-lg p-4 bg-white/5"
            style={{
                border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)"
            }}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                    <Icon className="w-5 h-5 text-orange-500" />
                </div>
                <Skeleton variant="rounded" width={60} height={24} className="rounded-full" />
            </div>
            <div className="flex items-baseline justify-between">
                <Skeleton variant="text" width={60} height={32} />
                <Skeleton variant="text" width={80} height={20} />
            </div>
            <div className="mt-2">
                <Skeleton variant="text" width="100%" height={20} />
            </div>
        </div>
    )

    const StatusCardSkeleton = () => (
        <div
            className="rounded-lg p-4 bg-white/5"
            style={{
                border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)"
            }}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="p-2 bg-orange-50 rounded-lg">
                    <Timer className="w-5 h-5 text-orange-500" />
                </div>
                <Skeleton variant="rounded" width={60} height={24} className="rounded-full" />
            </div>
            <div className="space-y-2">
                {['Em Andamento', 'Concluídos', 'Atrasados'].map((label, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-kai-text-primary">{label}</span>
                        <Skeleton variant="text" width={30} height={20} />
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <div
            className="rounded-xl p-6 shadow-sm"
            style={{
                border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)"
            }}
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold kai-text-primary">
                    Métricas do Fluxo
                </h3>
                <div className="flex items-center kai-text-secondary">
                    <Calendar className="w-4 h-4 mr-2" />
                    <Skeleton variant="text" width={200} height={20} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCardSkeleton icon={ClipboardList} />
                <MetricCardSkeleton icon={Users} />
                <MetricCardSkeleton icon={Timer} />
                <StatusCardSkeleton />
            </div>
        </div>
    )
}

export default WorkflowMetricsSkeleton 