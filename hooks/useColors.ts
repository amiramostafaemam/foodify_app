import { palette } from "@/constants/theme";
import { selectScheme, useThemeStore } from "@/store/theme.store";

/**
 * Raw theme colours for props that can't take a Tailwind class — icon `color`,
 * `LinearGradient` stops, `placeholderTextColor`, etc. Anything that can use a
 * class should use the semantic tokens (`text-content`, `bg-card`, …) instead.
 */
export const useColors = () => palette[useThemeStore(selectScheme)];
