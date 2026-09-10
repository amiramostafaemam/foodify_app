// constants/offers.constants.ts
import { images } from "@/constants";

export interface Offer {
  id: string;
  title: string;
  description: string;
  image: number; // local transparent PNG (require)
  color: string; // promo-card background / accent
  originalPrice: number;
  discountedPrice: number;
  discount: number; // Percentage
  items: OfferItem[];
  rating: number;
  deliveryTime: string;
}

export interface OfferItem {
  name: string;
  quantity: number;
}

/**
 * Demo offers run on a rolling window so they never look expired. Anchored once
 * per app launch, valid for the next two weeks.
 */
const VALID_DAYS = 14;
const VALID_UNTIL = (() => {
  const d = new Date();
  d.setHours(23, 59, 59, 0);
  d.setDate(d.getDate() + VALID_DAYS);
  return d;
})();

export const getOfferValidity = () => {
  const daysLeft = Math.max(
    1,
    Math.ceil((VALID_UNTIL.getTime() - Date.now()) / 86_400_000),
  );
  return {
    daysLeft,
    date: VALID_UNTIL.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
  };
};

export const OFFERS_DATA: Offer[] = [
  {
    id: "summer-combo",
    title: "Summer Combo",
    description:
      "Beat the heat with our refreshing Summer Combo! Enjoy a juicy beef burger, crispy fries, and an ice-cold drink — the perfect meal for sunny days.",
    image: images.burgerOne,
    color: "#E4572E",
    originalPrice: 15.99,
    discountedPrice: 9.99,
    discount: 38,
    items: [
      { name: "Beef Burger", quantity: 2 },
      { name: "Large Fries", quantity: 2 },
      { name: "Soft Drink (500ml)", quantity: 2 },
    ],
    rating: 4.7,
    deliveryTime: "20-30 mins",
  },
  {
    id: "burger-bash",
    title: "Burger Bash",
    description:
      "Double the burger, double the fun! Get two premium juicy burgers loaded with cheese, bacon, and fresh veggies. Perfect for sharing or for the burger lover in you!",
    image: images.burgerTwo,
    color: "#C7451B",
    originalPrice: 22.99,
    discountedPrice: 14.99,
    discount: 35,
    items: [
      { name: "Premium Beef Burger", quantity: 2 },
      { name: "Cheese Slices", quantity: 4 },
      { name: "Bacon Strips", quantity: 4 },
      { name: "Soft Drink", quantity: 2 },
    ],
    rating: 4.8,
    deliveryTime: "25-35 mins",
  },
  {
    id: "pizza-party",
    title: "Pizza Party",
    description:
      "Party time starts here! A large pizza loaded with your favorite toppings, served with garlic bread and a refreshing drink. Perfect for family nights or hanging out with friends!",
    image: images.pizzaOne,
    color: "#1D6152",
    originalPrice: 24.99,
    discountedPrice: 16.99,
    discount: 32,
    items: [
      { name: 'Large Pizza (12")', quantity: 2 },
      { name: "Garlic Bread", quantity: 4 },
      { name: "Mozzarella Sticks", quantity: 6 },
      { name: "Soft Drink (1L)", quantity: 2 },
    ],
    rating: 4.9,
    deliveryTime: "30-40 mins",
  },
  {
    id: "burrito-delight",
    title: "Burrito Delight",
    description:
      "Spice up your day with our authentic Mexican burrito! Packed with seasoned beef, rice, beans, cheese, and fresh salsa. Comes with crispy tortilla chips and guacamole!",
    image: images.buritto,
    color: "#B26A00",
    originalPrice: 18.99,
    discountedPrice: 12.99,
    discount: 32,
    items: [
      { name: "Beef Burrito", quantity: 2 },
      { name: "Mexican Rice", quantity: 3 },
      { name: "Refried Beans", quantity: 2 },
      { name: "Tortilla Chips", quantity: 3 },
      { name: "Guacamole", quantity: 4 },
    ],
    rating: 4.6,
    deliveryTime: "25-35 mins",
  },
];

export const getOfferById = (id: string): Offer | undefined =>
  OFFERS_DATA.find((offer) => offer.id === id);

export const calculateSavings = (offer: Offer): number =>
  offer.originalPrice - offer.discountedPrice;
