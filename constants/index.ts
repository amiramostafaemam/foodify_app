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
import buritto from "@/assets/images/buritto.png";
import cheese from "@/assets/images/cheese.png";
import chicken from "@/assets/images/chicken.png";
import chocolava from "@/assets/images/chocolava.png";
import coke from "@/assets/images/coke.png";
import coleslaw from "@/assets/images/coleslaw.png";
import corn from "@/assets/images/corn.png";
import emptyState from "@/assets/images/empty-state.png";
import fries from "@/assets/images/fries.png";
import grilledOnion from "@/assets/images/grilledonions.png";
import jalapeno from "@/assets/images/jalapeno.png";
import loginGraphic from "@/assets/images/login-graphic.png";
import Logo from "@/assets/images/logo.svg";
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
import tea from "@/assets/images/tea.png";
import tomatoes from "@/assets/images/tomatoes.png";

export const CATEGORIES = [
  {
    id: "1",
    name: "All",
  },
  {
    id: "2",
    name: "Burger",
  },
  {
    id: "3",
    name: "Pizza",
  },
  {
    id: "4",
    name: "Wrap",
  },
  {
    id: "5",
    name: "Burrito",
  },
];

export const offers = [
  {
    id: 1,
    title: "SUMMER COMBO",
    image: burgerOne,
    color: "#D33B0D",
  },
  {
    id: 2,
    title: "BURGER BASH",
    image: burgerTwo,
    color: "#DF5A0C",
  },
  {
    id: 3,
    title: "PIZZA PARTY",
    image: pizzaOne,
    color: "#084137",
  },
  {
    id: 4,
    title: "BURRITO DELIGHT",
    image: buritto,
    color: "#EB920C",
  },
];

export const images = {
  avatar,
  avocado,
  bacon,
  burgerOne,
  burgerTwo,
  buritto,
  cheese,
  coleslaw,
  pickles,
  emptyState,
  fries,
  loginGraphic,
  signupGraphic,
  Logo,
  mozarellaSticks,
  mushrooms,
  onionRings,
  onions,
  pizzaOne,
  salad,
  success,
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
};

export const getCustomizationImage = (name: string) => {
  const normalizedName = name.toLowerCase().replace(/\s+/g, "");

  const imageMap: { [key: string]: any } = {
    avocado: avocado,
    bacon: bacon,
    cheese: cheese,
    pickles: pickles,
    mushrooms: mushrooms,
    onions: onions,
    tomatoes: tomatoes,
    fries: fries,
    onionrings: onionRings,
    mozarellasticks: mozarellaSticks,
    mozzarellasticks: mozarellaSticks,
    coleslaw: coleslaw,
    salad: salad,
    coke: coke,
    olives: olives,
    potatowedges: potato,
    chickennuggets: chicken,
    jalapeños: jalapeno,
    icedtea: tea,
    garlicbread: bread,
    sweetcorn: corn,
    chocolavacake: chocolava,
    rice: rice,
    beans: beans,
    pepperoni: pepperoni,
    grilledonions: grilledOnion,
  };

  return imageMap[normalizedName] || null;
};
