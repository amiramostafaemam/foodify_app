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
  "--bg": "22 21 19", // #161513 warm near-black
  "--surface": "38 35 32", // #262320
  "--card": "31 29 26", // #1F1D1A
  "--elevated": "43 40 36", // #2B2824
  "--content": "240 238 234", // #F0EEEA soft off-white
  "--muted": "162 156 148", // #A29C94 warm grey
  "--line": "255 255 255",
  "--cream": "46 37 27", // #2E251B
  "--hero-1": "51 36 21", // #332415
  "--hero-2": "33 27 20", // #211B14
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
    content: "#F0EEEA",
    muted: "#A29C94",
    canvas: "#161513",
    card: "#1F1D1A",
    surface: "#262320",
    hero: ["#332415", "#211B14", "#161513"] as const,
  },
};
