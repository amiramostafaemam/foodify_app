/**
 * Raw colours for the few places that can't use a Tailwind class — icon `color`
 * props, `LinearGradient` stops, `placeholderTextColor`. Everything else uses
 * the semantic classes (`bg-canvas`, `text-content`, …) which flip via the
 * prefers-color-scheme block in global.css.
 */
export const palette = {
  light: {
    content: "#181C2E",
    muted: "#878787",
    canvas: "#FFFFFF",
    card: "#FFFFFF",
    surface: "#F5F5F4",
    hero: ["#FFE7C4", "#FFF3E1", "#FFFFFF"] as const,
  },
  dark: {
    content: "#F1EFEC",
    muted: "#A5A09A",
    canvas: "#161514",
    card: "#201E1B",
    surface: "#272421",
    hero: ["#3A2716", "#221C15", "#161514"] as const,
  },
};
