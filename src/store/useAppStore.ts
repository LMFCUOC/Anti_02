import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { AppState, ListItem, ShoppingList, StoreProfile } from '@/types';
import { DEFAULT_SECTIONS, INITIAL_STORE, PRODUCT_CATEGORY_MAP } from '@/lib/constants';

// Helper to normalize sections
const normalizedSections = DEFAULT_SECTIONS.reduce((acc, section) => {
    acc[section.id] = section;
    return acc;
}, {} as Record<string, typeof DEFAULT_SECTIONS[0]>);

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            stores: [INITIAL_STORE],
            lists: [],
            sections: normalizedSections,
            activeListId: null,
            customCategoryMappings: {},

            addList: (name) => {
                const newList: ShoppingList = {
                    id: uuidv4(),
                    name,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    status: 'active',
                    items: [],
                    storeId: get().stores[0]?.id, // Default to first store
                };
                set((state) => ({ lists: [newList, ...state.lists], activeListId: newList.id }));
            },

            updateList: (id, updates) => {
                set((state) => ({
                    lists: state.lists.map((l) => (l.id === id ? { ...l, ...updates, updatedAt: Date.now() } : l)),
                }));
            },

            deleteList: (id) => {
                set((state) => ({
                    lists: state.lists.filter((l) => l.id !== id),
                    activeListId: state.activeListId === id ? null : state.activeListId,
                }));
            },

            setActiveList: (id) => set({ activeListId: id }),

            addItem: (listId, name, sectionId) => {
                // Auto-categorize if no section provided
                let assignedSectionId = sectionId || 'sec_other';
                if (!sectionId) {
                    const lowerName = name.toLowerCase();
                    const customMappings = get().customCategoryMappings;

                    // Check custom mappings first (user learned categories)
                    let found = false;
                    for (const [key, secId] of Object.entries(customMappings)) {
                        if (lowerName.includes(key.toLowerCase())) {
                            assignedSectionId = secId;
                            found = true;
                            break;
                        }
                    }

                    // Fall back to default mappings
                    if (!found) {
                        for (const [key, secId] of Object.entries(PRODUCT_CATEGORY_MAP)) {
                            if (lowerName.includes(key)) {
                                assignedSectionId = secId;
                                break;
                            }
                        }
                    }
                }

                const newItem: ListItem = {
                    id: uuidv4(),
                    listId,
                    name,
                    sectionId: assignedSectionId,
                    isCompleted: false,
                    isFrequent: false,
                };

                set((state) => ({
                    lists: state.lists.map((l) =>
                        l.id === listId ? { ...l, items: [...l.items, newItem], updatedAt: Date.now() } : l
                    ),
                }));
            },

            updateItem: (listId, itemId, updates) => {
                set((state) => ({
                    lists: state.lists.map((l) =>
                        l.id === listId
                            ? {
                                ...l,
                                items: l.items.map((i) => (i.id === itemId ? { ...i, ...updates } : i)),
                                updatedAt: Date.now(),
                            }
                            : l
                    ),
                }));
            },

            deleteItem: (listId, itemId) => {
                set((state) => ({
                    lists: state.lists.map((l) =>
                        l.id === listId
                            ? { ...l, items: l.items.filter((i) => i.id !== itemId), updatedAt: Date.now() }
                            : l
                    ),
                }));
            },

            toggleItemComplete: (listId, itemId) => {
                set((state) => ({
                    lists: state.lists.map((l) =>
                        l.id === listId
                            ? {
                                ...l,
                                items: l.items.map((i) =>
                                    i.id === itemId ? { ...i, isCompleted: !i.isCompleted } : i
                                ),
                                updatedAt: Date.now(),
                            }
                            : l
                    ),
                }));
            },

            addStore: (name) => {
                const newStore: StoreProfile = {
                    id: uuidv4(),
                    name,
                    sections: DEFAULT_SECTIONS.map((s) => s.id),
                };
                set((state) => ({ stores: [...state.stores, newStore] }));
            },

            updateStore: (id, updates) => {
                set((state) => ({
                    stores: state.stores.map((s) => (s.id === id ? { ...s, ...updates } : s)),
                }));
            },

            reorderStoreSections: (storeId, newSectionsOrder) => {
                set((state) => ({
                    stores: state.stores.map((s) =>
                        s.id === storeId ? { ...s, sections: newSectionsOrder } : s
                    ),
                }));
            },

            importListFromText: (text) => {
                const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
                if (lines.length === 0) return;

                const newListId = uuidv4();
                const newList: ShoppingList = {
                    id: newListId,
                    name: `Importada ${new Date().toLocaleDateString()}`,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    status: 'active',
                    items: [],
                    storeId: get().stores[0]?.id,
                };

                // Create items logic (duplicated from addItem but batched)
                const customMappings = get().customCategoryMappings;
                const newItems: ListItem[] = lines.map(line => {
                    let assignedSectionId = 'sec_other';
                    const lowerName = line.toLowerCase();

                    // Check custom mappings first (user learned categories)
                    let found = false;
                    for (const [key, secId] of Object.entries(customMappings)) {
                        if (lowerName.includes(key.toLowerCase())) {
                            assignedSectionId = secId;
                            found = true;
                            break;
                        }
                    }

                    // Fall back to default mappings
                    if (!found) {
                        for (const [key, secId] of Object.entries(PRODUCT_CATEGORY_MAP)) {
                            if (lowerName.includes(key)) {
                                assignedSectionId = secId;
                                break;
                            }
                        }
                    }
                    return {
                        id: uuidv4(),
                        listId: newListId,
                        name: line,
                        sectionId: assignedSectionId,
                        isCompleted: false,
                        isFrequent: false,
                    };
                });

                newList.items = newItems;
                set((state) => ({ lists: [newList, ...state.lists], activeListId: newListId }));
            },

            updateItemCategory: (listId, itemId, newSectionId, learnMapping) => {
                const list = get().lists.find(l => l.id === listId);
                const item = list?.items.find(i => i.id === itemId);

                if (!item) return;

                // Update the item's category
                set((state) => ({
                    lists: state.lists.map((l) =>
                        l.id === listId
                            ? {
                                ...l,
                                items: l.items.map((i) => (i.id === itemId ? { ...i, sectionId: newSectionId } : i)),
                                updatedAt: Date.now(),
                            }
                            : l
                    ),
                    // If learning, save the mapping using item name as key
                    ...(learnMapping ? {
                        customCategoryMappings: {
                            ...state.customCategoryMappings,
                            [item.name.toLowerCase()]: newSectionId
                        }
                    } : {})
                }));
            }
        }),
        {
            name: 'mercadona-flow-storage',
        }
    )
);
