import AsyncStorage from "@react-native-async-storage/async-storage";
import { colorScheme } from "nativewind";
import { Appearance } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedScheme = "light" | "dark";

const systemScheme = (): ResolvedScheme =>
  Appearance.getColorScheme() === "dark" ? "dark" : "light";

const resolve = (mode: ThemeMode): ResolvedScheme =>
  mode === "dark" ? "dark" : mode === "light" ? "light" : systemScheme();

/** Push the choice into NativeWind so every semantic class flips app-wide. */
const applyScheme = (mode: ThemeMode) => {
  try {
    colorScheme.set(mode);
  } catch {
    // colorScheme may not be ready during the very first module eval
  }
};

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

      setMode: (mode) => {
        applyScheme(mode);
        set({ mode, scheme: resolve(mode) });
      },

      toggle: () => {
        const next: ResolvedScheme =
          get().scheme === "dark" ? "light" : "dark";
        applyScheme(next);
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
        if (state) {
          applyScheme(state.mode);
          state.scheme = resolve(state.mode);
        }
      },
    },
  ),
);

// Apply the default before rehydration completes, then follow OS changes.
applyScheme(useThemeStore.getState().mode);
Appearance.addChangeListener(() => useThemeStore.getState().syncSystem());

export const selectScheme = (s: ThemeState) => s.scheme;
