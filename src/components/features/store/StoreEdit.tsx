import { useState, useEffect } from "react"
import { ArrowLeft, GripVertical } from "lucide-react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { DEFAULT_SECTIONS } from "@/lib/constants"
import { cn } from "@/lib/utils"

interface StoreEditProps {
    storeId: string;
    onNavigate: (screen: 'home' | 'list' | 'store', params?: any) => void;
}

export function StoreEdit({ storeId, onNavigate }: StoreEditProps) {
    const { stores, reorderStoreSections } = useAppStore()
    const store = stores.find(s => s.id === storeId)

    // Local state for optimistic UI updates
    const [sections, setSections] = useState<string[]>([])

    useEffect(() => {
        if (store) {
            setSections(store.sections)
        }
    }, [store])

    if (!store) return <div style={{ color: 'var(--text-primary)' }}>Tienda no encontrada</div>

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return

        const items = Array.from(sections)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        setSections(items)
        reorderStoreSections(storeId, items)
    }

    // Helper to get section details
    const getSection = (id: string) => DEFAULT_SECTIONS.find(s => s.id === id)

    return (
        <div className="flex flex-col h-full max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" size="icon" onClick={() => onNavigate('store')} className="text-white hover:bg-white/20">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h2 className="text-xl font-bold text-white">Editar Pasillos</h2>
                <div className="w-10" />
            </div>

            <div className="backdrop-blur-xl rounded-t-3xl flex-1 flex flex-col overflow-hidden shadow-2xl mx-[-1rem] px-4 pt-6" style={{ background: 'var(--card-bg-solid)', borderTop: '1px solid var(--card-border)' }}>
                <p className="text-sm mb-4 text-center" style={{ color: 'var(--text-secondary)' }}>
                    Arrastra las secciones para que coincidan con tu recorrido en el súper.
                </p>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="sections">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="flex-1 overflow-y-auto space-y-2 pb-4"
                            >
                                {sections.map((sectionId, index) => {
                                    const section = getSection(sectionId)
                                    if (!section) return null

                                    return (
                                        <Draggable key={sectionId} draggableId={sectionId} index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={cn(
                                                        "flex items-center gap-3 p-3 rounded-xl border shadow-sm transition-shadow",
                                                        snapshot.isDragging && "shadow-lg ring-2 ring-indigo-500 z-10"
                                                    )}
                                                    style={{
                                                        ...provided.draggableProps.style,
                                                        background: 'var(--card-bg-solid)',
                                                        borderColor: 'var(--card-border)'
                                                    }}
                                                >
                                                    <div {...provided.dragHandleProps} className="cursor-grab active:cursor-grabbing p-1" style={{ color: 'var(--text-secondary)' }}>
                                                        <GripVertical className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-2xl">{section.icon}</span>
                                                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{section.name}</span>
                                                </div>
                                            )}
                                        </Draggable>
                                    )
                                })}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </div>
    )
}

