import * as React from "react"
import { cn } from "@/lib/utils"

interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> { }

export function AppShell({ className, children, ...props }: AppShellProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 flex justify-center items-start">
            <div
                className={cn(
                    "w-full max-w-md min-h-[90vh] bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden flex flex-col",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </div>
    )
}
