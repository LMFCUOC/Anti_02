export type SectionId = string;
export type StoreId = string;
export type ListId = string;
export type ItemId = string;

export interface Section {
    id: SectionId;
    name: string;
    icon: string; // Emoji or Lucide icon name
    defaultOrder: number;
}

export interface StoreProfile {
    id: StoreId;
    name: string;
    sections: SectionId[]; // Ordered list of section IDs
}

export interface ListItem {
    id: ItemId;
    listId: ListId;
    name: string;
    quantity?: string;
    note?: string;
    sectionId: SectionId;
    isCompleted: boolean;
    isFrequent: boolean;
}

export interface ShoppingList {
    id: ListId;
    name: string;
    createdAt: number; // Timestamp
    updatedAt: number;
    status: 'active' | 'archived';
    storeId?: StoreId; // Preferred store for sorting
    items: ListItem[];
}

export interface AppState {
    stores: StoreProfile[];
    lists: ShoppingList[];
    sections: Record<SectionId, Section>; // Normalized sections
    activeListId: ListId | null;

    // Actions
    addList: (name: string) => void;
    updateList: (id: ListId, updates: Partial<ShoppingList>) => void;
    deleteList: (id: ListId) => void;
    setActiveList: (id: ListId | null) => void;

    addItem: (listId: ListId, name: string, sectionId?: SectionId) => void;
    updateItem: (listId: ListId, itemId: ItemId, updates: Partial<ListItem>) => void;
    deleteItem: (listId: ListId, itemId: ItemId) => void;
    toggleItemComplete: (listId: ListId, itemId: ItemId) => void;

    addStore: (name: string) => void;
    updateStore: (id: StoreId, updates: Partial<StoreProfile>) => void;
    reorderStoreSections: (storeId: StoreId, newSectionsOrder: SectionId[]) => void;

    importListFromText: (text: string) => void;
}
