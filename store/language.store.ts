import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Language = "en" | "ar";

type LanguageState = {
  language: Language;
  setLanguage: (l: Language) => void;
};

/**
 * Persisted UI language. Full Arabic translation + RTL layout land in a later
 * pass; this stores the choice so it's ready when they do.
 */
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => set({ language }),
    }),
    {
      name: "foodify-language",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
