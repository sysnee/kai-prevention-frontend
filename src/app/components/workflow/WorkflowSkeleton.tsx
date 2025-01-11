import { WORKFLOW_STAGES } from './WorkflowBoard'
import { Skeleton } from '@mui/material'
import { useTheme } from '@mui/material'

function WorkflowSkeleton() {
    const theme = useTheme()

    const WorkflowCardSkeleton = () => (
        <div
            className="mb-3 last:mb-0"
            style={{
                border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)",
            }}
        >
            <div className="rounded-lg p-4 bg-white/5">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                        <Skeleton variant="circular" width={32} height={32} />
                        <div className="ml-3">
                            <Skeleton variant="text" width={120} height={20} />
                            <Skeleton variant="text" width={80} height={16} />
                        </div>
                    </div>
                </div>

                <Skeleton
                    variant="rounded"
                    width="100%"
                    height={32}
                    className="mb-3"
                />

                <div className="flex items-center">
                    <Skeleton variant="circular" width={16} height={16} className="mr-1" />
                    <Skeleton variant="text" width={100} height={16} />
                </div>
            </div>
        </div>
    )

    const WorkflowColumnSkeleton = ({ status }: { status: typeof WORKFLOW_STAGES[0] }) => (
        <div className="rounded-lg bg-white/5 p-4"
            style={{
                border: theme.palette.mode === 'light' ? "1px solid rgba(229,231,235,255)" : "1px solid hsla(220, 20%, 25%, 0.6)"
            }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${status.color.replace('text-', 'bg-')}/10`}>
                        <status.icon className={`w-5 h-5 text-kai-primary`} />
                    </div>
                    <div>
                        <h3 className="font-medium text-kai-text-primary">{status.title}</h3>
                        <p className="text-sm text-kai-text-secondary">{status.description}</p>
                    </div>
                </div>
                <Skeleton variant="circular" width={24} height={24} />
            </div>

            <div className="space-y-3">
                {[1, 2, 3].map((index) => (
                    <WorkflowCardSkeleton key={index} />
                ))}
            </div>
        </div>
    )

    return (
        <div className="overflow-x-auto -mx-4 px-4">
            <div className="inline-flex gap-4 lg:gap-6 min-w-full py-4">
                {WORKFLOW_STAGES.map((status) => (
                    <div
                        key={status.id}
                        className="w-[280px] md:w-[320px] lg:w-80 flex-shrink-0"
                    >
                        <WorkflowColumnSkeleton status={status} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default WorkflowSkeleton 