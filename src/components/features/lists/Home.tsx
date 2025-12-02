import { useState } from "react"
import { Plus, Download, Store, ChevronRight, Trash2, ShoppingCart } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface HomeProps {
    onNavigate: (screen: 'home' | 'list' | 'store', params?: any) => void;
}

export function Home({ onNavigate }: HomeProps) {
    const { lists, addList, deleteList, importListFromText } = useAppStore()
    const [isCreating, setIsCreating] = useState(false)
    const [isImporting, setIsImporting] = useState(false)
    const [newName, setNewName] = useState("")
    const [importText, setImportText] = useState("")

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newName.trim()) return
        addList(newName)
        setNewName("")
        setIsCreating(false)
    }

    const handleImport = () => {
        if (!importText.trim()) return
        importListFromText(importText)
        setImportText("")
        setIsImporting(false)
    }

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation()
        if (confirm("¿Borrar esta lista?")) {
            deleteList(id)
        }
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
                <Button
                    onClick={() => setIsCreating(true)}
                    className="h-auto py-4 flex flex-col gap-2 bg-white/20 hover:bg-white/30 text-white border-white/20 backdrop-blur-md"
                >
                    <Plus className="w-6 h-6" />
                    <span>Nueva Lista</span>
                </Button>
                <Button
                    onClick={() => setIsImporting(true)}
                    variant="secondary"
                    className="h-auto py-4 flex flex-col gap-2 bg-white/10 hover:bg-white/20 text-white border-white/10 backdrop-blur-md"
                >
                    <Download className="w-6 h-6" />
                    <span>Importar Texto</span>
                </Button>
            </div>

            {isCreating && (
                <Card className="animate-in fade-in slide-in-from-top-4">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Nueva Lista</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreate} className="flex gap-2">
                            <Input
                                autoFocus
                                placeholder="Ej: Compra Semanal"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <Button type="submit">Crear</Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {isImporting && (
                <Card className="animate-in fade-in slide-in-from-top-4">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Pegar Lista</CardTitle>
                        <CardDescription>Pega tu lista aquí, una línea por producto.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Textarea
                            autoFocus
                            placeholder="Leche&#10;Pan&#10;Huevos..."
                            value={importText}
                            onChange={(e) => setImportText(e.target.value)}
                            rows={5}
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="ghost" onClick={() => setIsImporting(false)}>Cancelar</Button>
                            <Button onClick={handleImport}>Importar</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-lg font-semibold text-white">Mis Listas</h2>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/70 hover:text-white hover:bg-white/10"
                        onClick={() => onNavigate('store')}
                    >
                        <Store className="w-4 h-4 mr-2" />
                        Tiendas
                    </Button>
                </div>

                {lists.length === 0 ? (
                    <div className="text-center py-10 text-white/50 bg-white/5 rounded-xl border border-white/10">
                        <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No tienes listas activas</p>
                    </div>
                ) : (
                    lists.map((list) => (
                        <div
                            key={list.id}
                            onClick={() => onNavigate('list', { listId: list.id })}
                            className="group relative flex items-center justify-between p-4 bg-white/80 hover:bg-white backdrop-blur-md rounded-xl shadow-sm border border-white/40 cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <div>
                                <h3 className="font-semibold text-slate-800">{list.name}</h3>
                                <p className="text-sm text-slate-500">
                                    {new Date(list.createdAt).toLocaleDateString()} • {list.items.length} items
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={(e) => handleDelete(e, list.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <ChevronRight className="w-5 h-5 text-slate-400" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
