import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Header } from '@/components/layout/Header'
import { Home } from '@/components/features/lists/Home'
import { ListDetail } from '@/components/features/lists/ListDetail'
import { ShoppingMode } from '@/components/features/shopping/ShoppingMode'
import { StoreList } from '@/components/features/store/StoreList'
import { StoreEdit } from '@/components/features/store/StoreEdit'

type Screen = 'home' | 'list' | 'shopping' | 'store' | 'store-edit';

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [params, setParams] = useState<any>({})

  const navigate = (newScreen: Screen, newParams?: any) => {
    setScreen(newScreen)
    if (newParams) setParams(newParams)
  }

  return (
    <AppShell>
      {screen === 'home' && <Header />}

      <main className="flex-1 p-4 overflow-hidden flex flex-col">
        {screen === 'home' && <Home onNavigate={navigate} />}
        {screen === 'list' && <ListDetail listId={params.listId} onNavigate={navigate} />}
        {screen === 'shopping' && <ShoppingMode listId={params.listId} onNavigate={navigate} />}
        {screen === 'store' && <StoreList onNavigate={navigate} />}
        {screen === 'store-edit' && <StoreEdit storeId={params.storeId} onNavigate={navigate} />}
      </main>
    </AppShell>
  )
}

export default App
