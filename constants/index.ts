// constants/index.ts
import avatar from "@/assets/images/avatar.png";
import avocado from "@/assets/images/avocado.png";
import bacon from "@/assets/images/bacon.png";
import beans from "@/assets/images/beans.png";
import bread from "@/assets/images/bread.png";
import burgerOne from "@/assets/images/burger-one.png";
import burgerTwo from "@/assets/images/burger-two.png";
import burgerlogin from "@/assets/images/burgerlogin.jpg";
import buritto from "@/assets/images/burrito.png";
import cheese from "@/assets/images/cheese.png";
import chicken from "@/assets/images/chicken.png";
import chocolava from "@/assets/images/chocolava.png";
import coke from "@/assets/images/coke.png";
import coleslaw from "@/assets/images/coleslaw.png";
import corn from "@/assets/images/corn.png";
import emptyState from "@/assets/images/empty-state.png";
import emptycart from "@/assets/images/emptycart.png";
import fries from "@/assets/images/fries.png";
import grilledOnion from "@/assets/images/grilledonions.png";
import jalapeno from "@/assets/images/jalapeno.png";
import logo from "@/assets/images/logo.png";
import logoDark from "@/assets/images/logo-dark.png";
import mozarellaSticks from "@/assets/images/mozarella-sticks.png";
import mushrooms from "@/assets/images/mushrooms.png";
import olives from "@/assets/images/olives.png";
import onionRings from "@/assets/images/onion-rings.png";
import onions from "@/assets/images/onions.png";
import pepperoni from "@/assets/images/pepperoni.png";
import pickles from "@/assets/images/pickles.png";
import pizzaOne from "@/assets/images/pizza-one.png";
import potato from "@/assets/images/potato.png";
import rice from "@/assets/images/rice.png";
import salad from "@/assets/images/salad.png";
import tea from "@/assets/images/tea.png";
import tomatoes from "@/assets/images/tomatoes.png";
import notfound from "@/assets/images/not-found.png";

export const images = {
  avatar,
  avocado,
  bacon,
  burgerOne,
  burgerTwo,
  burgerlogin,
  buritto,
  cheese,
  coleslaw,
  pickles,
  emptyState,
  fries,
  logo,
  logoDark,
  mozarellaSticks,
  mushrooms,
  onionRings,
  onions,
  pizzaOne,
  salad,
  tomatoes,
  coke,
  rice,
  olives,
  potato,
  chicken,
  jalapeno,
  tea,
  bread,
  corn,
  chocolava,
  beans,
  pepperoni,
  grilledOnion,
  emptycart,
  notfound,
};

const customizationImageMap: Record<string, number> = {
  avocado,
  bacon,
  cheese,
  // The seeded topping is actually named "Extra Cheese" (lib/data.ts), not
  // "Cheese" — normalizedName strips spaces but not the word "extra", so
  // this needs its own alias or it silently falls through to null.
  extracheese: cheese,
  pickles,
  mushrooms,
  onions,
  tomatoes,
  fries,
  onionrings: onionRings,
  mozarellasticks: mozarellaSticks,
  mozzarellasticks: mozarellaSticks,
  coleslaw,
  salad,
  coke,
  olives,
  potatowedges: potato,
  chickennuggets: chicken,
  jalapeños: jalapeno,
  icedtea: tea,
  garlicbread: bread,
  sweetcorn: corn,
  chocolavacake: chocolava,
  rice,
  beans,
  pepperoni,
  grilledonions: grilledOnion,
};

export const getCustomizationImage = (name: string): number | null => {
  const normalizedName = name.toLowerCase().replace(/\s+/g, "");
  return customizationImageMap[normalizedName] ?? null;
};
