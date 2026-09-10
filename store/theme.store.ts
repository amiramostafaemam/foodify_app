import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedScheme = "light" | "dark";

const systemScheme = (): ResolvedScheme =>
  Appearance.getColorScheme() === "dark" ? "dark" : "light";

const resolve = (mode: ThemeMode): ResolvedScheme =>
  mode === "dark" ? "dark" : mode === "light" ? "light" : systemScheme();

type ThemeState = {
  mode: ThemeMode;
  scheme: ResolvedScheme;
  setMode: (mode: ThemeMode) => void;
  toggle: () => void;
  /** internal — keep `scheme` in sync when the OS theme changes */
  syncSystem: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: "system",
      scheme: systemScheme(),

      setMode: (mode) => set({ mode, scheme: resolve(mode) }),

      toggle: () => {
        const next: ResolvedScheme =
          get().scheme === "dark" ? "light" : "dark";
        set({ mode: next, scheme: next });
      },

      syncSystem: () => {
        if (get().mode === "system") set({ scheme: systemScheme() });
      },
    }),
    {
      name: "foodify-theme",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ mode: s.mode }),
      onRehydrateStorage: () => (state) => {
        if (state) state.scheme = resolve(state.mode);
      },
    },
  ),
);

// Follow OS theme changes while in "system" mode.
Appearance.addChangeListener(() => useThemeStore.getState().syncSystem());

export const selectScheme = (s: ThemeState) => s.scheme;
