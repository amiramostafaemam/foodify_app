// constants/onboarding.ts
export const onboardingSlides = [
  {
    id: "1",
    // All three photos are now genuine transparent cutouts (no baked-in
    // background), so the page behind each one is a free choice rather
    // than something forced by the source image. Warm, light creams —
    // close in family but each nudged toward its own photo's palette —
    // let the food itself stay the star instead of competing with a
    // dark backdrop.
    image: require("@/assets/images/onboarding-1.png"),
    title: "Discover great food",
    description: "Find your favorite meals from top restaurants near you",
    bg: "#FCEFE0",
    dark: false,
  },
  {
    id: "2",
    image: require("@/assets/images/onboarding-2.png"),
    title: "Fast & easy ordering",
    description: "Order in seconds and track your food in real time",
    bg: "#FDEEDD",
    dark: false,
  },
  {
    id: "3",
    image: require("@/assets/images/onboarding-3.png"),
    title: "Quick delivery",
    description: "Fresh food delivered to your door",
    bg: "#FBF3E7",
    dark: false,
  },
];
