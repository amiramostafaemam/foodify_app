import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type FavoriteKind = "menu" | "offer";

export interface FavoriteItem {
  id: string;
  kind: FavoriteKind;
  name: string;
  image: string;
  price: number;
}

type FavoritesState = {
  items: FavoriteItem[];
  toggle: (item: FavoriteItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
};

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],

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
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export const selectFavoriteCount = (s: FavoritesState) => s.items.length;
