import { OFFERS_DATA } from "@/constants/offers.constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type NotificationType = "order" | "offer" | "delivery" | "system";

// Where tapping a notification should take you — kept as a small closed set
// (rather than a raw router pathname) so the notifications screen can build
// a type-safe expo-router target without stringly-typed routes.
export type NotificationLink =
  | { kind: "order"; orderId: string }
  | { kind: "offer"; offerId: string };

/**
 * title/body are lib/i18n.ts translation keys (+ optional interpolation
 * vars), not final display strings — so a notification created while the
 * app was in English still reads correctly if the user later switches to
 * Arabic. The notifications screen translates them at render time.
 */
export interface AppNotification {
  id: string;
  type: NotificationType;
  titleKey: string;
  titleVars?: Record<string, string | number>;
  bodyKey: string;
  bodyVars?: Record<string, string | number>;
  createdAt: number; // epoch ms
  read: boolean;
  link?: NotificationLink;
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
      titleKey: "notif.seedWelcomeTitle",
      bodyKey: "notif.seedWelcomeBody",
      createdAt: now - 2 * HOUR,
      read: false,
    },
    {
      id: "seed-offer",
      type: "offer",
      titleKey: "notif.seedOfferTitle",
      bodyKey: "notif.seedOfferBody",
      createdAt: now - 8 * HOUR,
      read: false,
      link: OFFERS_DATA[0]
        ? { kind: "offer", offerId: OFFERS_DATA[0].id }
        : undefined,
    },
    {
      id: "seed-delivery",
      type: "delivery",
      titleKey: "notif.seedDeliveryTitle",
      bodyKey: "notif.seedDeliveryBody",
      createdAt: now - 2 * DAY,
      read: true,
    },
  ];
};

const genId = () => `n-${Date.now()}-${Math.round(Math.random() * 1e9)}`;

type NewNotification = Pick<
  AppNotification,
  "type" | "titleKey" | "bodyKey" | "titleVars" | "bodyVars" | "link"
>;

type NotificationsState = {
  items: AppNotification[];
  add: (n: NewNotification) => void;
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
      // v1 stored final display strings (title/body); v2 stores i18n keys
      // instead so notifications re-translate when the language changes.
      // Old persisted items don't map to any key, so just reseed them.
      version: 2,
      migrate: (persisted) => {
        const items = (persisted as { items?: unknown[] })?.items;
        const isV2 = items?.every(
          (i) => i && typeof i === "object" && "titleKey" in i,
        );
        return { items: isV2 ? items : seed() };
      },
    },
  ),
);

export const selectUnreadCount = (s: NotificationsState) =>
  s.items.reduce((n, i) => (i.read ? n : n + 1), 0);
