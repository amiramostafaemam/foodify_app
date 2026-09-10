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
  "--bg": "22 21 20", // #161514 warm near-black
  "--surface": "37 34 32", // #252220
  "--card": "31 29 27", // #1F1D1B
  "--elevated": "44 40 37", // #2C2825
  "--content": "241 239 236", // #F1EFEC soft off-white
  "--muted": "165 160 154", // #A5A09A warm grey
  "--line": "255 255 255",
  "--cream": "44 35 26", // #2C231A
  "--hero-1": "56 39 22", // #382716
  "--hero-2": "34 28 21", // #221C15
});

/** Raw colours for places that can't use classes (gradients, icon props). */
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
    card: "#1F1D1B",
    surface: "#252220",
    hero: ["#382716", "#221C15", "#161514"] as const,
  },
};
