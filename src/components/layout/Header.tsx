
import { ShoppingBasket } from "lucide-react"

export function Header() {
    return (
        <header className="p-6 pb-4 border-b border-white/10 flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md shadow-sm">
                <ShoppingBasket className="w-6 h-6 text-white" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Mercadona Flow</h1>
                <p className="text-xs text-white/70 font-medium">Compra rápida y ordenada</p>
            </div>
        </header>
    )
}
