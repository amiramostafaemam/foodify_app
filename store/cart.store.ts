// store/cart.store.ts
import { CartCustomization, CartStore } from "@/type";
import { create } from "zustand";

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item) => {
    set({
      items: [
        ...get().items,
        {
          ...item,
          quantity: 1,
          customizations: item.customizations ?? [],
        },
      ],
    });
  },

  removeItem: (cartItemId) => {
    set({
      items: get().items.filter((i) => i.cartItemId !== cartItemId),
    });
  },

  increaseQty: (cartItemId) => {
    set({
      items: get().items.map((i) =>
        i.cartItemId === cartItemId ? { ...i, quantity: i.quantity + 1 } : i
      ),
    });
  },

  decreaseQty: (cartItemId) => {
    set({
      items: get()
        .items.map((i) =>
          i.cartItemId === cartItemId ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0),
    });
  },

  clearCart: () => set({ items: [] }),

  getTotalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),

  getTotalPrice: () =>
    get().items.reduce((total, item) => {
      const base = item.price;
      const customPrice =
        item.customizations?.reduce(
          (s: number, c: CartCustomization) => s + c.price,
          0
        ) ?? 0;
      return total + item.quantity * (base + customPrice);
    }, 0),
}));
