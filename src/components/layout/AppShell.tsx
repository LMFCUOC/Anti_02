import * as React from "react"
import { cn } from "@/lib/utils"

interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> { }

export function AppShell({ className, children, ...props }: AppShellProps) {
    return (
        <div className="min-h-screen p-4 flex justify-center items-start">
            <div
                className={cn(
                    "w-full max-w-md min-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col",
                    "md:backdrop-blur-xl", // Solo aplicar backdrop-blur en desktop
                    className
                )}
                style={{
                    background: 'var(--card-bg)',
                    borderColor: 'var(--card-border)',
                    borderWidth: '1px',
                    borderStyle: 'solid'
                }}
                {...props}
            >
                {children}
            </div>
        </div>
    )
}

