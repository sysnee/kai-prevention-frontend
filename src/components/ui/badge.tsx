import * as React from "react"
import { cn } from "@/lib/utils"

const Badge = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        variant?: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'custom'
    }
>(({ className, variant = 'default', ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(
                "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
                {
                    'bg-primary text-primary-foreground': variant === 'default',
                    'bg-secondary text-secondary-foreground': variant === 'secondary',
                    'bg-destructive text-destructive-foreground': variant === 'destructive',
                    'bg-green-100 text-green-800': variant === 'success',
                    'bg-yellow-100 text-yellow-800': variant === 'warning',
                },
                className
            )}
            {...props}
        />
    )
})
Badge.displayName = "Badge"

export { Badge } 