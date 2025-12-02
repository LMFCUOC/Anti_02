import { ArrowLeft, Settings } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StoreListProps {
    onNavigate: (screen: 'home' | 'list' | 'store' | 'store-edit', params?: any) => void;
}

export function StoreList({ onNavigate }: StoreListProps) {
    const { stores } = useAppStore()

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
                <Button variant="ghost" size="icon" onClick={() => onNavigate('home')} className="text-white hover:bg-white/20">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h2 className="text-xl font-bold text-white">Mis Tiendas</h2>
            </div>

            <div className="space-y-4">
                {stores.map(store => (
                    <Card key={store.id} className="bg-white/90 backdrop-blur-xl border-white/50">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between">
                            <CardTitle className="text-lg text-slate-800">{store.name}</CardTitle>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => onNavigate('store-edit', { storeId: store.id })}
                            >
                                <Settings className="w-5 h-5 text-slate-400" />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-slate-500">
                                {store.sections.length} secciones configuradas
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
