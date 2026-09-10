import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type NotificationType = "order" | "offer" | "delivery" | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: number; // epoch ms
  read: boolean;
}

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

/**
 * First-launch content so the screen is never empty in a portfolio demo. These
 * are persisted after the first run, so marking them read / clearing them
 * sticks.
 */
const seed = (): AppNotification[] => {
  const now = Date.now();
  return [
    {
      id: "seed-welcome",
      type: "system",
      title: "Welcome to Foodify 👋",
      body: "Your first delivery is on us — order anything over $30 and delivery is free.",
      createdAt: now - 2 * HOUR,
      read: false,
    },
    {
      id: "seed-offer",
      type: "offer",
      title: "Summer Combo · 38% off",
      body: "Beef burger, fries and an ice-cold drink for $9.99. This week only.",
      createdAt: now - 8 * HOUR,
      read: false,
    },
    {
      id: "seed-delivery",
      type: "delivery",
      title: "Faster deliveries near you",
      body: "We added two new riders in your area — most orders now arrive in under 25 min.",
      createdAt: now - 2 * DAY,
      read: true,
    },
  ];
};

const genId = () => `n-${Date.now()}-${Math.round(Math.random() * 1e9)}`;

type NotificationsState = {
  items: AppNotification[];
  add: (n: Pick<AppNotification, "type" | "title" | "body">) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  remove: (id: string) => void;
  clearAll: () => void;
};

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      items: seed(),

      add: (n) =>
        set({
          items: [
            { ...n, id: genId(), createdAt: Date.now(), read: false },
            ...get().items,
          ],
        }),

      markRead: (id) =>
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, read: true } : i,
          ),
        }),

      markAllRead: () =>
        set({ items: get().items.map((i) => ({ ...i, read: true })) }),

      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

      clearAll: () => set({ items: [] }),
    }),
    {
      name: "foodify-notifications",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

export const selectUnreadCount = (s: NotificationsState) =>
  s.items.reduce((n, i) => (i.read ? n : n + 1), 0);
