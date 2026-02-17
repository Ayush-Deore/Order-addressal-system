import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
    uniqueId: string; // generated UUID
    productId: string;
    productName: string;
    designCode: string;
    image?: string;
    category: string;

    // Requirements
    height: number;
    width: number;
    thickness: number;
    quantity: number;
    openingDirection: string;
    frameRequired: boolean;
    finishPreference: string;
    notes?: string;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (uniqueId: string) => void;
    updateItem: (uniqueId: string, updates: Partial<CartItem>) => void;
    clearCart: () => void;
}

export const useCart = create<CartState>()(
    persist(
        (set) => ({
            items: [],
            addItem: (item) => set((state) => ({ items: [...state.items, item] })),
            removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.uniqueId !== id) })),
            updateItem: (id, updates) => set((state) => ({
                items: state.items.map((i) => (i.uniqueId === id ? { ...i, ...updates } : i))
            })),
            clearCart: () => set({ items: [] }),
        }),
        { name: 'door-cart-storage' }
    )
);
