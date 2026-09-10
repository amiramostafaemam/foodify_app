import { vars } from "nativewind";

/**
 * Semantic colour tokens. Components use the Tailwind classes that map to these
 * (`bg-canvas`, `text-content`, `border-line`, …) and never hard-code light/dark
 * values. Values are "R G B" triples so Tailwind's `/opacity` modifiers work.
 */
export const lightVars = vars({
  "--bg": "255 255 255", // screen background
  "--surface": "245 245 244", // soft fills, inputs, inactive chips
  "--card": "255 255 255", // cards sitting on the background
  "--elevated": "255 255 255", // modals, sheets, the tab bar
  "--content": "24 28 46", // primary text / icons
  "--muted": "135 135 135", // secondary text
  "--line": "0 0 0", // borders & dividers (used at low opacity)
  "--cream": "243 233 218", // warm promo surface
  "--hero-1": "255 231 196", // product hero gradient — warm top
  "--hero-2": "255 243 225",
});

export const darkVars = vars({
  "--bg": "15 17 21",
  "--surface": "26 29 35",
  "--card": "23 26 31",
  "--elevated": "30 33 39",
  "--content": "243 244 246",
  "--muted": "154 160 166",
  "--line": "255 255 255",
  "--cream": "42 34 24",
  "--hero-1": "42 30 16",
  "--hero-2": "28 24 16",
});

/** Raw colours for places that can't use classes (gradients, icon props). */
export const palette = {
  light: {
    content: "#181C2E",
    muted: "#878787",
    canvas: "#FFFFFF",
    card: "#FFFFFF",
    hero: ["#FFE7C4", "#FFF3E1", "#FFFFFF"] as const,
  },
  dark: {
    content: "#F3F4F6",
    muted: "#9AA0A6",
    canvas: "#0F1115",
    card: "#171A1F",
    hero: ["#2A1E10", "#1C1810", "#0F1115"] as const,
  },
};
