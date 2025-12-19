import { useState, useRef, useMemo } from "react"
import { ArrowLeft, Plus, Play, X, Share2, Search, ChevronDown, ChevronUp, StickyNote } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { DEFAULT_SECTIONS } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface ListDetailProps {
    listId: string;
    onNavigate: (screen: 'home' | 'list' | 'store' | 'shopping', params?: any) => void;
}

export function ListDetail({ listId, onNavigate }: ListDetailProps) {
    const { lists, addItem, updateItem, deleteItem, toggleItemComplete } = useAppStore()
    const list = lists.find(l => l.id === listId)
    const [newItemName, setNewItemName] = useState("")
    const [newItemQty, setNewItemQty] = useState("")
    const [searchQuery, setSearchQuery] = useState("")
    const [showSearch, setShowSearch] = useState(false)
    const [expandedItemId, setExpandedItemId] = useState<string | null>(null)
    const [editingNote, setEditingNote] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    if (!list) return <div style={{ color: 'var(--text-primary)' }}>Lista no encontrada</div>

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newItemName.trim()) return
        addItem(listId, newItemName)
        // Update quantity if provided
        if (newItemQty.trim()) {
            const newItem = list.items[list.items.length - 1]
            if (newItem) {
                setTimeout(() => {
                    updateItem(listId, newItem.id, { quantity: newItemQty })
                }, 0)
            }
        }
        setNewItemName("")
        setNewItemQty("")
        inputRef.current?.focus()
    }

    const handleShare = async () => {
        const text = list.items.map(item => {
            let line = item.name
            if (item.quantity) line += ` (${item.quantity})`
            if (item.note) line += ` - ${item.note}`
            return line
        }).join('\n')

        const shareText = `📝 ${list.name}\n\n${text}`

        if (navigator.share) {
            try {
                await navigator.share({ title: list.name, text: shareText })
            } catch { /* User cancelled */ }
        } else {
            await navigator.clipboard.writeText(shareText)
            alert('Lista copiada al portapapeles')
        }
    }

    const toggleExpand = (itemId: string) => {
        if (expandedItemId === itemId) {
            setExpandedItemId(null)
        } else {
            const item = list.items.find(i => i.id === itemId)
            setEditingNote(item?.note || "")
            setExpandedItemId(itemId)
        }
    }

    const saveNote = (itemId: string) => {
        updateItem(listId, itemId, { note: editingNote })
        setExpandedItemId(null)
    }

    // Filter and sort items
    const sortedItems = useMemo(() => {
        let items = [...list.items].reverse()
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            items = items.filter(item => item.name.toLowerCase().includes(query))
        }
        return items
    }, [list.items, searchQuery])

    return (
        <div className="flex flex-col h-full max-h-[80vh]">
            <div className="flex items-center justify-between mb-4">
                <Button variant="ghost" size="icon" onClick={() => onNavigate('home')} className="text-white hover:bg-white/20">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h2 className="text-xl font-bold text-white truncate max-w-[140px]">{list.name}</h2>
                <div className="flex gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowSearch(!showSearch)}
                        className="text-white/70 hover:text-white hover:bg-white/20"
                    >
                        <Search className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleShare}
                        className="text-white/70 hover:text-white hover:bg-white/20"
                    >
                        <Share2 className="w-5 h-5" />
                    </Button>
                    <Button
                        onClick={() => onNavigate('shopping', { listId })}
                        className="bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30 border-none"
                    >
                        <Play className="w-4 h-4 mr-1 fill-current" />
                        Comprar
                    </Button>
                </div>
            </div>

            <div className="rounded-t-3xl flex-1 flex flex-col overflow-hidden shadow-2xl mx-[-1rem] px-4 pt-5 pb-4" style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--card-border)' }}>
                {/* Search bar */}
                {showSearch && (
                    <div className="mb-3 animate-in fade-in slide-in-from-top-2">
                        <Input
                            placeholder="Buscar producto..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border-slate-200 dark:border-slate-700"
                            style={{ background: 'var(--card-bg-solid)', color: 'var(--text-primary)' }}
                        />
                    </div>
                )}

                {/* Add item form */}
                <form onSubmit={handleAddItem} className="flex gap-2 mb-4">
                    <Input
                        ref={inputRef}
                        placeholder="Añadir producto..."
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="flex-1 border-slate-200 dark:border-slate-700 focus-visible:ring-indigo-500"
                        style={{ background: 'var(--card-bg-solid)', color: 'var(--text-primary)' }}
                    />
                    <Input
                        placeholder="Cant."
                        value={newItemQty}
                        onChange={(e) => setNewItemQty(e.target.value)}
                        className="w-16 border-slate-200 dark:border-slate-700"
                        style={{ background: 'var(--card-bg-solid)', color: 'var(--text-primary)' }}
                    />
                    <Button type="submit" size="icon" className="shrink-0 bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="w-5 h-5" />
                    </Button>
                </form>

                {/* Items list */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {sortedItems.length === 0 && (
                        <div className="text-center py-10" style={{ color: 'var(--text-secondary)' }}>
                            <p>{searchQuery ? 'No se encontraron productos' : 'Lista vacía. Añade productos arriba.'}</p>
                        </div>
                    )}

                    {sortedItems.map((item) => {
                        const section = DEFAULT_SECTIONS.find(s => s.id === item.sectionId)
                        const isExpanded = expandedItemId === item.id

                        return (
                            <div
                                key={item.id}
                                className="group rounded-xl border shadow-sm transition-all"
                                style={{ background: 'var(--card-bg-solid)', borderColor: 'var(--card-border)' }}
                            >
                                <div className="flex items-center gap-3 p-3">
                                    <Checkbox
                                        checked={item.isCompleted}
                                        onCheckedChange={() => toggleItemComplete(listId, item.id)}
                                        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={cn("font-medium truncate", item.isCompleted && "line-through")} style={{ color: item.isCompleted ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                                                {item.name}
                                            </span>
                                            {item.quantity && (
                                                <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-medium">
                                                    {item.quantity}
                                                </span>
                                            )}
                                            {item.note && (
                                                <StickyNote className="w-3.5 h-3.5 text-amber-500" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: 'var(--card-border)' }}>
                                                <span>{section?.icon}</span>
                                                <span>{section?.name || 'Otros'}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 hover:bg-black/5 dark:hover:bg-white/10"
                                        onClick={() => toggleExpand(item.id)}
                                    >
                                        {isExpanded ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                                        onClick={() => deleteItem(listId, item.id)}
                                    >
                                        <X className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
                                    </Button>
                                </div>

                                {/* Expanded section for note */}
                                {isExpanded && (
                                    <div className="px-3 pb-3 pt-1 border-t animate-in fade-in slide-in-from-top-2" style={{ borderColor: 'var(--card-border)' }}>
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="Añadir nota..."
                                                value={editingNote}
                                                onChange={(e) => setEditingNote(e.target.value)}
                                                className="text-sm border-slate-200 dark:border-slate-700"
                                                style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}
                                            />
                                            <Button size="sm" onClick={() => saveNote(item.id)} className="bg-indigo-600 hover:bg-indigo-700">
                                                Guardar
                                            </Button>
                                        </div>
                                        {item.note && (
                                            <p className="mt-2 text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                                <StickyNote className="w-3 h-3" />
                                                {item.note}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

