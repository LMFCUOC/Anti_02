import { useMemo, useState } from "react"
import { ArrowLeft, CheckCircle2, Circle, Search } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DEFAULT_SECTIONS } from "@/lib/constants"


interface ShoppingModeProps {
    listId: string;
    onNavigate: (screen: 'home' | 'list' | 'store', params?: any) => void;
}

export function ShoppingMode({ listId, onNavigate }: ShoppingModeProps) {
    const { lists, stores, toggleItemComplete } = useAppStore()
    const list = lists.find(l => l.id === listId)
    const store = stores.find(s => s.id === list?.storeId) || stores[0]
    const [searchQuery, setSearchQuery] = useState("")
    const [showSearch, setShowSearch] = useState(false)

    if (!list) return <div style={{ color: 'var(--text-primary)' }}>Lista no encontrada</div>

    // Group items by section
    const groupedItems = useMemo(() => {
        const groups: Record<string, typeof list.items> = {}
        let items = list.items

        // Filter by search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            items = items.filter(item => item.name.toLowerCase().includes(query))
        }

        items.forEach(item => {
            if (!groups[item.sectionId]) groups[item.sectionId] = []
            groups[item.sectionId].push(item)
        })
        return groups
    }, [list.items, searchQuery])

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
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowSearch(!showSearch)}
                        className="hover:bg-white/20"
                    >
                        <Search className="w-5 h-5" />
                    </Button>
                </div>

                {/* Search bar */}
                {showSearch && (
                    <div className="mb-3 animate-in fade-in slide-in-from-top-2">
                        <Input
                            autoFocus
                            placeholder="Buscar producto..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border-white/20 bg-white/10 text-white placeholder:text-white/50"
                        />
                    </div>
                )}

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

                    return (
                        <div key={section.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-2 mb-3 sticky top-0 backdrop-blur-md p-2 rounded-lg border z-10" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                                <span className="text-2xl">{section.icon}</span>
                                <h3 className="font-bold text-lg tracking-wide" style={{ color: 'var(--text-on-gradient)' }}>{section.name}</h3>
                            </div>

                            <div className="space-y-2 pl-2">
                                {/* Active Items */}
                                {activeItems.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleItemComplete(listId, item.id)}
                                        className="flex items-center gap-4 p-4 rounded-2xl shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
                                        style={{ background: 'var(--card-bg-solid)', borderColor: 'var(--card-border)', borderWidth: '1px', borderStyle: 'solid' }}
                                    >
                                        <Circle className="w-6 h-6 shrink-0" style={{ color: 'var(--text-secondary)' }} />
                                        <div className="flex-1">
                                            <span className="text-lg font-medium" style={{ color: 'var(--text-primary)' }}>{item.name}</span>
                                            {item.quantity && <span className="text-sm ml-2 px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">{item.quantity}</span>}
                                            {item.note && <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">{item.note}</p>}
                                        </div>
                                    </div>
                                ))}

                                {/* Completed Items */}
                                {doneItems.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => toggleItemComplete(listId, item.id)}
                                        className="flex items-center gap-4 p-3 rounded-xl opacity-60 cursor-pointer"
                                        style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)', borderWidth: '1px', borderStyle: 'solid' }}
                                    >
                                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                        <span className="text-base font-medium line-through" style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}

                {list.items.length === 0 && (
                    <div className="text-center py-20" style={{ color: 'var(--text-secondary)' }}>
                        <p>Lista vacía. ¡Añade cosas antes de comprar!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

