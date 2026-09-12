import type { ImageSourcePropType, StyleProp, TextStyle } from "react-native";
import { Models } from "react-native-appwrite";

export interface MenuItem extends Models.Document {
  name: string;
  name_ar?: string;
  price: number;
  image_url: string;
  description: string;
  description_ar?: string;
  calories: number;
  protein: number;
  rating: number;
  type: string;
  categories: Category | string;
}

export interface Category extends Models.Document {
  name: string;
  name_ar?: string;
  description: string;
  description_ar?: string;
}

export interface User extends Models.Document {
  name: string;
  email: string;
  avatar: string;
  accountId: string;
  phone?: string;
  address_home?: string;
  address_work?: string;
}

export interface CartCustomization {
  id: string;
  name: string;
  price: number;
  type: string;
}

export interface CartItemType {
  cartItemId: string; // unique per cart line
  id: string; // menu item id
  name: string;
  price: number;
  image_url: string | number; // remote URL (menu) or bundled require() (offer)
  quantity: number;
  customizations?: CartCustomization[];
}

export interface CartStore {
  items: CartItemType[];
  addItem: (
    item: Omit<CartItemType, "quantity" | "cartItemId">,
    quantity?: number,
  ) => void;
  removeItem: (cartItemId: string) => void;
  increaseQty: (cartItemId: string) => void;
  decreaseQty: (cartItemId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

interface TabBarIconProps {
  focused: boolean;
  icon: ImageSourcePropType;
  title: string;
}

interface PaymentInfoStripeProps {
  label: string;
  value: string;
  labelStyle?: string;
  valueStyle?: string;
}

interface CustomButtonProps {
  onPress?: () => void;
  title?: string;
  style?: string;
  leftIcon?: React.ReactNode;
  textStyle?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

interface CustomHeaderProps {
  title?: string;
  style?: string;
}

export interface CustomInputProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  secureTextEntry?: boolean;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "number-pad"
    | "decimal-pad";
  containerStyle?: string;
  inputStyle?: StyleProp<TextStyle>;
}

interface ProfileFieldProps {
  label: string;
  value: string;
  icon: ImageSourcePropType;
}

interface CreateUserParams {
  email: string;
  password: string;
  name: string;
}

interface SignInParams {
  email: string;
  password: string;
}

export interface GetMenuParams {
  category?: string;
  query?: string;
  limit?: number;
  [key: string]: string | number | undefined;
}

export interface UpdateUserParams {
  userId: string;
  name?: string;
  phone?: string;
  address_home?: string;
  address_work?: string;
  avatar?: string;
}

export interface Customization extends Models.Document {
  name: string;
  price: number;
  type: "topping" | "side";
  menu: string;
  customization: string;
}

export interface MenuCustomization extends Models.Document {
  menu: string;
  customization: {
    $id: string;
    name: string;
    price: number;
    type: "topping" | "side";
  };
  customization_name: string;
  customization_price: number;
  customization_type: "topping" | "side";
}

export interface CustomizationOption {
  id: string;
  name: string;
  price: number;
  type: "topping" | "side";
}

export type PaymentMethod = "card" | "cash";

export interface OrderData {
  userId: string;
  items: string; // JSON stringified cart items
  totalAmount: number;
  deliveryFee: number;
  discount: number;
  finalAmount: number;
  paymentIntentId: string;
  paymentStatus: "pending" | "succeeded" | "failed" | "cash_on_delivery";
  orderStatus:
    | "pending"
    | "confirmed"
    | "preparing"
    | "on_the_way"
    | "delivered"
    | "cancelled";
  deliveryAddress?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
}

// Offer / OfferItem types live in constants/offers.constants.ts (co-located
// with the demo data).
