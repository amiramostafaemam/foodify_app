// constants/index.ts
import arrowBack from "@/assets/icons/arrow-back.png";
import arrowDown from "@/assets/icons/arrow-down.png";
import arrowRight from "@/assets/icons/arrow-right.png";
import bag from "@/assets/icons/bag.png";
import check from "@/assets/icons/check.png";
import clock from "@/assets/icons/clock.png";
import dollar from "@/assets/icons/dollar.png";
import envelope from "@/assets/icons/envelope.png";
import home from "@/assets/icons/home.png";
import location from "@/assets/icons/location.png";
import logout from "@/assets/icons/logout.png";
import minus from "@/assets/icons/minus.png";
import pencil from "@/assets/icons/pencil.png";
import person from "@/assets/icons/person.png";
import phone from "@/assets/icons/phone.png";
import plus from "@/assets/icons/plus.png";
import search from "@/assets/icons/search.png";
import star from "@/assets/icons/star.png";
import trash from "@/assets/icons/trash.png";
import user from "@/assets/icons/user.png";
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
import loginGraphic from "@/assets/images/login-graphic.png";
import logo from "@/assets/images/logo.png";
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
import signupGraphic from "@/assets/images/signup-graphic.png";
import success from "@/assets/images/success.png";
import successs from "@/assets/images/successs.png";
import tea from "@/assets/images/tea.png";
import tomatoes from "@/assets/images/tomatoes.png";
import notfound from "@/assets/images/not-found.png";
import canceled from "@/assets/images/canceled.png";

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
  loginGraphic,
  signupGraphic,
  logo,
  mozarellaSticks,
  mushrooms,
  onionRings,
  onions,
  pizzaOne,
  salad,
  success,
  successs,
  canceled,
  tomatoes,
  arrowBack,
  arrowDown,
  arrowRight,
  bag,
  check,
  clock,
  dollar,
  envelope,
  home,
  location,
  logout,
  minus,
  pencil,
  person,
  phone,
  plus,
  search,
  star,
  trash,
  user,
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
