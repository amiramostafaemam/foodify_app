import AsyncStorage from "@react-native-async-storage/async-storage";
import { I18nManager } from "react-native";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Language = "en" | "ar";

const applyDirection = (language: Language) => {
  const rtl = language === "ar";
  if (I18nManager.isRTL === rtl) return;
  try {
    I18nManager.allowRTL(rtl);
    I18nManager.forceRTL(rtl);
  } catch {
    // forceRTL only takes full effect after a native reload
  }
};

type LanguageState = {
  language: Language;
  setLanguage: (l: Language) => void;
};

/**
 * Persisted UI language. Text switches instantly; the RTL layout flip needs an
 * app restart (and a dev build to be fully reliable) — the Settings screen
 * tells the user.
 */
export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (language) => {
        applyDirection(language);
        set({ language });
      },
    }),
    {
      name: "foodify-language",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) applyDirection(state.language);
      },
    },
  ),
);
