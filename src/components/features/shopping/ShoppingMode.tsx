import { useMemo } from "react"
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { DEFAULT_SECTIONS } from "@/lib/constants"


interface ShoppingModeProps {
    listId: string;
    onNavigate: (screen: 'home' | 'list' | 'store', params?: any) => void;
}

export function ShoppingMode({ listId, onNavigate }: ShoppingModeProps) {
    const { lists, stores, toggleItemComplete } = useAppStore()
    const list = lists.find(l => l.id === listId)
    const store = stores.find(s => s.id === list?.storeId) || stores[0]

    if (!list) return <div>Lista no encontrada</div>

    // Group items by section
    const groupedItems = useMemo(() => {
        const groups: Record<string, typeof list.items> = {}
        list.items.forEach(item => {
            if (!groups[item.sectionId]) groups[item.sectionId] = []
            groups[item.sectionId].push(item)
        })
        return groups
    }, [list.items])

    // Get sections in store order
    const orderedSections = useMemo(() => {
        if (!store) return DEFAULT_SECTIONS

        // Create a map of section definitions
        const sectionMap = DEFAULT_SECTIONS.reduce((acc, s) => {
            acc[s.id] = s
            return acc
        }, {} as Record<string, typeof DEFAULT_SECTIONS[0]>)

        // Map store section IDs to section objects, filtering out invalid ones
        const storeSections = store.sections
            .map(id => sectionMap[id])
            .filter(Boolean)

        // Add any missing sections at the end (just in case)
        const missingSections = DEFAULT_SECTIONS.filter(s => !store.sections.includes(s.id))

        return [...storeSections, ...missingSections]
    }, [store])

    // Calculate progress
    const totalItems = list.items.length
    const completedItems = list.items.filter(i => i.isCompleted).length
    const progress = totalItems === 0 ? 0 : (completedItems / totalItems) * 100

    return (
        <div className="flex flex-col h-full max-h-[90vh]">
            {/* Header with Progress */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2 text-white">
                    <Button variant="ghost" size="icon" onClick={() => onNavigate('list', { listId })} className="hover:bg-white/20">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <div className="text-center">
                        <h2 className="font-bold text-lg leading-tight">{list.name}</h2>
                        <p className="text-xs opacity-80">{completedItems} de {totalItems} productos</p>
                    </div>
                    <div className="w-10" /> {/* Spacer */}
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                        className="h-full bg-green-400 transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Shopping List */}
            <div className="flex-1 overflow-y-auto -mx-4 px-4 pb-20 space-y-6">
                {orderedSections.map(section => {
                    const items = groupedItems[section.id] || []
                    if (items.length === 0) return null

                    const activeItems = items.filter(i => !i.isCompleted)
                    const doneItems = items.filter(i => i.isCompleted)

                    // Hide section if all items are done? No, show them at bottom or crossed out.
                    // Let's show active first, then done.

                    return (
                        <div key={section.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-2 mb-3 sticky top-0 bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/10 z-10">
                                <span className="text-2xl">{section.icon}</span>
                                <h3 className="font-bold text-white text-lg tracking-wide">{section.name}</h3>
                            </div>

                            <div className="space-y-2 pl-2">
                                {/* Active Items */}
                                {activeItems.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleItemComplete(listId, item.id)}
                                        className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-white/50 active:scale-[0.98] transition-transform cursor-pointer"
                                    >
                                        <Circle className="w-6 h-6 text-slate-300 shrink-0" />
                                        <div className="flex-1">
                                            <span className="text-lg font-medium text-slate-800">{item.name}</span>
                                            {item.quantity && <span className="text-slate-500 text-sm ml-2">({item.quantity})</span>}
                                            {item.note && <p className="text-xs text-amber-600 mt-0.5">{item.note}</p>}
                                        </div>
                                    </div>
                                ))}

                                {/* Completed Items */}
                                {doneItems.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleItemComplete(listId, item.id)}
                                        className="flex items-center gap-4 p-3 bg-white/40 rounded-xl border border-white/20 opacity-60"
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                        <span className="text-base font-medium text-slate-600 line-through decoration-slate-400">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}

                {list.items.length === 0 && (
                    <div className="text-center py-20 text-white/60">
                        <p>Lista vacía. ¡Añade cosas antes de comprar!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
