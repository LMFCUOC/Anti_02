import { useState, useRef } from "react"
import { ArrowLeft, Plus, Play, X } from "lucide-react"
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
    const { lists, addItem, deleteItem, toggleItemComplete } = useAppStore()
    const list = lists.find(l => l.id === listId)
    const [newItemName, setNewItemName] = useState("")
    const inputRef = useRef<HTMLInputElement>(null)

    if (!list) return <div>Lista no encontrada</div>

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newItemName.trim()) return
        addItem(listId, newItemName)
        setNewItemName("")
        // Keep focus
        inputRef.current?.focus()
    }

    // Group items by section for display (optional in edit mode, but helpful)
    // For edit mode, a simple list is often better, but let's show section badges
    const sortedItems = [...list.items].reverse() // Newest first

    return (
        <div className="flex flex-col h-full max-h-[80vh]">
            <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" size="icon" onClick={() => onNavigate('home')} className="text-white hover:bg-white/20">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h2 className="text-xl font-bold text-white truncate max-w-[200px]">{list.name}</h2>
                <Button
                    onClick={() => onNavigate('shopping', { listId })}
                    className="bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30 border-none"
                >
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Comprar
                </Button>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-t-3xl flex-1 flex flex-col overflow-hidden shadow-2xl border-t border-white/50 mx-[-1rem] px-4 pt-6 pb-4">
                <form onSubmit={handleAddItem} className="flex gap-2 mb-4">
                    <Input
                        ref={inputRef}
                        placeholder="Añadir producto..."
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="bg-white border-slate-200 focus-visible:ring-indigo-500"
                    />
                    <Button type="submit" size="icon" className="shrink-0 bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="w-5 h-5" />
                    </Button>
                </form>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {sortedItems.length === 0 && (
                        <div className="text-center py-10 text-slate-400">
                            <p>Lista vacía. Añade productos arriba.</p>
                        </div>
                    )}

                    {sortedItems.map((item) => {
                        const section = DEFAULT_SECTIONS.find(s => s.id === item.sectionId)
                        return (
                            <div
                                key={item.id}
                                className="group flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md"
                            >
                                <Checkbox
                                    checked={item.isCompleted}
                                    onCheckedChange={() => toggleItemComplete(listId, item.id)}
                                    className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className={cn("font-medium text-slate-800 truncate", item.isCompleted && "text-slate-400 line-through")}>
                                        {item.name}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span className="flex items-center gap-1 bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                                            <span>{section?.icon}</span>
                                            <span>{section?.name || 'Otros'}</span>
                                        </span>
                                        {item.quantity && <span>• {item.quantity}</span>}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50"
                                    onClick={() => deleteItem(listId, item.id)}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
