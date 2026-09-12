// constants/onboarding.ts
export const onboardingSlides = [
  {
    id: "1",
    image: require("@/assets/images/onboarding-1.png"),
    title: "Discover great food",
    description: "Find your favorite meals from top restaurants near you",
    // Matches each photo's own background so it reads as floating on the
    // page instead of sitting in a boxed-in card with a visible seam.
    bg: "#170A08",
    dark: true,
  },
  {
    id: "2",
    image: require("@/assets/images/onboarding-2.png"),
    title: "Fast & easy ordering",
    description: "Order in seconds and track your food in real time",
    bg: "#1B130C",
    dark: true,
  },
  {
    id: "3",
    // This one is a genuine transparent-background cutout (confirmed via
    // its alpha channel), unlike the first two which are JPEGs with a
    // real dark background baked in — so there's no fixed colour it has
    // to match. Giving it the same dark family as the other two keeps
    // the whole onboarding flow visually consistent instead of switching
    // to a light page for this slide alone.
    image: require("@/assets/images/onboarding-3.png"),
    title: "Quick delivery",
    description: "Fresh food delivered to your door",
    bg: "#15100A",
    dark: true,
  },
];
