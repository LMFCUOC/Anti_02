import { useState, useRef, useEffect } from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Section, SectionId } from "@/types"

interface CategorySelectorProps {
    sections: Section[]
    currentSectionId: SectionId
    onSelect: (sectionId: SectionId) => void
}

export function CategorySelector({ sections, currentSectionId, onSelect }: CategorySelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const currentSection = sections.find(s => s.id === currentSectionId)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div ref={dropdownRef} className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    "border hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                )}
                style={{
                    background: 'var(--card-bg)',
                    borderColor: 'var(--card-border)',
                    color: 'var(--text-primary)'
                }}
            >
                <span>{currentSection?.icon}</span>
                <span className="truncate max-w-[120px]">{currentSection?.name || 'Seleccionar'}</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} style={{ color: 'var(--text-secondary)' }} />
            </button>

            {isOpen && (
                <div
                    className="absolute z-50 mt-1 w-56 rounded-xl border shadow-xl animate-in fade-in slide-in-from-top-2 max-h-64 overflow-y-auto"
                    style={{
                        background: 'var(--card-bg-solid)',
                        borderColor: 'var(--card-border)'
                    }}
                >
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            type="button"
                            onClick={() => {
                                onSelect(section.id)
                                setIsOpen(false)
                            }}
                            className={cn(
                                "w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors",
                                "hover:bg-indigo-500/10 first:rounded-t-xl last:rounded-b-xl",
                                section.id === currentSectionId && "bg-indigo-500/20"
                            )}
                            style={{ color: 'var(--text-primary)' }}
                        >
                            <span className="text-lg">{section.icon}</span>
                            <span className="flex-1 text-left">{section.name}</span>
                            {section.id === currentSectionId && (
                                <Check className="w-4 h-4 text-indigo-500" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
