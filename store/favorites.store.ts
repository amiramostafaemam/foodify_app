import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type FavoriteKind = "menu" | "offer";

export interface FavoriteItem {
  id: string;
  kind: FavoriteKind;
  name: string;
  image: string | number; // remote URL (menu) or bundled require() (offer)
  price: number;
}

type FavoritesState = {
  items: FavoriteItem[];
  // Which Appwrite user this cached list belongs to — see cart.store.ts's
  // `setOwner` for why: without this, a different account signing in on
  // the same device would inherit whatever the previous account favorited.
  ownerId: string | null;
  toggle: (item: FavoriteItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  setOwner: (userId: string | null) => void;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],
      ownerId: null,

      setOwner: (userId) => {
        const { ownerId } = get();
        if (ownerId !== userId) {
          set({ ownerId: userId, items: [] });
        }
      },

      toggle: (item) =>
        set({
          items: get().items.some((i) => i.id === item.id)
            ? get().items.filter((i) => i.id !== item.id)
            : [item, ...get().items],
        }),

      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

      clear: () => set({ items: [] }),

      has: (id) => get().items.some((i) => i.id === id),
    }),
    {
      name: "foodify-favorites",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items, ownerId: state.ownerId }),
    },
  ),
);

export const selectFavoriteCount = (s: FavoritesState) => s.items.length;
