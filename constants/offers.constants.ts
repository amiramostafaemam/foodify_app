// constants/offers.constants.ts
import { images } from "./index";

export interface Offer {
  id: string;
  title: string;
  description: string;
  image: any; // Local image for cards
  videoUrl: string; // Video URL for details page
  color: string;
  originalPrice: number;
  discountedPrice: number;
  discount: number; // Percentage
  items: OfferItem[];
  rating: number;
  deliveryTime: string;
  validUntil: string;
}

export interface OfferItem {
  name: string;
  quantity: number;
  // Optional emoji or icon
}

export const OFFERS_DATA: Offer[] = [
  {
    id: "summer-combo",
    title: "Summer Combo",
    description:
      "Beat the heat with our refreshing Summer Combo! Enjoy a juicy beef burger, crispy fries, and an ice-cold Pepsi - the perfect meal for sunny days.",
    image: images.burgerOne,
    // High-quality food video from Pexels (burger & drink combo)
    videoUrl: require("@/assets/videos/burger1.mp4"),
    color: "#D33B0D",
    originalPrice: 15.99,
    discountedPrice: 9.99,
    discount: 38,
    items: [
      { name: "Beef Burger", quantity: 2 },
      { name: "Large Fries", quantity: 2 },
      { name: "Pepsi (500ml)", quantity: 2 },
    ],
    rating: 4.7,
    deliveryTime: "20-30 mins",
    validUntil: "Mar 28, 2026",
  },
  {
    id: "burger-bash",
    title: "Burger Bash",
    description:
      "Double the burger, double the fun! Get two premium juicy burgers loaded with cheese, bacon, and fresh veggies. Perfect for sharing or for the burger lover in you!",
    image: images.burgerTwo,
    // Delicious burger making video from Pexels
    videoUrl: require("@/assets/videos/burger.mp4"),
    color: "#DF5A0C",
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
    validUntil: "Mar 28, 2026",
  },
  {
    id: "pizza-party",
    title: "Pizza Party",
    description:
      "Party time starts here! A large pizza loaded with your favorite toppings, served with garlic bread and a refreshing drink. Perfect for family nights or hanging out with friends!",
    image: images.pizzaOne,
    // Pizza making video from Pexels
    videoUrl: require("@/assets/videos/pizza.mp4"),
    color: "#084137",
    originalPrice: 24.99,
    discountedPrice: 16.99,
    discount: 32,
    items: [
      { name: "Large Pizza (12)", quantity: 2 },
      { name: "Garlic Bread", quantity: 4 },
      { name: "Mozzarella Sticks", quantity: 6 },
      { name: "Soft Drink (1L)", quantity: 2 },
    ],
    rating: 4.9,
    deliveryTime: "30-40 mins",
    validUntil: "Mar 28, 2026",
  },
  {
    id: "burrito-delight",
    title: "Burrito Delight",
    description:
      "Spice up your day with our authentic Mexican burrito! Packed with seasoned beef, rice, beans, cheese, and fresh salsa. Comes with crispy tortilla chips and guacamole!",
    image: images.buritto,
    // Mexican food / burrito video from Pexels
    videoUrl: require("@/assets/videos/burrito.mp4"),
    color: "#EB920C",
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
    validUntil: "Mar 28, 2026",
  },
];

// Helper function to get offer by ID
export const getOfferById = (id: string): Offer | undefined => {
  return OFFERS_DATA.find((offer) => offer.id === id);
};

// Helper function to calculate savings
export const calculateSavings = (offer: Offer): number => {
  return offer.originalPrice - offer.discountedPrice;
};
