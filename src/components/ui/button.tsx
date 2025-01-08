import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        variant?: 'default' | 'ghost' | 'destructive'
        size?: 'default' | 'sm' | 'lg'
    }
>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-md font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-1",
                "disabled:pointer-events-none disabled:opacity-50",
                {
                    'bg-primary text-primary-foreground shadow hover:bg-primary/90': variant === 'default',
                    'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
                    'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
                    'h-9 px-4 py-2': size === 'default',
                    'h-8 rounded-md px-3 text-sm': size === 'sm',
                    'h-10 rounded-md px-8': size === 'lg',
                },
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Button } 