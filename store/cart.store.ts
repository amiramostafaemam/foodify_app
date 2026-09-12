import AsyncStorage from "@react-native-async-storage/async-storage";
import { CartCustomization, CartStore } from "@/type";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      ownerId: null,

      // A cart cached on this device only ever belongs to one account at a
      // time. If a different user now holds the session, this is stale
      // data left over from someone else who used this device — clear it
      // instead of handing it to the new account. The *same* user logging
      // back in keeps their cart untouched.
      setOwner: (userId) => {
        const { ownerId } = get();
        if (ownerId !== userId) {
          set({ ownerId: userId, items: [] });
        }
      },

      addItem: (item, quantity = 1) => {
        const cartItemId = `${item.id}-${Date.now()}-${Math.round(
          Math.random() * 1e9,
        )}`;
        set({
          items: [
            ...get().items,
            {
              ...item,
              cartItemId,
              quantity,
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
            i.cartItemId === cartItemId
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        });
      },

      decreaseQty: (cartItemId) => {
        set({
          items: get()
            .items.map((i) =>
              i.cartItemId === cartItemId
                ? { ...i, quantity: i.quantity - 1 }
                : i,
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
              0,
            ) ?? 0;
          return total + item.quantity * (base + customPrice);
        }, 0),
    }),
    {
      name: "foodify-cart",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items, ownerId: state.ownerId }),
    },
  ),
);
